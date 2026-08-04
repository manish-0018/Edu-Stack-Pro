const express = require('express');
const router = express.Router();
const { register, login, getMe, resetPassword, getColleges, createCollege, updateCollegeLocation, upgradePremium, getPaymentConfig, getTransactions, getCollegeSettings, updateCollegeSettings } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.get('/colleges', getColleges);
router.post('/colleges', createCollege);
router.put('/colleges/:id', protect, updateCollegeLocation);
router.put('/upgrade', protect, upgradePremium);
router.get('/payment-config', protect, getPaymentConfig);
router.get('/transactions', protect, getTransactions);
router.get('/college-settings', protect, getCollegeSettings);
router.put('/college-settings', protect, updateCollegeSettings);
router.get('/me', protect, getMe);

module.exports = router;
