const { Quiz, QuizQuestion, QuizAttempt, User, Subject } = require('../models');

// @desc Create quiz with questions (teacher)
const createQuiz = async (req, res) => {
  try {
    const { title, subjectId, timeLimitMinutes, dueDate, questions } = req.body;
    const totalMarks = (questions || []).reduce((sum, q) => sum + (q.marks || 1), 0);

    const quiz = await Quiz.create({
      title, subjectId, teacherId: req.user.id,
      timeLimitMinutes: timeLimitMinutes || 30,
      dueDate: dueDate || null,
      totalMarks
    });

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
    if (req.user.role === 'teacher') where.teacherId = req.user.id;

    const quizzes = await Quiz.findAll({
      where,
      include: [
        { model: Subject, attributes: ['name', 'code'] },
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

// AI Quiz Generator (Student only)
const generateAIQuiz = async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) throw new Error('Topic is required');

    const axios = require('axios');
    const mlUrl = process.env.ML_SERVICE_URL || 'https://backend-ml-production-50d2.up.railway.app';
    const mlRes = await axios.post(`${mlUrl}/generate_quiz`, { topic }, { timeout: 15000 });

    res.status(200).json(mlRes.data);
  } catch (error) {
    res.status(200).json({
      topic: topic || "Database Systems",
      questions: [
        {
          question: "Which of the following is used to uniquely identify a tuple in a relation?",
          options: ["Primary Key", "Foreign Key", "Composite Key", "Alternate Key"],
          correctAnswer: 0
        },
        {
          question: "Which SQL statement is used to remove all records from a table without logging individual row deletions?",
          options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
          correctAnswer: 2
        },
        {
          question: "In normalization, which normal form eliminates transitive dependencies?",
          options: ["1NF", "2NF", "3NF", "BCNF"],
          correctAnswer: 2
        },
        {
          question: "What does ACID stand for in database transactions?",
          options: [
            "Atomicity, Consistency, Isolation, Durability",
            "Access, Control, Integration, Security",
            "Accuracy, Completeness, Indexing, Delivery",
            "Algorithm, Cache, Inheritance, Distribution"
          ],
          correctAnswer: 0
        },
        {
          question: "Which join returns all rows when there is a match in either left or right table?",
          options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"],
          correctAnswer: 3
        }
      ]
    });
  }
};

module.exports = { createQuiz, getQuizzes, getQuizForAttempt, submitAttempt, getResults, getMyAttempt, deleteQuiz, generateAIQuiz };
