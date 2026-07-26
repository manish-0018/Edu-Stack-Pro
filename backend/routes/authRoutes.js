const express = require('express');
const router = express.Router();
const { register, login, getMe, resetPassword, getColleges, createCollege } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.get('/colleges', getColleges);
router.post('/colleges', createCollege);
router.get('/me', protect, getMe);

module.exports = router;
