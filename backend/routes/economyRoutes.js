const express = require('express');
const router = express.Router();
const { claimWeeklyTokens, getMarketplaceMaterials, purchaseMaterial, uploadPremiumNotes } = require('../controllers/economyController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/notes/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

router.use(protect);
router.post('/claim', claimWeeklyTokens);
router.get('/materials', getMarketplaceMaterials);
router.post('/purchase/:id', purchaseMaterial);
router.post('/upload', upload.single('file'), uploadPremiumNotes);

module.exports = router;
