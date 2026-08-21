const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/aiController');

// All routes protected
router.post('/ask', protect, generateResponse);

// Student AI routes
router.get('/predict', protect, predictAcademicFuture);
router.get('/insights', protect, getStudentInsights);
router.get('/attendance-risk', protect, getAttendanceRisk);
router.get('/weak-subjects', protect, getWeakSubjects);
router.get('/study-plan', protect, getStudyPlan);
router.get('/recommendations', protect, getStudyRecommendations);
router.get('/matches', protect, findStudyBuddyMatches);
router.post('/search', protect, semanticSearchResources);

// Teacher/Admin routes
router.get('/watchlist', protect, getAtRiskWatchlist);
router.get('/class-analytics', protect, getClassAnalytics);

// Admin-only routes
router.get('/metrics', protect, getModelMetrics);
router.post('/retrain', protect, triggerModelRetrain);

module.exports = router;
