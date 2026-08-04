const express = require('express');
const router = express.Router();
const { createAssignment, getAssignments, submitAssignment, gradeSubmission, getSubmissions, getMySubmission, deleteAssignment, toggleAssignmentLock } = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getAssignments);
router.post('/', createAssignment);
router.delete('/:id', deleteAssignment);
router.get('/:id/submissions', getSubmissions);
router.get('/:id/my-submission', getMySubmission);
router.post('/:id/submit', submitAssignment);
router.put('/submissions/:id/grade', gradeSubmission);
router.put('/:id/toggle-lock', toggleAssignmentLock);

module.exports = router;
