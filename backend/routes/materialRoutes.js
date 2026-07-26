const express = require('express');
const router = express.Router();
const {
  getMaterialsBySubject,
  getAllMaterials,
  createMaterial
} = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createMaterial);
router.get('/', getAllMaterials);
router.get('/:subjectId', getMaterialsBySubject);

module.exports = router;
