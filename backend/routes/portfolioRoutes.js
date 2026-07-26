const express = require('express');
const router = express.Router();
const { getMyPortfolio, getStudentPortfolio } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/me', getMyPortfolio);
router.get('/:studentId', getStudentPortfolio);

module.exports = router;
