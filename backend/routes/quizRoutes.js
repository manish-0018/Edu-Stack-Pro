const express = require('express');
const router = express.Router();
const { createQuiz, getQuizzes, getQuizForAttempt, submitAttempt, getResults, getMyAttempt, deleteQuiz, generateAIQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getQuizzes);
router.post('/', createQuiz);
router.post('/generate-ai', generateAIQuiz);
router.delete('/:id', deleteQuiz);
router.get('/:id/attempt', getQuizForAttempt);
router.get('/:id/my-attempt', getMyAttempt);
router.post('/:id/submit', submitAttempt);
router.get('/:id/results', getResults);

module.exports = router;
