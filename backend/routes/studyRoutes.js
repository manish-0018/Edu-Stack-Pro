const express = require('express');
const router = express.Router();
const { getMyRequests, getIncomingRequests, requestBuddy, acceptRequest, completeRequest, searchGlobalPeers } = require('../controllers/studyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/me')
  .get(getMyRequests);

router.route('/incoming')
  .get(getIncomingRequests);

router.route('/global-peers')
  .get(searchGlobalPeers);

router.route('/request')
  .post(requestBuddy);

router.route('/:id/accept')
  .put(protect, acceptRequest);

router.route('/:id/complete')
  .put(protect, completeRequest);

module.exports = router;
