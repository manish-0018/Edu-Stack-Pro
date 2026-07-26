const express = require('express');
const router = express.Router();
const { getOpportunities, createOpportunity, getTeamRequests, createTeamRequest } = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getOpportunities);
router.post('/', createOpportunity);
router.get('/:id/team-requests', getTeamRequests);
router.post('/:id/team-request', createTeamRequest);

module.exports = router;
