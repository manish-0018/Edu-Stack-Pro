const express = require('express');
const router = express.Router();
const { triggerDefaulterWarnings } = require('../controllers/warningController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/trigger')
  .post(protect, authorize('admin'), triggerDefaulterWarnings);

module.exports = router;
