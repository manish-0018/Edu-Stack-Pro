const express = require('express');
const router = express.Router();
const { generateDefaulterReport, generateMarksReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/defaulters')
  .get(protect, authorize('admin', 'teacher'), generateDefaulterReport);

router.route('/marks')
  .get(protect, authorize('admin', 'teacher'), generateMarksReport);

module.exports = router;
