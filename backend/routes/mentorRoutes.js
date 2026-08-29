const express = require('express');
const router = express.Router();
const {
  getMentees,
  getAttendanceShortages,
  getMenteesLeaves,
  updateMenteeLeaveStatus,
  getMentorshipSessions,
  createMentorshipSession,
  updateMentorshipSession,
  deleteMentorshipSession,
  getStudentAdvisingView
} = require('../controllers/mentorController');
const { protect } = require('../middleware/authMiddleware');

// Middleware to restrict routes to 'mentor' or 'admin' role
const restrictToMentor = (req, res, next) => {
  if (req.user && (req.user.role === 'mentor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Mentors or admins only.' });
  }
};

router.route('/students')
  .get(protect, restrictToMentor, getMentees);

router.route('/shortage')
  .get(protect, restrictToMentor, getAttendanceShortages);

router.route('/leaves')
  .get(protect, restrictToMentor, getMenteesLeaves);

router.route('/leaves/:id')
  .put(protect, restrictToMentor, updateMenteeLeaveStatus);

router.route('/sessions')
  .get(protect, restrictToMentor, getMentorshipSessions)
  .post(protect, restrictToMentor, createMentorshipSession);

router.route('/sessions/:id')
  .put(protect, restrictToMentor, updateMentorshipSession)
  .delete(protect, restrictToMentor, deleteMentorshipSession);

router.route('/student-view')
  .get(protect, getStudentAdvisingView);

module.exports = router;
