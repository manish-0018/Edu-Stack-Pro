const { Quiz, QuizQuestion, QuizAttempt, User, Subject, Notification } = require('../models');

// @desc Create quiz with questions (teacher)
const createQuiz = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers are authorized to create quizzes.' });
    }
    const { title, subjectId, timeLimitMinutes, dueDate, questions } = req.body;
    const totalMarks = (questions || []).reduce((sum, q) => sum + (q.marks || 1), 0);

    const quiz = await Quiz.create({
      title, subjectId, teacherId: req.user.id,
      timeLimitMinutes: timeLimitMinutes || 30,
      dueDate: dueDate || null,
      totalMarks
    });

    // Send notifications to students in the class section
    try {
      const subject = await Subject.findByPk(subjectId);
      if (subject && subject.classId) {
        const students = await User.findAll({
          where: {
            role: 'student',
            classId: subject.classId,
            collegeId: req.user.collegeId
          }
        });

        const notifications = students.map(student => ({
          userId: student.id,
          title: 'New Quiz Scheduled 🧠',
          message: `A new quiz "${title}" has been scheduled for ${subject.name}. Time Limit: ${timeLimitMinutes || 30} mins.`,
          type: 'info'
        }));

        if (notifications.length > 0) {
          await Notification.bulkCreate(notifications);
        }
      }
    } catch (notifErr) {
      console.error("Failed to dispatch quiz notifications", notifErr);
    }

    if (questions && questions.length > 0) {
      await QuizQuestion.bulkCreate(questions.map(q => ({
        quizId: quiz.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: q.marks || 1
      })));
    }

    const fullQuiz = await Quiz.findByPk(quiz.id, { include: [{ model: QuizQuestion }] });
    res.status(201).json(fullQuiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get all quizzes
const getQuizzes = async (req, res) => {
  try {
    let where = {};
    let subjectWhere = {};

    if (req.user.role === 'teacher') {
      where.teacherId = req.user.id;
    } else if (req.user.role === 'student') {
      if (!req.user.classId) {
        return res.status(200).json([]);
      }
      subjectWhere.classId = req.user.classId;
    }

    const quizzes = await Quiz.findAll({
      where,
      include: [
        { 
          model: Subject, 
          where: subjectWhere,
          attributes: ['name', 'code', 'classId'] 
        },
        { model: User, as: 'Teacher', attributes: ['name'] },
        { model: QuizAttempt, required: false }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(quizzes);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get quiz for attempt (questions without correct answers)
const getQuizForAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [
        { model: QuizQuestion, attributes: ['id', 'question', 'options', 'marks'] },
        { model: Subject, attributes: ['name'] }
      ]
    });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (quiz.isLocked) {
      return res.status(400).json({ message: 'This quiz has been locked by the teacher. Attempts are no longer accepted.' });
    }

    // Check if already attempted
    const existing = await QuizAttempt.findOne({ where: { quizId: quiz.id, studentId: req.user.id } });
    if (existing) return res.status(400).json({ message: 'You have already attempted this quiz', attempt: existing });

    res.status(200).json(quiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Submit quiz attempt (student - auto-graded)
const submitAttempt = async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const { answers, timeTakenSeconds } = req.body; // { questionId: selectedIndex }

    const existing = await QuizAttempt.findOne({ where: { quizId, studentId: req.user.id } });
    if (existing) return res.status(400).json({ message: 'Already attempted' });

    const questions = await QuizQuestion.findAll({ where: { quizId } });
    let score = 0;
    questions.forEach(q => {
      if (answers && answers[q.id] !== undefined && answers[q.id] === q.correctAnswer) {
        score += q.marks;
      }
    });

    const attempt = await QuizAttempt.create({
      quizId, studentId: req.user.id,
      answers, score,
      completedAt: new Date(),
      timeTakenSeconds: timeTakenSeconds || null
    });
    res.status(201).json({ attempt, score, total: questions.reduce((s, q) => s + q.marks, 0) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get all results for a quiz (teacher)
const getResults = async (req, res) => {
  try {
    const results = await QuizAttempt.findAll({
      where: { quizId: req.params.id },
      include: [{ model: User, as: 'Student', attributes: ['name', 'email'] }],
      order: [['score', 'DESC']]
    });
    res.status(200).json(results);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get my attempt for a quiz
const getMyAttempt = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({
      where: { quizId: req.params.id, studentId: req.user.id }
    });
    res.status(200).json(attempt || null);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Delete quiz (teacher/admin)
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Not found' });
    await quiz.destroy();
    res.status(200).json({ id: req.params.id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Toggle quiz submission lock (teacher who posted)
const toggleQuizLock = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (req.user.role !== 'teacher' || quiz.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Only the teacher who created the quiz can lock it.' });
    }
    quiz.isLocked = !quiz.isLocked;
    await quiz.save();
    res.status(200).json(quiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createQuiz, getQuizzes, getQuizForAttempt, submitAttempt, getResults, getMyAttempt, deleteQuiz, toggleQuizLock };
