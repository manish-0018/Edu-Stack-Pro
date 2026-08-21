const axios = require('axios');
const { 
  User, Mark, AttendanceRecord, Attendance, Subject, 
  Class, Task, QuizAttempt, Assignment, AssignmentSubmission,
  PredictionLog, StudyRecommendation, PeerMatch, Material
} = require('../models');
const { Op } = require('sequelize');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// ─── AI CAMPUS ASSISTANT ────────────────────────────────────────────────────
const generateResponse = async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const student = await User.findByPk(req.user.id, {
      include: [{ model: Class, attributes: ['name'] }]
    });

    // Fetch real data to inject as context
    const records = await AttendanceRecord.findAll({ where: { studentId: req.user.id } });
    let attended = 0;
    records.forEach(r => { if (['present', 'late', 'excused', 'duty'].includes(r.status)) attended++; });
    const attPct = records.length === 0 ? null : Math.round((attended / records.length) * 100);

    const marks = await Mark.findAll({ 
      where: { studentId: req.user.id }, 
      include: [{ model: Subject, attributes: ['name'] }] 
    });
    const marksFormatted = marks.map(m => ({
      subject: m.Subject?.name || 'N/A',
      midSem: m.midSem,
      quiz: m.quiz,
      assignment: m.assignment
    }));

    const contextData = {
      user: { name: student.name, role: student.role, course: student.course, className: student.Class?.name || 'N/A' },
      attendance: { pct: attPct, attended, total: records.length },
      marks: marksFormatted,
      topicContext: context || 'General Tutoring'
    };

    try {
      const mlRes = await axios.post(`${ML_SERVICE_URL}/assistant`, {
        query: prompt,
        role: req.user.role,
        context_data: contextData
      }, { timeout: 20000 });
      return res.status(200).json({ response: mlRes.data.response });
    } catch (mlErr) {
      return res.status(200).json({
        response: `🤖 **AI Assistant (Offline Mode)**\n\nI am currently operating in offline mode. Your question was: *${prompt}*\n\nPlease try again in a moment.`
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── HELPER: build features from real DB data ───────────────────────────────
const buildFeaturesForStudent = async (studentId) => {
  const student = await User.findByPk(studentId);
  if (!student) return null;

  // 1. Attendance
  const records = await AttendanceRecord.findAll({ where: { studentId } });
  let attended = 0;
  records.forEach(r => { if (['present', 'late', 'excused', 'duty'].includes(r.status)) attended++; });
  const hasAttendanceData = records.length > 0;
  const attendance_pct = hasAttendanceData ? (attended / records.length) * 100.0 : 75.0;

  // 2. Assignments
  const studentSubjects = student.classId
    ? await Subject.findAll({ where: { classId: student.classId } })
    : [];
  const subjectIds = studentSubjects.map(s => s.id);
  const allAssignments = subjectIds.length > 0 ? await Assignment.findAll({ where: { subjectId: { [Op.in]: subjectIds } } }) : [];
  const submissions = await AssignmentSubmission.findAll({ where: { studentId } });
  const hasAssignmentData = allAssignments.length > 0;
  const assignment_completion_rate = hasAssignmentData ? (submissions.length / allAssignments.length) : null;

  let totalAssMarks = 0, gradedAssCount = 0;
  submissions.forEach(sub => {
    if (sub.status === 'graded' && sub.grade !== null && sub.grade !== undefined) {
      totalAssMarks += sub.grade;
      gradedAssCount++;
    }
  });
  const average_assignment_marks = gradedAssCount > 0 ? (totalAssMarks / gradedAssCount) : null;

  // 3. Quizzes
  const quizAttempts = await QuizAttempt.findAll({ where: { studentId } });
  const hasQuizData = quizAttempts.length > 0;
  let totalQuizScore = 0;
  quizAttempts.forEach(qa => { totalQuizScore += qa.score || 0; });
  const average_quiz_marks = hasQuizData ? (totalQuizScore / quizAttempts.length) * 10.0 : null;

  // 4. Marks (mid-sem) — normalize: midSem is out of 20 → percentage
  const marks = await Mark.findAll({ 
    where: { studentId },
    include: [{ model: Subject, attributes: ['name'] }]
  });
  let totalMidSem = 0, midSemCount = 0;
  marks.forEach(m => {
    if (m.midSem !== null) {
      totalMidSem += (m.midSem / 20.0) * 100.0;  // normalize to percentage
      midSemCount++;
    }
  });
  const hasMarksData = midSemCount > 0;
  const mid_sem_score = hasMarksData ? (totalMidSem / midSemCount) : null;

  // 5. Learning activity
  const completedTasks = await Task.count({ where: { studentId, status: 'done' } });
  const learning_activity_score = Math.min(completedTasks * 12.5, 100.0);

  // Cold-start: require at least attendance + marks OR assignments
  const hasRealData = hasAttendanceData && (hasMarksData || hasAssignmentData);

  return {
    student,
    marks,
    records,
    attended,
    hasRealData,
    hasAttendanceData,
    hasMarksData,
    hasAssignmentData,
    features: {
      attendance_pct: hasAttendanceData ? attendance_pct : 75.0,
      assignment_completion_rate: assignment_completion_rate ?? 1.0,
      average_assignment_marks: average_assignment_marks ?? 70.0,
      average_quiz_marks: average_quiz_marks ?? 70.0,
      mid_sem_score: mid_sem_score ?? 70.0,
      learning_activity_score,
      has_real_data: hasRealData
    }
  };
};

// ─── PREDICT PERFORMANCE + RISK ────────────────────────────────────────────
const predictForStudent = async (studentId, collegeId) => {
  const data = await buildFeaturesForStudent(studentId);
  if (!data) return null;

  let predictionResult;
  try {
    const mlRes = await axios.post(`${ML_SERVICE_URL}/predict`, data.features, { timeout: 15000 });
    predictionResult = mlRes.data;
  } catch (mlErr) {
    // Rule-based fallback (clearly labeled)
    const { features, hasRealData } = data;
    if (!hasRealData) {
      predictionResult = {
        insufficient_data: true,
        message: 'Not enough academic data yet. The AI predictor needs attendance records, marks, and assignment data.'
      };
    } else {
      const expectedGrade = Math.min(Math.max(
        (features.attendance_pct * 0.3) + (features.average_assignment_marks * 0.3) + (features.mid_sem_score * 0.4),
        30.0), 100.0);
      let risk = 'LOW';
      const explanation = [];
      if (features.attendance_pct < 75.0) explanation.push(`Attendance is below 75% threshold (${Math.round(features.attendance_pct)}%)`);
      if (features.average_assignment_marks < 60.0) explanation.push(`Assignment performance is weak (${Math.round(features.average_assignment_marks)}%)`);
      if (features.mid_sem_score < 50.0) explanation.push(`Mid-semester score is low (${Math.round(features.mid_sem_score)}%)`);
      if (features.attendance_pct < 60.0 || expectedGrade < 50.0) risk = 'HIGH';
      else if (features.attendance_pct < 75.0 || expectedGrade < 70.0) risk = 'MODERATE';
      if (!explanation.length) explanation.push('Academic performance is stable and meets standards.');
      predictionResult = {
        insufficient_data: false,
        predicted_grade_pct: Math.round(expectedGrade),
        risk_level: risk,
        confidence_score: 0.75,
        explanation,
        model_note: 'Rule-based fallback (ML service temporarily unavailable).'
      };
    }
  }

  // Log prediction if it's real
  if (!predictionResult?.insufficient_data) {
    try {
      await PredictionLog.create({
        userId: studentId,
        collegeId,
        inputData: data.features,
        predictionResult
      });
    } catch (_) {}

    // Generate study recommendations for weak marks
    const weakMarks = data.marks.filter(m => (m.midSem !== null && (m.midSem / 20.0) * 100 < 60) || (m.quiz !== null && (m.quiz / 10.0) * 100 < 60));
    for (const wm of weakMarks) {
      const subject = wm.Subject;
      if (subject) {
        const materials = await Material.findAll({ where: { subjectId: wm.subjectId }, limit: 2 });
        const recommendedResources = materials.map(m => ({ id: m.id, title: m.title, url: m.contentUrl }));
        const midSemPct = wm.midSem !== null ? Math.round((wm.midSem / 20.0) * 100) : null;
        const quizPct = wm.quiz !== null ? Math.round((wm.quiz / 10.0) * 100) : null;
        const weakArea = midSemPct !== null && midSemPct < 60 ? `mid-semester (${midSemPct}%)` : `quiz (${quizPct}%)`;
        await StudyRecommendation.upsert({
          studentId,
          collegeId,
          subjectName: subject.name,
          priority: 1,
          weaknessScore: wm.midSem || wm.quiz || 50,
          reason: `Low marks in ${subject.name} — weak ${weakArea}. Model-identified recommendation based on score-based analysis.`,
          recommendedResources
        });
      }
    }
  }

  return predictionResult;
};

// ─── MAIN PREDICTION ROUTE ─────────────────────────────────────────────────
const predictAcademicFuture = async (req, res) => {
  try {
    const studentId = req.query.studentId || req.user.id;
    const student = await User.findByPk(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    if (student.collegeId !== req.user.collegeId) return res.status(403).json({ message: 'Access denied.' });
    const result = await predictForStudent(studentId, req.user.collegeId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── AGGREGATED STUDENT AI INSIGHTS ────────────────────────────────────────
const getStudentInsights = async (req, res) => {
  try {
    const studentId = req.user.id;
    const data = await buildFeaturesForStudent(studentId);
    if (!data) return res.status(404).json({ message: 'Student not found.' });

    const { features, records, attended, marks, hasRealData } = data;

    // 1. Performance prediction
    let prediction = null;
    try {
      const mlRes = await axios.post(`${ML_SERVICE_URL}/predict`, features, { timeout: 15000 });
      prediction = mlRes.data;
    } catch (_) {}

    // 2. Attendance risk
    let attendanceRisk = null;
    try {
      const attRes = await axios.post(`${ML_SERVICE_URL}/predict/attendance_risk`, {
        classes_attended: attended,
        classes_total: records.length,
        threshold_pct: 75.0
      }, { timeout: 10000 });
      attendanceRisk = attRes.data;
    } catch (_) {}

    // 3. Weak subjects
    let weakSubjects = null;
    if (marks.length > 0) {
      const subjectProfiles = marks.filter(m => m.Subject).map(m => ({
        name: m.Subject.name,
        mid_sem_pct: m.midSem !== null ? Math.round((m.midSem / 20.0) * 100) : 70,
        quiz_pct: m.quiz !== null ? Math.round((m.quiz / 10.0) * 100) : 70,
        assignment_pct: m.assignment !== null ? Math.round((m.assignment / 40.0) * 100) : 70
      }));
      try {
        const wsRes = await axios.post(`${ML_SERVICE_URL}/predict/weak_subjects`, { subjects: subjectProfiles }, { timeout: 10000 });
        weakSubjects = wsRes.data;
      } catch (_) {}
    }

    // 4. Recommendations from DB
    const recommendations = await StudyRecommendation.findAll({
      where: { studentId, collegeId: req.user.collegeId },
      order: [['priority', 'ASC']],
      limit: 5
    });

    // 5. Prediction history (last 5)
    const history = await PredictionLog.findAll({
      where: { userId: studentId },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.status(200).json({
      student: { name: data.student.name, course: data.student.course },
      hasRealData,
      features,
      prediction,
      attendanceRisk,
      weakSubjects,
      recommendations,
      predictionHistory: history
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── ATTENDANCE RISK ────────────────────────────────────────────────────────
const getAttendanceRisk = async (req, res) => {
  try {
    const studentId = req.query.studentId || req.user.id;
    const student = await User.findByPk(studentId);
    if (!student || student.collegeId !== req.user.collegeId) return res.status(403).json({ message: 'Access denied.' });

    const records = await AttendanceRecord.findAll({ where: { studentId } });
    let attended = 0;
    records.forEach(r => { if (['present', 'late', 'excused', 'duty'].includes(r.status)) attended++; });

    if (records.length === 0) {
      return res.status(200).json({ insufficient_data: true, message: 'No attendance records found yet.' });
    }

    const mlRes = await axios.post(`${ML_SERVICE_URL}/predict/attendance_risk`, {
      classes_attended: attended,
      classes_total: records.length,
      threshold_pct: 75.0
    }, { timeout: 10000 });

    res.status(200).json(mlRes.data);
  } catch (error) {
    // Fallback
    res.status(200).json({ insufficient_data: false, message: 'Attendance risk service temporarily unavailable.' });
  }
};

// ─── WEAK SUBJECTS ──────────────────────────────────────────────────────────
const getWeakSubjects = async (req, res) => {
  try {
    const studentId = req.query.studentId || req.user.id;
    const student = await User.findByPk(studentId);
    if (!student || student.collegeId !== req.user.collegeId) return res.status(403).json({ message: 'Access denied.' });

    const marks = await Mark.findAll({ where: { studentId }, include: [{ model: Subject, attributes: ['name'] }] });
    if (!marks.length) return res.status(200).json({ insufficient_data: true, message: 'No marks found yet.', profiles: [] });

    const subjectProfiles = marks.filter(m => m.Subject).map(m => ({
      name: m.Subject.name,
      mid_sem_pct: m.midSem !== null ? Math.round((m.midSem / 20.0) * 100) : 70,
      quiz_pct: m.quiz !== null ? Math.round((m.quiz / 10.0) * 100) : 70,
      assignment_pct: m.assignment !== null ? Math.round((m.assignment / 40.0) * 100) : 70
    }));

    const mlRes = await axios.post(`${ML_SERVICE_URL}/predict/weak_subjects`, { subjects: subjectProfiles }, { timeout: 10000 });
    res.status(200).json(mlRes.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── STUDY PLAN ─────────────────────────────────────────────────────────────
const getStudyPlan = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { exam_days_remaining = 30, daily_hours_available = 3 } = req.query;

    const marks = await Mark.findAll({ where: { studentId }, include: [{ model: Subject, attributes: ['name'] }] });
    const pending = await AssignmentSubmission.count({ where: { studentId, status: 'pending' } });

    const weak_subjects = [];
    const strong_subjects = [];
    marks.filter(m => m.Subject).forEach(m => {
      const composite = ((m.midSem / 20.0) * 0.45 + (m.assignment / 40.0) * 0.35 + (m.quiz / 10.0) * 0.20) * 100;
      if (composite < 60) weak_subjects.push(m.Subject.name);
      else if (composite >= 75) strong_subjects.push(m.Subject.name);
    });

    const mlRes = await axios.post(`${ML_SERVICE_URL}/study_plan`, {
      weak_subjects,
      exam_days_remaining: parseInt(exam_days_remaining),
      daily_hours_available: parseFloat(daily_hours_available),
      pending_assignments: pending,
      strong_subjects
    }, { timeout: 10000 });

    res.status(200).json(mlRes.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── WATCHLIST (Teachers/Admins) ─────────────────────────────────────────────
const getAtRiskWatchlist = async (req, res) => {
  try {
    const students = await User.findAll({ where: { collegeId: req.user.collegeId, role: 'student' } });
    const watchlist = [];
    await Promise.all(students.map(async (student) => {
      const result = await predictForStudent(student.id, req.user.collegeId);
      if (result && !result.insufficient_data && (result.risk_level === 'HIGH' || result.risk_level === 'MODERATE')) {
        watchlist.push({
          studentId: student.id,
          studentName: student.name,
          email: student.email,
          course: student.course || 'N/A',
          riskLevel: result.risk_level,
          predictedGrade: result.predicted_grade_pct,
          riskProbabilities: result.risk_probabilities,
          explanation: result.explanation,
          confidence: result.confidence_score
        });
      }
    }));
    watchlist.sort((a, b) => {
      const order = { HIGH: 0, MODERATE: 1 };
      return (order[a.riskLevel] ?? 2) - (order[b.riskLevel] ?? 2);
    });
    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── RECOMMENDATIONS ─────────────────────────────────────────────────────────
const getStudyRecommendations = async (req, res) => {
  try {
    const recommendations = await StudyRecommendation.findAll({
      where: { studentId: req.user.id, collegeId: req.user.collegeId },
      order: [['priority', 'ASC']]
    });
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── SEMANTIC SEARCH ──────────────────────────────────────────────────────────
const semanticSearchResources = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'Query required' });
    const materials = await Material.findAll({
      include: [{
        model: Subject,
        include: [{ model: Class, where: { collegeId: req.user.collegeId }, required: true, attributes: [] }],
        attributes: ['name'], required: true
      }]
    });
    const resources = materials.map(m => ({ id: m.id, title: m.title, description: m.title, subjectName: m.Subject?.name || '' }));
    try {
      const mlRes = await axios.post(`${ML_SERVICE_URL}/search_resources`, { query, resources }, { timeout: 10000 });
      res.status(200).json(mlRes.data);
    } catch (_) {
      const keyword = query.toLowerCase();
      res.status(200).json(materials.filter(m => m.title.toLowerCase().includes(keyword) || (m.Subject?.name || '').toLowerCase().includes(keyword)));
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PEER MATCH ───────────────────────────────────────────────────────────────
const findStudyBuddyMatches = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await User.findByPk(studentId);
    const candidates = await User.findAll({ where: { collegeId: req.user.collegeId, id: { [Op.ne]: studentId }, role: 'student' } });
    const makeProfile = async (u) => {
      const marks = await Mark.findAll({ where: { studentId: u.id }, include: [Subject] });
      const strengths = [], weaknesses = [], interests = [];
      marks.forEach(m => {
        const sub = m.Subject?.name;
        if (sub) {
          interests.push(sub);
          const avg = ((m.midSem || 0) + (m.quiz || 0) + (m.assignment || 0)) / 3.0;
          if (avg >= 75) strengths.push(sub);
          if (avg < 60) weaknesses.push(sub);
        }
      });
      return { id: u.id, name: u.name, course: u.course || 'N/A', strengths, weaknesses, interests, availability: ['evening', 'weekend'] };
    };
    const studentProfile = await makeProfile(student);
    const candidateProfiles = await Promise.all(candidates.map(c => makeProfile(c)));
    try {
      const mlRes = await axios.post(`${ML_SERVICE_URL}/peer_match`, { student: studentProfile, candidates: candidateProfiles }, { timeout: 15000 });
      for (const match of mlRes.data) {
        await PeerMatch.upsert({ studentId, matchedStudentId: match.id, collegeId: req.user.collegeId, compatibilityScore: match.compatibility_score, matchReasons: match.reasons });
      }
      res.status(200).json(mlRes.data);
    } catch (_) {
      res.status(200).json(candidateProfiles.filter(c => c.course === studentProfile.course).map(c => ({ id: c.id, name: c.name, compatibility_score: 75.0, reasons: [`Same course: ${studentProfile.course}.`] })));
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── MODEL METRICS ────────────────────────────────────────────────────────────
const getModelMetrics = async (req, res) => {
  try {
    const mlRes = await axios.get(`${ML_SERVICE_URL}/model/metrics`, { timeout: 10000 });
    res.status(200).json(mlRes.data);
  } catch (_) {
    res.status(503).json({ message: 'ML Service is offline or starting up. Try again in a moment.' });
  }
};

const triggerModelRetrain = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only.' });
    const mlRes = await axios.post(`${ML_SERVICE_URL}/model/retrain`, {}, { timeout: 120000 });
    res.status(200).json(mlRes.data);
  } catch (_) {
    res.status(503).json({ message: 'ML Service unavailable. Cannot retrain.' });
  }
};

// ─── TEACHER/ADMIN CLASS ANALYTICS ────────────────────────────────────────────
const getClassAnalytics = async (req, res) => {
  try {
    const { classId } = req.query;
    const where = { collegeId: req.user.collegeId, role: 'student' };
    if (classId) where.classId = classId;

    const students = await User.findAll({ where });
    const analytics = [];

    for (const student of students) {
      const data = await buildFeaturesForStudent(student.id);
      if (!data) continue;
      analytics.push({
        studentId: student.id,
        studentName: student.name,
        course: student.course,
        features: data.features,
        hasRealData: data.hasRealData
      });
    }

    // Aggregate stats
    const withData = analytics.filter(a => a.hasRealData);
    const avgAttendance = withData.length ? Math.round(withData.reduce((s, a) => s + a.features.attendance_pct, 0) / withData.length) : null;
    const avgAssignment = withData.length ? Math.round(withData.reduce((s, a) => s + a.features.assignment_completion_rate * 100, 0) / withData.length) : null;
    const avgMidSem = withData.length ? Math.round(withData.reduce((s, a) => s + a.features.mid_sem_score, 0) / withData.length) : null;

    res.status(200).json({
      students: analytics,
      summary: {
        totalStudents: analytics.length,
        studentsWithData: withData.length,
        avgAttendancePct: avgAttendance,
        avgAssignmentCompletionPct: avgAssignment,
        avgMidSemScore: avgMidSem
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateResponse,
  predictAcademicFuture,
  getStudentInsights,
  getAttendanceRisk,
  getWeakSubjects,
  getStudyPlan,
  getAtRiskWatchlist,
  getStudyRecommendations,
  semanticSearchResources,
  findStudyBuddyMatches,
  getModelMetrics,
  triggerModelRetrain,
  getClassAnalytics
};
