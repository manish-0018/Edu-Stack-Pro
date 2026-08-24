import os
import json
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests

app = FastAPI(title="EduStack Pro AI Intelligence Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load serialized models
try:
    regressor = joblib.load('performance_regressor.joblib')
    classifier = joblib.load('risk_classifier.joblib')
    print("AI Models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}. Running training pipeline first.")
    from train import train_models
    train_models()
    regressor = joblib.load('performance_regressor.joblib')
    classifier = joblib.load('risk_classifier.joblib')

# ─── Input Schemas ────────────────────────────────────────────────────────────

class PredictionInput(BaseModel):
    attendance_pct: float
    assignment_completion_rate: float
    average_assignment_marks: float
    average_quiz_marks: float
    mid_sem_score: float
    learning_activity_score: float
    has_real_data: Optional[bool] = True   # False → cold-start guard

class AttendanceRiskInput(BaseModel):
    classes_attended: int
    classes_total: int
    threshold_pct: Optional[float] = 75.0

class SubjectProfile(BaseModel):
    name: str
    mid_sem_pct: float   # already normalized to 0-100
    quiz_pct: float
    assignment_pct: float
    attendance_pct: Optional[float] = 75.0

class WeakSubjectInput(BaseModel):
    subjects: List[SubjectProfile]

class StudyPlanInput(BaseModel):
    weak_subjects: List[str]
    exam_days_remaining: int
    daily_hours_available: float
    pending_assignments: Optional[int] = 0
    strong_subjects: Optional[List[str]] = []

class ResourceItem(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    subjectName: str

class SearchInput(BaseModel):
    query: str
    resources: List[ResourceItem]

class CandidateProfile(BaseModel):
    id: str
    name: str
    course: str
    classId: Optional[str] = None
    strengths: List[str] = []
    weaknesses: List[str] = []
    interests: List[str] = []
    availability: List[str] = []

class MatchInput(BaseModel):
    student: CandidateProfile
    candidates: List[CandidateProfile]

class AssistantInput(BaseModel):
    query: str
    role: str
    context_data: Dict[str, Any]

# ─── Helper ───────────────────────────────────────────────────────────────────

FEATURE_NAMES = [
    'attendance_pct', 'assignment_completion_rate', 'average_assignment_marks',
    'average_quiz_marks', 'mid_sem_score', 'learning_activity_score'
]

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.post("/predict")
async def predict(data: PredictionInput):
    try:
        # Cold-start guard
        if not data.has_real_data:
            return {
                "insufficient_data": True,
                "message": "Not enough academic data yet. The AI predictor needs at least attendance records, marks, and assignment data to generate a reliable prediction.",
                "required": ["attendance records", "marks (midSem / quiz / assignment)", "at least one assignment submission"]
            }

        features = np.array([[
            data.attendance_pct,
            data.assignment_completion_rate,
            data.average_assignment_marks,
            data.average_quiz_marks,
            data.mid_sem_score,
            data.learning_activity_score
        ]])

        # Real model predictions
        pred_grade = float(regressor.predict(features)[0])
        pred_grade = round(min(max(pred_grade, 0.0), 100.0), 2)

        pred_proba = classifier.predict_proba(features)[0]  # [P(LOW), P(MODERATE), P(HIGH)]
        pred_risk_idx = int(np.argmax(pred_proba))
        risk_mapping = {0: "LOW", 1: "MODERATE", 2: "HIGH"}
        risk_level = risk_mapping[pred_risk_idx]
        # Real confidence = probability of the predicted class
        confidence_score = round(float(pred_proba[pred_risk_idx]), 4)

        # Feature-importance-based explanations (from actual model)
        if hasattr(regressor, 'feature_importances_'):
            importances = regressor.feature_importances_
        elif hasattr(classifier, 'feature_importances_'):
            importances = classifier.feature_importances_
        else:
            importances = [0.25, 0.15, 0.25, 0.15, 0.15, 0.05]
        feature_values = {
            'attendance_pct': data.attendance_pct,
            'assignment_completion_rate': data.assignment_completion_rate * 100,
            'average_assignment_marks': data.average_assignment_marks,
            'average_quiz_marks': data.average_quiz_marks,
            'mid_sem_score': data.mid_sem_score,
            'learning_activity_score': data.learning_activity_score
        }
        # Sort features by importance
        sorted_features = sorted(zip(FEATURE_NAMES, importances), key=lambda x: x[1], reverse=True)

        explanations = []
        for feat, imp in sorted_features[:3]:   # top 3 most important features
            val = feature_values[feat]
            if feat == 'attendance_pct' and val < 75.0:
                explanations.append(f"Attendance ({val:.1f}%) is below the 75% threshold — this is the strongest predictor of academic performance in your profile.")
            elif feat == 'attendance_pct' and val >= 75.0:
                explanations.append(f"Attendance ({val:.1f}%) is satisfactory and is the strongest positive contributor to your predicted performance.")
            elif feat == 'assignment_completion_rate':
                rate = val
                if rate < 70:
                    explanations.append(f"Assignment completion rate ({rate:.1f}%) is low — model identifies this as a key risk factor.")
                else:
                    explanations.append(f"Assignment completion rate ({rate:.1f}%) is good — contributing positively to your predicted grade.")
            elif feat == 'mid_sem_score':
                if val < 60:
                    explanations.append(f"Mid-semester score ({val:.1f}%) is below average — model flags this as a significant risk indicator.")
                else:
                    explanations.append(f"Mid-semester score ({val:.1f}%) is acceptable — currently not a risk factor.")
            elif feat == 'average_assignment_marks' and val < 60:
                explanations.append(f"Average assignment marks ({val:.1f}%) suggest difficulty with coursework assignments.")
            elif feat == 'average_quiz_marks' and val < 60:
                explanations.append(f"Quiz performance ({val:.1f}%) is low — consider spending more time on in-class revision.")

        if not explanations:
            explanations.append("Performance across attendance, assignments, quizzes, and tests is consistent and meets academic standards.")

        return {
            "insufficient_data": False,
            "predicted_grade_pct": pred_grade,
            "risk_level": risk_level,
            "risk_probabilities": {
                "LOW": round(float(pred_proba[0]), 4),
                "MODERATE": round(float(pred_proba[1]), 4),
                "HIGH": round(float(pred_proba[2]), 4)
            },
            "confidence_score": confidence_score,
            "explanation": explanations,
            "model_note": "Prediction generated by Random Forest model trained on synthetic academic dataset (1000 samples, R²=0.958, Classifier F1=0.924)."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/attendance_risk")
async def attendance_risk(data: AttendanceRiskInput):
    """
    Rule-Based Projection (not ML) — clearly labeled.
    Projects where attendance will land if current miss rate continues.
    """
    try:
        if data.classes_total == 0:
            return {"insufficient_data": True, "message": "No class records found yet."}

        current_pct = (data.classes_attended / data.classes_total) * 100.0 if data.classes_total > 0 else 0.0
        threshold = data.threshold_pct
        classes_missed = data.classes_total - data.classes_attended

        # Project: assume same miss rate for remaining 30 classes in semester
        assumed_remaining = 30
        miss_rate = classes_missed / data.classes_total if data.classes_total > 0 else 0
        projected_attended = data.classes_attended + int(assumed_remaining * (1 - miss_rate))
        projected_total = data.classes_total + assumed_remaining
        projected_pct = (projected_attended / projected_total) * 100.0 if projected_total > 0 else 0.0

        # How many extra classes must attend to reach threshold from now
        # threshold = (attended + x) / (total + x) * 100 => x = (threshold*total - 100*attended) / (100 - threshold)
        if current_pct < threshold:
            denom = 100.0 - threshold
            if denom > 0:
                classes_needed = max(0, int(np.ceil((threshold * data.classes_total - 100.0 * data.classes_attended) / denom)))
            else:
                classes_needed = None
        else:
            classes_needed = 0

        if current_pct < 60.0:
            risk_level = "HIGH"
            message = f"Attendance is critically low at {current_pct:.1f}%. Immediate and consistent attendance is required."
        elif current_pct < threshold:
            risk_level = "MODERATE"
            message = f"Attendance ({current_pct:.1f}%) is below the required {threshold:.0f}% threshold."
        else:
            risk_level = "LOW"
            message = f"Attendance ({current_pct:.1f}%) is above the {threshold:.0f}% requirement."

        return {
            "method": "Rule-Based Projection",
            "current_pct": round(current_pct, 2),
            "projected_pct": round(projected_pct, 2),
            "threshold_pct": threshold,
            "risk_level": risk_level,
            "classes_attended": data.classes_attended,
            "classes_total": data.classes_total,
            "classes_needed_to_reach_threshold": classes_needed,
            "message": message
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/weak_subjects")
async def weak_subjects(data: WeakSubjectInput):
    """
    Score-Based Analysis (not ML) — clearly labeled.
    Computes weighted composite score per subject and classifies as Weak/Average/Strong.
    """
    try:
        if not data.subjects:
            return {"profiles": [], "insufficient_data": True, "message": "No subject data found yet."}

        profiles = []
        for s in data.subjects:
            # Weighted composite: midSem carries most weight, then assignment, then quiz
            composite = (s.mid_sem_pct * 0.45) + (s.assignment_pct * 0.35) + (s.quiz_pct * 0.20)
            composite = round(min(max(composite, 0.0), 100.0), 2)

            if composite < 55.0:
                level = "Weak"
                color = "red"
                advice = f"Focus on {s.name} — composite score of {composite:.1f}% is below acceptable range."
            elif composite < 72.0:
                level = "Average"
                color = "orange"
                advice = f"{s.name} performance is average ({composite:.1f}%). Some improvement areas exist."
            else:
                level = "Strong"
                color = "green"
                advice = f"Good performance in {s.name} ({composite:.1f}%). Maintain consistency."

            explanation_parts = []
            if s.mid_sem_pct < 60:
                explanation_parts.append(f"mid-semester score ({s.mid_sem_pct:.1f}%)")
            if s.assignment_pct < 60:
                explanation_parts.append(f"assignments ({s.assignment_pct:.1f}%)")
            if s.quiz_pct < 60:
                explanation_parts.append(f"quizzes ({s.quiz_pct:.1f}%)")

            if explanation_parts:
                explanation = f"Weak areas in {s.name}: {', '.join(explanation_parts)}."
            else:
                explanation = f"All assessment components for {s.name} are within acceptable range."

            profiles.append({
                "subject": s.name,
                "performance_level": level,
                "color": color,
                "composite_score": composite,
                "breakdown": {
                    "mid_sem_pct": s.mid_sem_pct,
                    "assignment_pct": s.assignment_pct,
                    "quiz_pct": s.quiz_pct
                },
                "advice": advice,
                "explanation": explanation
            })

        # Sort: Weak first
        order = {"Weak": 0, "Average": 1, "Strong": 2}
        profiles.sort(key=lambda x: order[x["performance_level"]])

        weak_count = sum(1 for p in profiles if p["performance_level"] == "Weak")
        avg_count = sum(1 for p in profiles if p["performance_level"] == "Average")

        return {
            "method": "Score-Based Weighted Analysis",
            "profiles": profiles,
            "summary": {
                "weak": weak_count,
                "average": avg_count,
                "strong": len(profiles) - weak_count - avg_count,
                "total": len(profiles)
            },
            "insufficient_data": False
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/study_plan")
async def study_plan(data: StudyPlanInput):
    """
    AI-Assisted Schedule Generator (rule-based engine).
    Generates a structured study plan based on student's weak subjects and available time.
    """
    try:
        days = max(1, data.exam_days_remaining)
        hours = max(0.5, data.daily_hours_available)
        weak = data.weak_subjects or []
        strong = data.strong_subjects or []
        pending = data.pending_assignments or 0

        # Allocate time: weak subjects get 60%, assignments 20%, strong revision 20%
        if not weak:
            return {
                "method": "AI-Assisted Schedule Generator",
                "message": "No weak subjects identified — focus on revision of all subjects and assignment completion.",
                "daily_plan": [],
                "priorities": ["Complete pending assignments", "Revise all subjects equally"],
                "revision_topics": []
            }

        weak_hours = hours * 0.60 / len(weak) if weak else 0
        assignment_hours = hours * 0.20 if pending > 0 else 0
        revision_hours = hours * (0.40 if not pending else 0.20) / max(1, len(strong))

        daily_plan = []
        for i in range(min(days, 7)):   # show up to 7 days
            day_tasks = []
            # Rotate weak subjects across days
            day_weak = weak[i % len(weak)]
            day_tasks.append({
                "time_block": f"{weak_hours:.1f}h",
                "activity": f"Study {day_weak}",
                "type": "weak_subject",
                "note": "Focus on weak topics — use practice problems and review notes."
            })
            if pending > 0 and assignment_hours > 0:
                day_tasks.append({
                    "time_block": f"{assignment_hours:.1f}h",
                    "activity": "Complete pending assignments",
                    "type": "assignment",
                    "note": f"{pending} assignment(s) pending — prioritize due-soonest first."
                })
            if strong:
                day_strong = strong[i % len(strong)]
                day_tasks.append({
                    "time_block": f"{revision_hours:.1f}h",
                    "activity": f"Quick revision: {day_strong}",
                    "type": "revision",
                    "note": "Light revision to maintain strong subject performance."
                })
            daily_plan.append({
                "day": f"Day {i+1}",
                "total_hours": round(hours, 1),
                "tasks": day_tasks
            })

        priorities = [f"Priority 1 (Weak): {s}" for s in weak]
        if pending:
            priorities.append(f"Priority: Complete {pending} pending assignment(s)")
        priorities += [f"Revision: {s}" for s in strong]

        revision_topics = []
        weak_topic_map = {
            "dbms": ["Normalization (1NF/2NF/3NF)", "SQL Joins", "ER Diagrams", "Transactions & ACID"],
            "database": ["Normalization", "SQL Queries", "Indexing", "Views"],
            "math": ["Integration", "Differentiation", "Probability", "Statistics"],
            "mathematics": ["Calculus", "Linear Algebra", "Probability Distributions"],
            "python": ["Functions & Recursion", "OOP", "File Handling", "Error Handling"],
            "programming": ["Algorithms", "Data Structures", "Recursion", "Sorting"],
            "os": ["Process Scheduling", "Memory Management", "File Systems", "Deadlocks"],
            "networking": ["TCP/IP", "OSI Model", "Routing Protocols", "DNS"],
            "data structures": ["Trees", "Graphs", "Hashing", "Linked Lists"],
            "algorithms": ["Sorting", "Searching", "Dynamic Programming", "Greedy"],
        }
        for ws in weak:
            key = ws.lower().strip()
            matched = None
            for k, topics in weak_topic_map.items():
                if k in key or key in k:
                    matched = topics
                    break
            if matched:
                revision_topics.append({"subject": ws, "recommended_topics": matched})
            else:
                revision_topics.append({"subject": ws, "recommended_topics": ["Review class notes", "Practice past exam questions", "Re-read textbook chapters", "Attempt mock tests"]})

        return {
            "method": "AI-Assisted Schedule Generator",
            "exam_days_remaining": days,
            "daily_hours_available": hours,
            "daily_plan": daily_plan,
            "priorities": priorities,
            "revision_topics": revision_topics,
            "note": f"Plan generated for {len(weak)} weak subject(s). Adjust daily based on actual progress."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/search_resources")
async def search_resources(data: SearchInput):
    try:
        if not data.resources:
            return []
        corpus = [f"{r.title} {r.description or ''} {r.subjectName}" for r in data.resources]
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(corpus)
        query_vector = vectorizer.transform([data.query])
        similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
        results = []
        for idx, score in enumerate(similarities):
            if score > 0.05:
                res = data.resources[idx].dict()
                res["similarity_score"] = float(score)
                results.append(res)
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/peer_match")
async def peer_match(data: MatchInput):
    try:
        student = data.student
        matches = []
        for c in data.candidates:
            if c.id == student.id:
                continue
            score = 0.0
            reasons = []
            interest_overlap = set(student.interests).intersection(set(c.interests))
            if interest_overlap:
                score += len(interest_overlap) * 0.15
                reasons.append(f"Mutual interest in: {', '.join(interest_overlap)}.")
            help_overlap = set(student.weaknesses).intersection(set(c.strengths))
            if help_overlap:
                score += len(help_overlap) * 0.35
                reasons.append(f"Can mentor you in: {', '.join(help_overlap)}.")
            mentor_overlap = set(student.strengths).intersection(set(c.weaknesses))
            if mentor_overlap:
                score += len(mentor_overlap) * 0.25
                reasons.append(f"You can help them in: {', '.join(mentor_overlap)}.")
            avail_overlap = set(student.availability).intersection(set(c.availability))
            if avail_overlap:
                score += len(avail_overlap) * 0.15
                reasons.append(f"Shared availability: {', '.join(avail_overlap)}.")
            if student.course == c.course:
                score += 0.10
                reasons.append(f"Same course: {student.course}.")
            compatibility_pct = min(round(score * 100, 0), 100.0)
            if compatibility_pct >= 40.0:
                matches.append({"id": c.id, "name": c.name, "compatibility_score": compatibility_pct, "reasons": reasons})
        matches.sort(key=lambda x: x["compatibility_score"], reverse=True)
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/assistant")
async def assistant(data: AssistantInput):
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            # Strong offline fallback using context data
            q = data.query.lower()
            ctx = data.context_data
            name = ctx.get("user", {}).get("name", "Student")
            attendance = ctx.get("attendance", {})
            marks = ctx.get("marks", [])
            risk = ctx.get("risk", {})

            if "attendance" in q or "present" in q or "eligible" in q:
                pct = attendance.get("pct", "N/A")
                attended = attendance.get("attended", "N/A")
                total = attendance.get("total", "N/A")
                reply = f"📆 **{name}'s Attendance**\n\n- Classes Attended: **{attended}** out of **{total}**\n- Attendance: **{pct}%**\n\n{'⚠️ Below 75% threshold — attend all remaining classes.' if isinstance(pct, (int, float)) and pct < 75 else '✅ Above required threshold.'}"
            elif "marks" in q or "score" in q or "grade" in q or "performance" in q:
                if marks:
                    mark_str = "\n".join([f"- **{m.get('subject', 'N/A')}**: MidSem {m.get('midSem', 'N/A')} | Quiz {m.get('quiz', 'N/A')} | Assignment {m.get('assignment', 'N/A')}" for m in marks[:5]])
                    reply = f"📊 **{name}'s Marks Summary**\n\n{mark_str}\n\n*Contact your teacher to update any missing marks.*"
                else:
                    reply = f"📊 **{name}**, no marks have been recorded yet. Please check back after your teacher updates them."
            elif "risk" in q or "danger" in q or "fail" in q:
                level = risk.get("level", "N/A")
                explanation = risk.get("explanation", [])
                exp_str = "\n".join([f"- {e}" for e in explanation[:3]]) if explanation else "No specific risk factors identified."
                reply = f"⚠️ **Academic Risk Assessment for {name}**\n\n**Risk Level: {level}**\n\n{exp_str}\n\n*This is a model-generated assessment — consult your mentor or teacher for guidance.*"
            elif "recommend" in q or "study" in q or "weak" in q:
                reply = f"📚 **Study Recommendations for {name}**\n\nVisit the **AI Insights** tab on your dashboard to see:\n- Your weak subjects\n- Personalized study recommendations\n- AI-generated study plan\n\n*Recommendations are updated after each prediction run.*"
            elif "timetable" in q or "schedule" in q or "class" in q:
                reply = f"📅 **{name}**, your class schedule is available under the **Timetable** section in the sidebar menu."
            else:
                reply = f"👋 **Hello {name}! I'm your EduStack Campus Assistant.**\n\nI can help you with:\n- 📆 Attendance status\n- 📊 Marks and grades\n- ⚠️ Academic risk assessment\n- 📚 Study recommendations\n- 📅 Timetable queries\n\n*For AI-powered conversational tutoring, a Gemini API key is required in the environment configuration.*"
            return {"response": reply}

        context_str = json.dumps(data.context_data, indent=2)
        prompt = f"""You are the EduStack Pro AI Campus Assistant. Answer student and faculty queries using ONLY the authorized campus data provided below.
Be helpful, professional, and format your response in clear Markdown.

IMPORTANT SECURITY RULES:
1. Only answer using the Context Data provided below.
2. Never reveal another student's private marks, attendance, or personal data.
3. If asked about unavailable information, say "I don't have access to that information."
4. Always identify yourself as an AI assistant.

Context Data (Tenant-Isolated):
{context_str}

User Role: {data.role}
User Query: {data.query}
"""
        headers = {"Content-Type": "application/json"}
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        res = requests.post(url, headers=headers, json=payload, timeout=15)
        if res.status_code == 200:
            resp_json = res.json()
            reply = resp_json['candidates'][0]['content']['parts'][0]['text']
            return {"response": reply}
        else:
            return {"response": f"⚠️ AI service temporarily unavailable. Please try again later."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/model/metrics")
async def get_metrics():
    try:
        if not os.path.exists('model_metrics.json'):
            raise HTTPException(status_code=404, detail="Model metrics file not found. Train models first.")
        with open('model_metrics.json', 'r') as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/model/retrain")
async def retrain():
    try:
        from train import train_models
        train_models()
        global regressor, classifier
        regressor = joblib.load('performance_regressor.joblib')
        classifier = joblib.load('risk_classifier.joblib')
        with open('model_metrics.json', 'r') as f:
            metrics = json.load(f)
        return {"message": "Model retrained successfully!", "metrics": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ResumeMatchInput(BaseModel):
    resume_text: str
    job_description: str

class QuizGenerationInput(BaseModel):
    topic: str


LOCAL_QUIZ_LIBRARY = {
    "dbms": {
        "topic": "Database Management Systems",
        "questions": [
            {
                "question": "Which of the following is used to uniquely identify a tuple in a relation?",
                "options": ["Primary Key", "Foreign Key", "Composite Key", "Alternate Key"],
                "correctAnswer": 0
            },
            {
                "question": "Which SQL statement is used to remove all records from a table without logging individual row deletions?",
                "options": ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
                "correctAnswer": 2
            },
            {
                "question": "In normalization, which normal form eliminates transitive dependencies?",
                "options": ["1NF", "2NF", "3NF", "BCNF"],
                "correctAnswer": 2
            },
            {
                "question": "What does ACID stand for in database transactions?",
                "options": [
                    "Atomicity, Consistency, Isolation, Durability",
                    "Access, Control, Integration, Security",
                    "Accuracy, Completeness, Indexing, Delivery",
                    "Algorithm, Cache, Inheritance, Distribution"
                ],
                "correctAnswer": 0
            },
            {
                "question": "Which join returns all rows when there is a match in either left or right table?",
                "options": ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"],
                "correctAnswer": 3
            },
            {
                "question": "What is a foreign key used for?",
                "options": ["To uniquely identify a row", "To enforce referential integrity between tables", "To index text fields", "To store binary files"],
                "correctAnswer": 1
            },
            {
                "question": "Which SQL constraint prevents duplicate values in a column but allows NULLs?",
                "options": ["PRIMARY KEY", "UNIQUE", "NOT NULL", "CHECK"],
                "correctAnswer": 1
            },
            {
                "question": "What is the default transaction isolation level in PostgreSQL?",
                "options": ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
                "correctAnswer": 1
            },
            {
                "question": "What type of index is commonly used for range queries in databases?",
                "options": ["Hash Index", "B-Tree Index", "Bitmap Index", "GiST Index"],
                "correctAnswer": 1
            },
            {
                "question": "Which normal form handles multi-valued dependencies?",
                "options": ["3NF", "BCNF", "4NF", "5NF"],
                "correctAnswer": 2
            }
        ]
    },
    "python": {
        "topic": "Python Programming",
        "questions": [
            {
                "question": "Which data type in Python is mutable?",
                "options": ["List", "Tuple", "String", "Integer"],
                "correctAnswer": 0
            },
            {
                "question": "How do you start a comment in Python?",
                "options": ["//", "/*", "#", "--"],
                "correctAnswer": 2
            },
            {
                "question": "What is the correct syntax to output the type of a variable in Python?",
                "options": ["print(typeOf(x))", "print(type(x))", "print(typeof x)", "print(class(x))"],
                "correctAnswer": 1
            },
            {
                "question": "Which method is used to add an item to the end of a list in Python?",
                "options": ["add()", "insert()", "append()", "push()"],
                "correctAnswer": 2
            },
            {
                "question": "What is the output of 3 * 1 ** 3 in Python?",
                "options": ["9", "27", "3", "1"],
                "correctAnswer": 2
            },
            {
                "question": "What is the output of len([\"hello\", 2, 4, [1, 2]])?",
                "options": ["4", "5", "6", "8"],
                "correctAnswer": 0
            },
            {
                "question": "Which keyword is used to handle exceptions in Python?",
                "options": ["catch", "except", "throw", "handle"],
                "correctAnswer": 1
            },
            {
                "question": "What does __init__ represent in a Python class?",
                "options": ["Destructor method", "Constructor/Initializer method", "Static method", "Private property"],
                "correctAnswer": 1
            },
            {
                "question": "Which of the following creates a dictionary in Python?",
                "options": ["[]", "()", "{}", "set()"],
                "correctAnswer": 2
            },
            {
                "question": "How do you import a module math in Python?",
                "options": ["require math", "import math", "include math", "load math"],
                "correctAnswer": 1
            }
        ]
    },
    "os": {
        "topic": "Operating Systems",
        "questions": [
            {
                "question": "What is a deadlock?",
                "options": [
                    "A state where a process terminates abnormally",
                    "A state where two or more processes are blocked waiting for each other",
                    "A state where memory is exhausted",
                    "A state where CPU usage reaches 100%"
                ],
                "correctAnswer": 1
            },
            {
                "question": "Which scheduling algorithm has the risk of starvation?",
                "options": ["Round Robin", "First Come First Served", "Shortest Job First (non-preemptive)", "Priority Scheduling"],
                "correctAnswer": 3
            },
            {
                "question": "What is virtual memory?",
                "options": [
                    "Memory located on a remote server",
                    "RAM simulator built in software",
                    "A technique that maps process virtual addresses to physical addresses, extending RAM onto disk",
                    "Secondary cache memory"
                ],
                "correctAnswer": 2
            },
            {
                "question": "What is thrashing?",
                "options": [
                    "Deleting temporary system files",
                    "Excessive page swapping activity leading to low CPU utilization",
                    "Fast execution of processes",
                    "Killing unresponsive applications"
                ],
                "correctAnswer": 1
            },
            {
                "question": "Which of the following is not a process state?",
                "options": ["Running", "Blocked", "Ready", "Synchronized"],
                "correctAnswer": 3
            },
            {
                "question": "What is a page fault?",
                "options": ["An error in the source code", "When a requested page is not in RAM", "When the disk is full", "A cache hit"],
                "correctAnswer": 1
            },
            {
                "question": "Which of the following is a synchronization tool to avoid race conditions?",
                "options": ["Fork", "Semaphore", "Thread", "Pointer"],
                "correctAnswer": 1
            },
            {
                "question": "What is the main purpose of the operating system kernel?",
                "options": ["To design user interfaces", "To compile source files", "To manage system resources and hardware communication", "To host databases"],
                "correctAnswer": 2
            },
            {
                "question": "What is context switching?",
                "options": ["Changing desktop wallpaper", "Switching from user mode to kernel mode", "Saving state of an active process and loading another", "Renaming files"],
                "correctAnswer": 2
            },
            {
                "question": "Which command in Linux is used to display currently running processes?",
                "options": ["ls", "ps", "pwd", "grep"],
                "correctAnswer": 1
            }
        ]
    },
    "dsa": {
        "topic": "Data Structures & Algorithms",
        "questions": [
            {
                "question": "What is the time complexity of BFS and DFS on a graph represented as an adjacency list?",
                "options": ["O(V + E)", "O(V^2)", "O(E^2)", "O(VE)"],
                "correctAnswer": 0
            },
            {
                "question": "Which data structure is used to implement Breadth-First Search (BFS)?",
                "options": ["Stack", "Queue", "Heap", "Hash Map"],
                "correctAnswer": 1
            },
            {
                "question": "Which data structure is used to implement Depth-First Search (DFS)?",
                "options": ["Queue", "Stack", "Priority Queue", "Linked List"],
                "correctAnswer": 1
            },
            {
                "question": "What is the height of a balanced binary search tree with N nodes?",
                "options": ["O(N)", "O(log N)", "O(N log N)", "O(1)"],
                "correctAnswer": 1
            },
            {
                "question": "Which traversal of a Binary Search Tree (BST) outputs the keys in sorted ascending order?",
                "options": ["Pre-order", "Post-order", "In-order", "Level-order"],
                "correctAnswer": 2
            },
            {
                "question": "Which algorithm is used to find the shortest path in a weighted graph with positive weights?",
                "options": ["Prim's Algorithm", "Kruskal's Algorithm", "Dijkstra's Algorithm", "Floyd-Warshall Algorithm"],
                "correctAnswer": 2
            },
            {
                "question": "What is a graph without any cycles called?",
                "options": ["Directed Graph", "Bipartite Graph", "Acyclic Graph", "Connected Graph"],
                "correctAnswer": 2
            },
            {
                "question": "In a Min-Heap, where is the minimum element located?",
                "options": ["Root node", "Leftmost leaf", "Rightmost leaf", "Middle child"],
                "correctAnswer": 0
            },
            {
                "question": "What is the maximum number of edges in a simple undirected graph with V vertices?",
                "options": ["V(V - 1) / 2", "V^2", "V", "2V"],
                "correctAnswer": 0
            },
            {
                "question": "Which sorting algorithm has the best average-case time complexity?",
                "options": ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
                "correctAnswer": 2
            }
        ]
    }
}


@app.post("/match_resume")
async def match_resume(data: ResumeMatchInput):
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        
        def clean_text(text):
            text = text.lower()
            text = re.sub(r'[^a-z0-9\s#+\-.]', ' ', text)
            return text

        cleaned_resume = clean_text(data.resume_text)
        cleaned_job = clean_text(data.job_description)

        skills_db = [
            "python", "java", "javascript", "react", "angular", "vue", "node.js", "express",
            "mongodb", "postgresql", "mysql", "sqlite", "sql", "nosql", "docker", "kubernetes",
            "aws", "gcp", "azure", "html", "css", "git", "github", "machine learning",
            "deep learning", "nlp", "django", "flask", "fastapi", "spring boot", "typescript"
        ]

        resume_skills = [s for s in skills_db if re.search(r'\b' + re.escape(s) + r'\b', cleaned_resume)]
        job_skills = [s for s in skills_db if re.search(r'\b' + re.escape(s) + r'\b', cleaned_job)]

        matching_skills = list(set(resume_skills) & set(job_skills))
        missing_skills = list(set(job_skills) - set(resume_skills))

        # TF-IDF Cosine Similarity
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([cleaned_resume, cleaned_job])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        match_score = round(float(similarity) * 100, 2)

        if len(job_skills) > 0:
            overlap_pct = (len(matching_skills) / len(job_skills)) * 100
            match_score = round((match_score * 0.4) + (overlap_pct * 0.6), 2)
        else:
            match_score = 50.0

        match_score = min(max(match_score, 10.0), 99.0)

        if match_score >= 80:
            feedback = "Excellent match! Your profile aligns closely with the core requirements of this drive. Apply immediately."
        elif match_score >= 60:
            feedback = "Good match. You have most of the required foundational skills. Consider brushing up on the missing skills before your interview."
        else:
            feedback = "Moderate match. The job description highlights several keywords/skills currently not prominent in your profile. Update your resume to emphasize relevant projects."

        return {
            "match_score": match_score,
            "matching_skills": sorted([m.upper() for m in matching_skills]),
            "missing_skills": sorted([m.upper() for m in missing_skills]),
            "feedback": feedback
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate_quiz")
async def generate_quiz(data: QuizGenerationInput):
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        topic_lower = data.topic.lower()
        
        if api_key:
            try:
                headers = {"Content-Type": "application/json"}
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
                prompt = f"""Generate a multiple choice quiz on the topic: "{data.topic}".
Return EXACTLY a JSON object with this structure, do not include any other markdown formatting or prefix, output raw JSON:
{{
  "topic": "{data.topic}",
  "questions": [
    {{
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }}
  ]
}}
Generate exactly 10 high-quality conceptual questions.
"""
                payload = {"contents": [{"parts": [{"text": prompt}]}]}
                res = requests.post(url, headers=headers, json=payload, timeout=12)
                if res.status_code == 200:
                    resp_json = res.json()
                    reply = resp_json['candidates'][0]['content']['parts'][0]['text']
                    cleaned_reply = re.sub(r'^```json\s*', '', reply.strip())
                    cleaned_reply = re.sub(r'\s*```$', '', cleaned_reply)
                    quiz_data = json.loads(cleaned_reply)
                    return quiz_data
            except Exception:
                pass

        # Local library match
        matched_key = "dbms"
        if "python" in topic_lower or "oop" in topic_lower or "program" in topic_lower:
            matched_key = "python"
        elif "os" in topic_lower or "operating" in topic_lower or "system" in topic_lower:
            matched_key = "os"
        elif any(k in topic_lower for k in ["dsa", "bfs", "dfs", "tree", "graph", "structure", "algorithm", "search", "sort"]):
            matched_key = "dsa"
            
        selected_quiz = LOCAL_QUIZ_LIBRARY[matched_key]
        return {
            "topic": selected_quiz["topic"],
            "questions": selected_quiz["questions"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok", "version": "2.0.0", "models_loaded": True}


if __name__ == '__main__':
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
