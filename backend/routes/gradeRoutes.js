const express = require('express');
const router = express.Router();
const { predictSGPA } = require('../controllers/gradeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/predict', predictSGPA);

module.exports = router;
