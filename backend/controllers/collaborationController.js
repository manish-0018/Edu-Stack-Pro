const { Message, StudyGroup, StudyGroupParticipant, ForumPost, ForumReply, User, Subject, StudyRequest, Notification } = require('../models');
const { Op } = require('sequelize');

// ========================
// 1. FORUMS
// ========================
const getForums = async (req, res) => {
  try {
    const posts = await ForumPost.findAll({
      include: [
        { model: User, as: 'Author', attributes: ['name', 'course'] },
        { model: Subject, attributes: ['name', 'code'] },
        { model: ForumReply, include: [{ model: User, as: 'Author', attributes: ['name'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createForumPost = async (req, res) => {
  try {
    const { subjectId, title, content } = req.body;
    const post = await ForumPost.create({ userId: req.user.id, subjectId, title, content });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const replyToForum = async (req, res) => {
  try {
    const { content } = req.body;
    const { id: postId } = req.params;
    const reply = await ForumReply.create({ postId, userId: req.user.id, content });
    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const upvotePost = async (req, res) => {
  try {
    const post = await ForumPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.upvotes = (post.upvotes || 0) + 1;
    await post.save();
    res.status(200).json({ upvotes: post.upvotes });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const markSolved = async (req, res) => {
  try {
    const post = await ForumPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.isSolved = !post.isSolved;
    await post.save();
    res.status(200).json({ isSolved: post.isSolved });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const markAnswer = async (req, res) => {
  try {
    const reply = await ForumReply.findByPk(req.params.replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });
    reply.isAnswer = !reply.isAnswer;
    await reply.save();
    res.status(200).json({ isAnswer: reply.isAnswer });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteForumPost = async (req, res) => {
  try {
    const post = await ForumPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await post.destroy();
    res.status(200).json({ id: req.params.id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ========================
// 2. STUDY GROUPS
// ========================
const getStudyGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.findAll({
      where: { status: 'active' },
      include: [
        { model: User, as: 'Creator', attributes: ['name', 'email'] },
        { model: Subject, attributes: ['name', 'code'] },
        { model: StudyGroupParticipant, include: [{ model: User, as: 'Student', attributes: ['name'] }] }
      ],
      order: [['scheduledTime', 'ASC']]
    });
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPastStudyGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.findAll({
      where: { status: 'completed' },
      include: [
        { model: User, as: 'Creator', attributes: ['name', 'email'] },
        { model: Subject, attributes: ['name', 'code'] },
        { model: StudyGroupParticipant, include: [{ model: User, as: 'Student', attributes: ['name'] }] }
      ],
      order: [['updatedAt', 'DESC']]
    });
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createStudyGroup = async (req, res) => {
  try {
    const { subjectId, title, description, scheduledTime, meetLink } = req.body;
    const group = await StudyGroup.create({
      creatorId: req.user.id, subjectId, title, description, scheduledTime, meetLink
    });
    // Creator auto-RSVPs
    await StudyGroupParticipant.create({ studyGroupId: group.id, studentId: req.user.id });
    
    // Notify all students
    const students = await User.findAll({ where: { role: 'student' } });
    const notifications = students
      .filter(s => s.id !== req.user.id)
      .map(student => ({
        userId: student.id,
        title: '🔴 Live Session Started!',
        message: `${req.user.name} just went live for: "${title}". Join the group now to participate!`,
        type: 'info'
      }));
    if (notifications.length > 0) {
      await Notification.bulkCreate(notifications);
    }
    
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rsvpStudyGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await StudyGroupParticipant.findOne({
      where: { studyGroupId: id, studentId: req.user.id }
    });
    if (existing) {
      await existing.destroy();
      return res.status(200).json({ message: 'RSVP removed' });
    }
    await StudyGroupParticipant.create({ studyGroupId: id, studentId: req.user.id });
    res.status(200).json({ message: 'RSVP successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const completeStudyGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { notesData } = req.body;
    
    const group = await StudyGroup.findByPk(id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    if (group.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Only the creator can end the session' });
    }

    group.status = 'completed';
    if (notesData) {
      group.notesData = notesData;
    }
    await group.save();
    
    res.status(200).json({ message: 'Group session ended and notes saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// 3. CHAT MESSAGES
// ========================
const getMessages = async (req, res) => {
  try {
    const { type, sessionId } = req.query; // type: 'group' or 'request'
    let whereClause = {};
    if (type === 'group') {
      whereClause.studyGroupId = sessionId;
    } else {
      whereClause.studyRequestId = sessionId;
    }

    const messages = await Message.findAll({
      where: whereClause,
      include: [{ model: User, as: 'Sender', attributes: ['name'] }],
      order: [['createdAt', 'ASC']]
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { type, sessionId, content } = req.body;
    let messageData = { senderId: req.user.id, content };
    
    if (type === 'group') {
      messageData.studyGroupId = sessionId;
    } else {
      messageData.studyRequestId = sessionId;
      // Find the other user to set receiverId
      const reqDetails = await StudyRequest.findByPk(sessionId);
      if (reqDetails) {
        messageData.receiverId = reqDetails.requesterId === req.user.id ? reqDetails.tutorId : reqDetails.requesterId;
      }
    }

    const msg = await Message.create(messageData);
    const fullMsg = await Message.findByPk(msg.id, {
      include: [{ model: User, as: 'Sender', attributes: ['name'] }]
    });
    res.status(201).json(fullMsg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// 4. WHITEBOARD & RATINGS
// ========================
const saveWhiteboard = async (req, res) => {
  try {
    const { id } = req.params;
    const { elements, appState } = req.body;
    await StudyRequest.update(
      { whiteboardData: { elements, appState } },
      { where: { id } }
    );
    res.status(200).json({ message: 'Whiteboard saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const studyReq = await StudyRequest.findByPk(id);
    if (!studyReq) return res.status(404).json({ message: 'Request not found' });
    
    studyReq.rating = rating;
    studyReq.review = review;
    await studyReq.save();
    
    res.status(200).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStudyRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledTime } = req.body;
    await StudyRequest.update({ scheduledTime }, { where: { id } });
    res.status(200).json({ message: 'Schedule updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getForums, createForumPost, replyToForum, upvotePost, markSolved, markAnswer, deleteForumPost,
  getStudyGroups, getPastStudyGroups, createStudyGroup, rsvpStudyGroup, completeStudyGroup,
  getMessages, sendMessage,
  saveWhiteboard, rateSession, updateStudyRequest
};
