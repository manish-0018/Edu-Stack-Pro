const express = require('express');
const router = express.Router();
const {
  getCompanyListings,
  createCompanyListing,
  updateResumeUrl,
  applyToListing,
  getApplications,
  updateApplicationStatus,
  matchResumeWithAI
} = require('../controllers/placementController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCompanyListings)
  .post(protect, authorize('admin'), createCompanyListing);

router.route('/match-resume')
  .post(protect, authorize('student'), matchResumeWithAI);

router.route('/resume')
  .put(protect, authorize('student'), updateResumeUrl);

router.route('/applications')
  .get(protect, getApplications);

router.route('/applications/:id')
  .put(protect, authorize('admin', 'teacher'), updateApplicationStatus);

router.route('/:id/apply')
  .post(protect, authorize('student'), applyToListing);

module.exports = router;
