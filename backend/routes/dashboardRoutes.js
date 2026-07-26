const express = require('express');
const router = express.Router();
const { getDashboardStats, getStudentDashboardById } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getDashboardStats);

router.route('/student/:id')
  .get(protect, getStudentDashboardById);

module.exports = router;
