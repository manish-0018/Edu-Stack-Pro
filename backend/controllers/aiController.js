const axios = require('axios');
const { 
  User, Mark, AttendanceRecord, Attendance, Subject, 
  Class, Task, QuizAttempt, Assignment, AssignmentSubmission,
  PredictionLog, StudyRecommendation, PeerMatch, Material
} = require('../models');
const { Op } = require('sequelize');

// Set ML Service URL from env or fallback to local
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Act as a tutor (gemini assistant proxy)
const generateResponse = async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    // Call Python ML service campus assistant endpoint
    // We send context based on user details
    const student = await User.findByPk(req.user.id, {
      include: [{ model: Class, attributes: ['name'] }]
    });

    const contextData = {
      user: {
        name: student.name,
        role: student.role,
        course: student.course,
        className: student.Class?.name || 'N/A'
      },
      topicContext: context || 'General Tutoring'
    };

    try {
      const mlRes = await axios.post(`${ML_SERVICE_URL}/assistant`, {
        query: prompt,
        role: req.user.role,
        context_data: contextData
      });
      return res.status(200).json({ response: mlRes.data.response });
    } catch (mlErr) {
      console.warn("FastAPI offline, falling back to local mock helper:", mlErr.message);
      return res.status(200).json({
        response: `🤖 **AI Tutor (Offline Mode)**\n\nI am currently operating in offline mode. Please make sure the Python ML Service is running at ${ML_SERVICE_URL}.\n\nYour question was: *${prompt}*`
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper to calculate student prediction metrics and risk level dynamically
const predictForStudent = async (studentId, collegeId) => {
  const student = await User.findByPk(studentId);
  if (!student) return null;

  // 1. Fetch attendance stats
  const records = await AttendanceRecord.findAll({
    where: { studentId },
    include: [{ model: Attendance }]
  });
  let attended = 0;
  records.forEach(r => {
    if (['present', 'late', 'excused', 'duty'].includes(r.status)) attended++;
  });
  const attendance_pct = records.length === 0 ? 75.0 : (attended / records.length) * 100.0;

  // 2. Fetch assignment stats
  const studentSubjects = await Subject.findAll({ where: { classId: student.classId || null } });
  const subjectIds = studentSubjects.map(s => s.id);
  const allAssignments = await Assignment.findAll({ where: { subjectId: { [Op.in]: subjectIds } } });
  const submissions = await AssignmentSubmission.findAll({ where: { studentId } });
  const assignment_completion_rate = allAssignments.length === 0 ? 1.0 : (submissions.length / allAssignments.length);
  
  let totalAssMarks = 0;
  let gradedAssCount = 0;
  submissions.forEach(sub => {
    if (sub.status === 'graded' && sub.grade !== null && sub.grade !== undefined) {
      totalAssMarks += sub.grade;
      gradedAssCount++;
    }
  });
  const average_assignment_marks = gradedAssCount === 0 ? 70.0 : (totalAssMarks / gradedAssCount);

  // 3. Fetch quiz stats
  const quizAttempts = await QuizAttempt.findAll({ where: { studentId } });
  let totalQuizScore = 0;
  quizAttempts.forEach(qa => {
    totalQuizScore += qa.score || 0;
  });
  const average_quiz_marks = quizAttempts.length === 0 ? 70.0 : (totalQuizScore / quizAttempts.length) * 10.0;

  // 4. Fetch marks (mid-sem)
  const marks = await Mark.findAll({ where: { studentId } });
  let totalMidSem = 0;
  let midSemCount = 0;
  marks.forEach(m => {
    if (m.midSem !== null) {
      totalMidSem += m.midSem;
      midSemCount++;
    }
  });
  const mid_sem_score = midSemCount === 0 ? 70.0 : (totalMidSem / midSemCount);

  // 5. Fetch task activity (learning activity score)
  const completedTasks = await Task.count({ where: { studentId, status: 'done' } });
  const learning_activity_score = Math.min(completedTasks * 12.5, 100.0) || 40.0;

  const inputData = {
    attendance_pct,
    assignment_completion_rate,
    average_assignment_marks,
    average_quiz_marks,
    mid_sem_score,
    learning_activity_score
  };

  let predictionResult;
  try {
    const mlRes = await axios.post(`${ML_SERVICE_URL}/predict`, inputData);
    predictionResult = mlRes.data;
  } catch (mlErr) {
    let expectedGrade = (attendance_pct * 0.3) + (average_assignment_marks * 0.3) + (mid_sem_score * 0.4);
    expectedGrade = Math.min(Math.max(expectedGrade, 30.0), 100.0);
    let risk = "LOW";
    const explanation = [];
    if (attendance_pct < 75.0) {
      explanation.push(`Attendance is critically low: ${Math.round(attendance_pct)}% (Required is 75%)`);
    }
    if (average_assignment_marks < 60.0) {
      explanation.push(`Assignment performance is weak: ${Math.round(average_assignment_marks)}%`);
    }
    if (mid_sem_score < 50.0) {
      explanation.push(`Mid-semester exam score is low: ${Math.round(mid_sem_score)}%`);
    }
    
    if (attendance_pct < 60.0 || expectedGrade < 50.0) risk = "HIGH";
    else if (attendance_pct < 75.0 || expectedGrade < 70.0) risk = "MODERATE";

    if (explanation.length === 0) {
      explanation.push("Academic performance is stable and meets standards.");
    }

    predictionResult = {
      predicted_grade_pct: Math.round(expectedGrade, 2),
      risk_level: risk,
      explanation,
      confidence_score: 0.85
    };
  }

  // Save log
  await PredictionLog.create({
    userId: studentId,
    collegeId,
    inputData,
    predictionResult
  });

  // Update Study recommendations for subjects where mark is weak
  const weakMarks = marks.filter(m => (m.midSem && m.midSem < 60) || (m.quiz && m.quiz < 60));
  for (const wm of weakMarks) {
    const subject = await Subject.findByPk(wm.subjectId);
    if (subject) {
      const materials = await Material.findAll({ where: { subjectId: wm.subjectId }, limit: 2 });
      const recommendedResources = materials.map(m => ({ id: m.id, title: m.title, url: m.contentUrl }));
      
      await StudyRecommendation.upsert({
        studentId,
        collegeId,
        subjectName: subject.name,
        priority: 1, // High Priority
        weaknessScore: wm.midSem || wm.quiz || 50,
        reason: `Low marks in ${subject.name}`,
        recommendedResources
      });
    }
  }

  return predictionResult;
};

// Predict Academic Performance and Risk Level
const predictAcademicFuture = async (req, res) => {
  try {
    const studentId = req.query.studentId || req.user.id;
    const student = await User.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    if (student.collegeId !== req.user.collegeId) {
      return res.status(403).json({ message: 'Access denied. Student belongs to another college.' });
    }

    const predictionResult = await predictForStudent(studentId, req.user.collegeId);
    res.status(200).json(predictionResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get early-warning watchlist of at-risk students (For Teachers/Admins)
const getAtRiskWatchlist = async (req, res) => {
  try {
    // 1. Fetch all students in this college
    const students = await User.findAll({
      where: { collegeId: req.user.collegeId, role: 'student' }
    });

    const watchlist = [];
    
    // Calculate risk for each student in parallel
    await Promise.all(students.map(async (student) => {
      const result = await predictForStudent(student.id, req.user.collegeId);
      if (result && (result.risk_level === 'HIGH' || result.risk_level === 'MODERATE')) {
        watchlist.push({
          studentId: student.id,
          studentName: student.name,
          email: student.email,
          course: student.course || 'N/A',
          riskLevel: result.risk_level,
          predictedGrade: result.predicted_grade_pct,
          explanation: result.explanation,
          confidence: result.confidence_score
        });
      }
    }));

    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get personalized study plan/recommendations for students
const getStudyRecommendations = async (req, res) => {
  try {
    const studentId = req.user.id;
    const recommendations = await StudyRecommendation.findAll({
      where: { studentId, collegeId: req.user.collegeId },
      order: [['priority', 'ASC']]
    });
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Semantic Search Resource Hub
const semanticSearchResources = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });

    // Fetch all materials from this college
    const materials = await Material.findAll({
      include: [{
        model: Subject,
        include: [{ model: Class, where: { collegeId: req.user.collegeId }, required: true, attributes: [] }],
        attributes: ['name'],
        required: true
      }]
    });

    const resources = materials.map(m => ({
      id: m.id,
      title: m.title,
      description: m.title, // using title as desc since no desc column exists
      subjectName: m.Subject?.name || ''
    }));

    try {
      const mlRes = await axios.post(`${ML_SERVICE_URL}/search_resources`, {
        query,
        resources
      });
      res.status(200).json(mlRes.data);
    } catch (mlErr) {
      console.warn("FastAPI offline, falling back to simple local keyword search:", mlErr.message);
      // Fallback local regex search
      const keyword = query.toLowerCase();
      const matched = materials.filter(m => 
        m.title.toLowerCase().includes(keyword) || 
        (m.Subject?.name || '').toLowerCase().includes(keyword)
      );
      res.status(200).json(matched);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// AI Peer Matcher Compatibility Score
const findStudyBuddyMatches = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await User.findByPk(studentId);
    
    // Fetch all other students in same college
    const candidates = await User.findAll({
      where: { 
        collegeId: req.user.collegeId,
        id: { [Op.ne]: studentId },
        role: 'student'
      }
    });

    // Create profile payloads
    const makeProfile = async (u) => {
      // Calculate strengths & weaknesses from marks
      const marks = await Mark.findAll({ where: { studentId: u.id }, include: [Subject] });
      const strengths = [];
      const weaknesses = [];
      const interests = [];
      
      marks.forEach(m => {
        const sub = m.Subject?.name;
        if (sub) {
          interests.push(sub);
          const avgScore = ((m.midSem || 0) + (m.quiz || 0) + (m.assignment || 0)) / 3.0;
          if (avgScore >= 75) strengths.push(sub);
          if (avgScore < 60) weaknesses.push(sub);
        }
      });

      return {
        id: u.id,
        name: u.name,
        course: u.course || 'N/A',
        strengths,
        weaknesses,
        interests,
        availability: ["evening", "weekend"] // Mock availability slot
      };
    };

    const studentProfile = await makeProfile(student);
    const candidateProfiles = await Promise.all(candidates.map(c => makeProfile(c)));

    try {
      const mlRes = await axios.post(`${ML_SERVICE_URL}/peer_match`, {
        student: studentProfile,
        candidates: candidateProfiles
      });

      // Save matches to database
      for (const match of mlRes.data) {
        await PeerMatch.upsert({
          studentId,
          matchedStudentId: match.id,
          collegeId: req.user.collegeId,
          compatibilityScore: match.compatibility_score,
          matchReasons: match.reasons
        });
      }

      res.status(200).json(mlRes.data);
    } catch (mlErr) {
      console.warn("FastAPI offline, fallback matching:", mlErr.message);
      // Basic fallback match based on same course
      const simpleMatches = candidateProfiles
        .filter(c => c.course === studentProfile.course)
        .map(c => ({
          id: c.id,
          name: c.name,
          compatibility_score: 75.0,
          reasons: [`Enrolled in the same course (${studentProfile.course}).`]
        }));
      res.status(200).json(simpleMatches);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Model Monitoring & Retraining Controller
const getModelMetrics = async (req, res) => {
  try {
    const mlRes = await axios.get(`${ML_SERVICE_URL}/model/metrics`);
    res.status(200).json(mlRes.data);
  } catch (mlErr) {
    res.status(500).json({ message: "ML Service is offline. Cannot retrieve metrics." });
  }
};

const triggerModelRetrain = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    const mlRes = await axios.post(`${ML_SERVICE_URL}/model/retrain`);
    res.status(200).json(mlRes.data);
  } catch (mlErr) {
    res.status(500).json({ message: "ML Service offline. Failed to trigger retrain." });
  }
};

module.exports = {
  generateResponse,
  predictAcademicFuture,
  getAtRiskWatchlist,
  getStudyRecommendations,
  semanticSearchResources,
  findStudyBuddyMatches,
  getModelMetrics,
  triggerModelRetrain
};
