const express = require('express');
const router = express.Router();
const { createJob, getJobs, applyToJob, updateApplicationStatus, getMyApplications, getJobApplications, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getJobs);
router.post('/', createJob);
router.delete('/:id', deleteJob);
router.post('/:id/apply', applyToJob);
router.get('/:id/applications', getJobApplications);
router.get('/my-applications', getMyApplications);
router.put('/applications/:id/status', updateApplicationStatus);

module.exports = router;
