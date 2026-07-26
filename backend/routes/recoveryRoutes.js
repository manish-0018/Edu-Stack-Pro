const express = require('express');
const router = express.Router();
const {
  getRecoveryAssignments,
  createRecoveryRequest,
  submitRecoveryWork,
  updateRecoveryStatus
} = require('../controllers/recoveryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getRecoveryAssignments)
  .post(createRecoveryRequest);

router.put('/:id/submit', submitRecoveryWork);
router.put('/:id/status', updateRecoveryStatus);

module.exports = router;
