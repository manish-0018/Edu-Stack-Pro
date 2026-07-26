const express = require('express');
const router = express.Router();
const { createAnnouncement, getAnnouncements, togglePin, deleteAnnouncement, updateAnnouncement } = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getAnnouncements);
router.post('/', createAnnouncement);
router.put('/:id', updateAnnouncement);
router.delete('/:id', deleteAnnouncement);
router.put('/:id/pin', togglePin);

module.exports = router;
