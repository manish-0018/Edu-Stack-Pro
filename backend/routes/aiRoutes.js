const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  generateResponse, 
  predictAcademicFuture,
  getAtRiskWatchlist,
  getStudyRecommendations,
  semanticSearchResources,
  findStudyBuddyMatches,
  getModelMetrics,
  triggerModelRetrain
} = require('../controllers/aiController');

// Secure all endpoints under auth protection middleware
router.post('/ask', protect, generateResponse);
router.get('/predict', protect, predictAcademicFuture);
router.get('/watchlist', protect, getAtRiskWatchlist);
router.get('/recommendations', protect, getStudyRecommendations);
router.post('/search', protect, semanticSearchResources);
router.get('/matches', protect, findStudyBuddyMatches);
router.get('/metrics', protect, getModelMetrics);
router.post('/retrain', protect, triggerModelRetrain);

module.exports = router;
