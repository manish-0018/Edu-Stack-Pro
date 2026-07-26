const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getAlumni, verifyAlumni, getMyProfile } = require('../controllers/alumniController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getAlumni);
router.get('/me', getMyProfile);
router.post('/me', createOrUpdateProfile);
router.put('/:id/verify', verifyAlumni);

module.exports = router;
