const express = require('express');
const router = express.Router();
const {
  getForums, createForumPost, replyToForum, upvotePost, markSolved, markAnswer, deleteForumPost,
  getStudyGroups, getPastStudyGroups, createStudyGroup, rsvpStudyGroup, completeStudyGroup,
  getMessages, sendMessage,
  saveWhiteboard, rateSession, updateStudyRequest
} = require('../controllers/collaborationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Forums
router.get('/forums', getForums);
router.post('/forums', createForumPost);
router.delete('/forums/:id', deleteForumPost);
router.post('/forums/:id/reply', replyToForum);
router.put('/forums/:id/upvote', upvotePost);
router.put('/forums/:id/solve', markSolved);
router.put('/forums/:id/replies/:replyId/answer', markAnswer);

// Groups
router.get('/groups', getStudyGroups);
router.get('/groups/past', getPastStudyGroups);
router.post('/groups', createStudyGroup);
router.post('/groups/:id/rsvp', rsvpStudyGroup);
router.put('/groups/:id/complete', completeStudyGroup);

// Messages
router.get('/messages', getMessages);
router.post('/messages', sendMessage);

// Study Request Enhancements
router.put('/study/:id/whiteboard', saveWhiteboard);
router.put('/study/:id/rate', rateSession);
router.put('/study/:id', updateStudyRequest);

module.exports = router;
