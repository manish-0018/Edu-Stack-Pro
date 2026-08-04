const { Message, StudyGroup, StudyGroupParticipant, ForumPost, ForumReply, User, Subject, StudyRequest, Notification, StudyGuide, ProjectPosting, ProjectInvite } = require('../models');
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
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students are authorized to ask questions in the forums.' });
    }
    const { subjectId, title, content } = req.body;
    const post = await ForumPost.create({ userId: req.user.id, subjectId, title, content });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const replyToForum = async (req, res) => {
  try {
    if (req.user.role !== 'student' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only students and teachers are authorized to answer questions in the forums.' });
    }
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

    // Filter groups based on student's college scoping!
    const studentCollegeId = req.user.collegeId;
    const filteredGroups = groups.filter(group => {
      if (group.targetColleges && Array.isArray(group.targetColleges) && group.targetColleges.length > 0) {
        return group.targetColleges.includes(studentCollegeId);
      }
      return true;
    });

    const io = req.app.get('io');
    const groupsWithCount = filteredGroups.map(group => {
      const groupJson = group.toJSON();
      groupJson.watchingCount = io ? (io.sockets.adapter.rooms.get(group.id)?.size || 0) : 0;
      return groupJson;
    });

    res.status(200).json(groupsWithCount);
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

    // Filter groups based on student's college scoping!
    const studentCollegeId = req.user.collegeId;
    const filteredGroups = groups.filter(group => {
      if (group.targetColleges && Array.isArray(group.targetColleges) && group.targetColleges.length > 0) {
        return group.targetColleges.includes(studentCollegeId);
      }
      return true;
    });

    res.status(200).json(filteredGroups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createStudyGroup = async (req, res) => {
  try {
    const { subjectId, title, description, scheduledTime, meetLink, targetColleges } = req.body;
    const group = await StudyGroup.create({
      creatorId: req.user.id, subjectId, title, description, scheduledTime, meetLink, targetColleges
    });
    // Creator auto-RSVPs
    await StudyGroupParticipant.create({ studyGroupId: group.id, studentId: req.user.id });
    
    // Notify targeted students
    let studentWhere = { role: 'student' };
    if (targetColleges && Array.isArray(targetColleges) && targetColleges.length > 0) {
      studentWhere.collegeId = { [Op.in]: targetColleges };
    }

    const students = await User.findAll({ where: studentWhere });
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

const createStudyGuide = async (req, res) => {
  try {
    const { title, summary, transcript } = req.body;
    if (!title || !summary) {
      throw new Error('Title and summary are required to save a whiteboard session study guide');
    }
    const guide = await StudyGuide.create({
      studentId: req.user.id,
      title,
      summary,
      transcript
    });
    res.status(201).json(guide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getStudyGuides = async (req, res) => {
  try {
    const guides = await StudyGuide.findAll({
      where: { studentId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(guides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========================
// 5. AI TEAM BUILDER
// ========================
const createProjectPosting = async (req, res) => {
  try {
    const { title, description, requiredSkills, maxTeamSize } = req.body;
    if (!title || !description || !requiredSkills) {
      return res.status(400).json({ message: 'Title, description, and required skills are required.' });
    }
    const project = await ProjectPosting.create({
      creatorId: req.user.id,
      title,
      description,
      requiredSkills,
      maxTeamSize: maxTeamSize || 4
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjectPostings = async (req, res) => {
  try {
    const projects = await ProjectPosting.findAll({
      include: [
        { model: User, as: 'Creator', attributes: ['id', 'name', 'email', 'course'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const matchProjectTeam = async (req, res) => {
  try {
    const project = await ProjectPosting.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Required skills array
    const reqSkills = project.requiredSkills.split(',').map(s => s.trim().toLowerCase());

    // Fetch mentors / peers
    const mentors = await require('../models').MentorProfile.findAll({
      where: { available: true },
      include: [{ model: User, as: 'User', attributes: ['id', 'name', 'email', 'course'] }]
    });

    const matches = mentors.map(m => {
      const mentorSkills = m.expertise.split(',').map(s => s.trim().toLowerCase());
      const overlap = mentorSkills.filter(s => reqSkills.some(rs => s.includes(rs) || rs.includes(s)));
      const matchScore = overlap.length > 0 ? Math.round((overlap.length / reqSkills.length) * 100) : 0;
      
      return {
        id: m.User.id,
        name: m.User.name,
        email: m.User.email,
        course: m.User.course,
        expertise: m.expertise,
        matchScore,
        matchExplanation: `Matches expertise: ${overlap.join(', ')}`
      };
    }).filter(m => m.id !== req.user.id && m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    // AI Enhancer (Gemini) if available
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE' && matches.length > 0) {
      try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          Given a project requirement:
          Title: "${project.title}"
          Description: "${project.description}"
          Required Skills: "${project.requiredSkills}"

          And these matched candidates:
          ${JSON.stringify(matches.slice(0, 5), null, 2)}

          For each candidate, write a 1-sentence expert explanation explaining why they fit this project role.
          Format the output as a valid JSON array of objects with fields "id" (matching candidate's id) and "matchExplanation" (the written 1-sentence explanation).
        `;
        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        // Remove markdown tags if any
        if (text.startsWith("```json")) text = text.substring(7);
        if (text.endsWith("```")) text = text.substring(0, text.length - 3);
        
        const aiMatches = JSON.parse(text.trim());
        if (Array.isArray(aiMatches)) {
          aiMatches.forEach(aiM => {
            const index = matches.findIndex(m => m.id === aiM.id);
            if (index !== -1) {
              matches[index].matchExplanation = aiM.matchExplanation;
            }
          });
        }
      } catch (aiErr) {
        console.error("AI Skill Matcher failure:", aiErr);
      }
    }

    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const inviteProjectMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { inviteeId } = req.body;
    const project = await ProjectPosting.findByPk(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if invite already exists
    const existing = await ProjectInvite.findOne({ where: { projectPostingId: id, inviteeId } });
    if (existing) return res.status(400).json({ message: 'Already invited this member.' });

    // Create invite
    const invite = await ProjectInvite.create({
      projectPostingId: id,
      inviteeId,
      status: 'pending'
    });

    // Create system notification
    await Notification.create({
      userId: inviteeId,
      title: 'Project Invitation 🚀',
      message: `${req.user.name} has invited you to join their project team: "${project.title}".`,
      type: 'info'
    });

    res.status(201).json(invite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjectInvites = async (req, res) => {
  try {
    const invites = await ProjectInvite.findAll({
      where: { inviteeId: req.user.id, status: 'pending' },
      include: [
        {
          model: ProjectPosting,
          include: [{ model: User, as: 'Creator', attributes: ['name'] }]
        }
      ]
    });
    res.status(200).json(invites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const respondToProjectInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { status } = req.body; // accepted or rejected
    const invite = await ProjectInvite.findByPk(inviteId);
    if (!invite) return res.status(404).json({ message: 'Invitation not found' });

    invite.status = status;
    await invite.save();

    const project = await ProjectPosting.findByPk(invite.projectPostingId);

    // Notify project creator
    await Notification.create({
      userId: project.creatorId,
      title: `Invitation ${status.toUpperCase()} 🤝`,
      message: `${req.user.name} has ${status} your invitation to join "${project.title}".`,
      type: status === 'accepted' ? 'success' : 'warning'
    });

    res.status(200).json(invite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getForums, createForumPost, replyToForum, upvotePost, markSolved, markAnswer, deleteForumPost,
  getStudyGroups, getPastStudyGroups, createStudyGroup, rsvpStudyGroup, completeStudyGroup,
  getMessages, sendMessage,
  saveWhiteboard, rateSession, updateStudyRequest,
  createStudyGuide, getStudyGuides,
  createProjectPosting, getProjectPostings, matchProjectTeam, inviteProjectMember, getProjectInvites, respondToProjectInvite
};
