const express = require('express');
const router = express.Router();
const { getAvailableSlots, getMySlots, getMyOfferedSlots, createSlot, bookSlot, matchMentors } = require('../controllers/mentorshipController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/match', matchMentors);
router.get('/available', getAvailableSlots);
router.get('/me', getMySlots);
router.get('/offered', getMyOfferedSlots);
router.post('/slot', createSlot);
router.post('/book/:id', bookSlot);

module.exports = router;
