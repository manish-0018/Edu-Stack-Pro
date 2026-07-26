const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getConfessions, createConfession, deleteConfession } = require('../controllers/confessionController');

// Get all confessions (global or college specific)
router.get('/', protect, getConfessions);

// Create a new confession
router.post('/', protect, createConfession);

// Delete a confession (admin only – simple check)
router.delete('/:id', protect, deleteConfession);

module.exports = router;
