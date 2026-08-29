const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  resetPassword, 
  getColleges, 
  createCollege, 
  updateCollege,
  getPaymentConfig,
  updatePaymentConfig,
  upgradeUser,
  getTransactions
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.get('/colleges', getColleges);
router.post('/colleges', createCollege);
router.put('/colleges/:id', protect, updateCollege);
router.get('/me', protect, getMe);

router.route('/payment-config')
  .get(protect, getPaymentConfig)
  .post(protect, updatePaymentConfig);

router.put('/upgrade', protect, upgradeUser);
router.get('/transactions', protect, getTransactions);

module.exports = router;
