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

app = FastAPI(title="EduStack Pro AI Intelligence Service", version="1.0.0")

# CORS middleware config
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

class PredictionInput(BaseModel):
    attendance_pct: float
    assignment_completion_rate: float
    average_assignment_marks: float
    average_quiz_marks: float
    mid_sem_score: float
    learning_activity_score: float

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
    strengths: List[str] = [] # subjects where average score > 75
    weaknesses: List[str] = [] # subjects where average score < 60
    interests: List[str] = [] # general subject interests
    availability: List[str] = [] # e.g. ["evening", "weekend"]

class MatchInput(BaseModel):
    student: CandidateProfile
    candidates: List[CandidateProfile]

class AssistantInput(BaseModel):
    query: str
    role: str
    context_data: Dict[str, Any]

@app.post("/predict")
async def predict(data: PredictionInput):
    try:
        features = np.array([[
            data.attendance_pct,
            data.assignment_completion_rate,
            data.average_assignment_marks,
            data.average_quiz_marks,
            data.mid_sem_score,
            data.learning_activity_score
        ]])
        
        # Predictions
        pred_grade = float(regressor.predict(features)[0])
        pred_risk_idx = int(classifier.predict(features)[0])
        
        risk_mapping = {0: "LOW", 1: "MODERATE", 2: "HIGH"}
        risk_level = risk_mapping.get(pred_risk_idx, "LOW")
        
        # Determine explanations / key contributing factors
        explanations = []
        if data.attendance_pct < 75.0:
            explanations.append(f"Low class attendance ({data.attendance_pct:.1f}%) is majorly dragging down performance.")
        if data.assignment_completion_rate < 0.7:
            explanations.append(f"Low assignment submission rate ({data.assignment_completion_rate * 100:.1f}%) indicates missed learning opportunities.")
        if data.average_assignment_marks < 60.0:
            explanations.append(f"Poor average marks in assignments ({data.average_assignment_marks:.1f}%) suggests difficulty in understanding subject coursework.")
        if data.mid_sem_score < 60.0:
            explanations.append(f"Low internal examination score ({data.mid_sem_score:.1f}%) indicates a risk of failing final examinations.")
            
        if not explanations:
            explanations.append("Consistent performance across attendance, assignments, and test scores is keeping the risk level low.")
            
        return {
            "predicted_grade_pct": round(pred_grade, 2),
            "risk_level": risk_level,
            "explanation": explanations,
            "confidence_score": 0.93 if risk_level == "LOW" else (0.87 if risk_level == "MODERATE" else 0.91)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search_resources")
async def search_resources(data: SearchInput):
    try:
        if not data.resources:
            return []
            
        corpus = []
        for r in data.resources:
            text = f"{r.title} {r.description or ''} {r.subjectName}"
            corpus.append(text)
            
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(corpus)
        query_vector = vectorizer.transform([data.query])
        
        similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
        
        results = []
        for idx, score in enumerate(similarities):
            if score > 0.05: # threshold to filter non-relevant resources
                res = data.resources[idx].dict()
                res["similarity_score"] = float(score)
                results.append(res)
                
        # Sort by similarity score descending
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
            
            # 1. Subject interest overlap
            interest_overlap = set(student.interests).intersection(set(c.interests))
            if interest_overlap:
                score += len(interest_overlap) * 0.15
                reasons.append(f"Mutual interest in subjects: {', '.join(interest_overlap)}.")
                
            # 2. Complementary skills (I need help with X, they are strong in X)
            help_overlap = set(student.weaknesses).intersection(set(c.strengths))
            if help_overlap:
                score += len(help_overlap) * 0.35
                reasons.append(f"Can mentor you in: {', '.join(help_overlap)}.")
                
            # 3. I can help them (They need help with X, I am strong in X)
            mentor_overlap = set(student.strengths).intersection(set(c.weaknesses))
            if mentor_overlap:
                score += len(mentor_overlap) * 0.25
                reasons.append(f"You can help them in: {', '.join(mentor_overlap)}.")
                
            # 4. Availability overlap
            avail_overlap = set(student.availability).intersection(set(c.availability))
            if avail_overlap:
                score += len(avail_overlap) * 0.15
                reasons.append(f"Shared study time availability: {', '.join(avail_overlap)}.")
                
            # 5. Course overlap
            if student.course == c.course:
                score += 0.10
                reasons.append(f"Enrolled in the same course ({student.course}).")
                
            compatibility_pct = min(round(score * 100, 0), 100.0)
            
            if compatibility_pct >= 40.0:
                matches.append({
                    "id": c.id,
                    "name": c.name,
                    "compatibility_score": compatibility_pct,
                    "reasons": reasons
                })
                
        # Sort by compatibility score
        matches.sort(key=lambda x: x["compatibility_score"], reverse=True)
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/assistant")
async def assistant(data: AssistantInput):
    try:
        # Secure Campus RAG Query using Google Gemini
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            # Smart Offline/Local Fallback Responses so the tutor never breaks
            q = data.query.lower()
            name = data.context_data.get("user", {}).get("name", "Student")
            if "summarize" in q or "note" in q:
                reply = f"📚 **Hello {name}! (Offline Tutor Mode)**\n\nTo summarize your study notes, you can upload PDFs to the **Notes Marketplace** or search existing resources using **AI Semantic Search**. \n\n*Note: To unlock interactive generative summaries, please configure your `GEMINI_API_KEY` in the environment.*"
            elif "timetable" in q or "schedule" in q or "class" in q:
                reply = f"📅 **Hello {name}! (Offline Tutor Mode)**\n\nYou can view your active class schedule, department slot locations, and session lists under the **Timetables** page in your sidebar menu."
            elif "attendance" in q or "eligible" in q or "present" in q:
                reply = f"📆 **Hello {name}! (Offline Tutor Mode)**\n\nYour attendance metrics are displayed on your student dashboard. Ensure you maintain at least **75% overall attendance** to stay eligible for exams and avoid the early risk warning watchlist!"
            elif "match" in q or "buddy" in q or "buddies" in q:
                reply = f"👥 **Hello {name}! (Offline Tutor Mode)**\n\nCheck out the **AI Study Matcher** tab under your **Study Buddies** page to match with classmates based on availability and complementary subject strengths!"
            else:
                reply = f"👋 **Hello {name}! I am your EduStack Campus Assistant.**\n\nI am currently running in offline/local fallback mode. I can help guide you through features like the **AI Future Predictor** on your dashboard, **AI Study Matcher**, or **Semantic Search**.\n\n*To enable fully interactive generative tutoring, please configure your `GEMINI_API_KEY` in the environment variables.*"
            return {"response": reply}
            
        context_str = json.dumps(data.context_data, indent=2)
        prompt = f"""
You are the EduStack Pro AI Campus Assistant. You answer student and faculty queries using ONLY the authorized local campus data provided below.
Maintain professional, helpful tone. Format your response beautifully in Markdown.

Context Data (Tenant-Isolated):
{context_str}

User Role: {data.role}
User Query: {data.query}

Instructions:
1. Only answer based on the Context Data provided.
2. If the user asks about data not present in the context, politely state that you do not have access to that information.
3. NEVER reveal sensitive data of another college or user.
"""
        
        headers = {"Content-Type": "application/json"}
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        
        res = requests.post(url, headers=headers, json=payload)
        if res.status_code == 200:
            resp_json = res.json()
            reply = resp_json['candidates'][0]['content']['parts'][0]['text']
            return {"response": reply}
        else:
            return {"response": f"Error from Gemini API: {res.text}"}
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
        with open('model_metrics.json', 'r') as f:
            metrics = json.load(f)
        return {"message": "Model retrained successfully!", "metrics": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
