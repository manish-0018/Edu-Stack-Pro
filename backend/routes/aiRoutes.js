const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateResponse, predictAcademicFuture } = require('../controllers/aiController');

router.post('/ask', protect, generateResponse);
router.get('/predict', predictAcademicFuture);

module.exports = router;
