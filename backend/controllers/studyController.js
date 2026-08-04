const { StudyRequest, User, Subject, Mark, Notification, MentorProfile, College } = require('../models');
const { Op } = require('sequelize');

const getMyRequests = async (req, res) => {
  try {
    const requests = await StudyRequest.findAll({
      where: { requesterId: req.user.id },
      include: [
        { model: Subject, attributes: ['name', 'code'] },
        { model: User, as: 'Tutor', attributes: ['name', 'course', 'email'] }
      ]
    });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getIncomingRequests = async (req, res) => {
  try {
    const requests = await StudyRequest.findAll({
      where: { tutorId: req.user.id, status: 'pending' },
      include: [
        { model: Subject, attributes: ['name', 'code'] },
        { model: User, as: 'Requester', attributes: ['name', 'course'] }
      ]
    });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const requestBuddy = async (req, res) => {
  try {
    const { subjectId, tutorId } = req.body;

    // Lock 1-on-1 tutoring behind premium checks for students
    if (req.user.role === 'student' && !req.user.isPremium) {
      return res.status(403).json({ message: '1-on-1 Tutoring requests require a Premium Semester Pass.' });
    }

    let topStudent = null;
    let targetSubjectId = subjectId;

    if (tutorId) {
      topStudent = await User.findByPk(tutorId);
      if (!topStudent) return res.status(404).json({ message: 'Tutor not found' });
      if (!targetSubjectId) {
        const firstSub = await Subject.findOne();
        targetSubjectId = firstSub ? firstSub.id : null;
      }
    } else {
      if (!subjectId) return res.status(400).json({ message: 'Subject ID is required' });
      const subject = await Subject.findByPk(subjectId);
      if (!subject) return res.status(404).json({ message: 'Subject not found' });
      
      const marks = await Mark.findAll({
        where: { subjectId },
        include: [{ model: User, as: 'Student', where: { classId: req.user.classId, role: 'student' } }]
      });

      let highestScore = -1;
      for (const mark of marks) {
        if (mark.Student.id === req.user.id) continue;
        const total = (mark.midSem || 0) + (mark.assignment || 0) + (mark.quiz || 0);
        if (total > highestScore) {
          highestScore = total;
          topStudent = mark.Student;
        }
      }

      if (!topStudent) {
        const classmates = await User.findAll({
          where: { classId: req.user.classId, role: 'student' }
        });
        const otherClassmates = classmates.filter(c => c.id !== req.user.id);
        if (otherClassmates.length > 0) {
          topStudent = otherClassmates[Math.floor(Math.random() * otherClassmates.length)];
        }
      }
    }

    if (!topStudent) {
      return res.status(400).json({ message: 'No suitable study partner found.' });
    }

    const studyReq = await StudyRequest.create({
      requesterId: req.user.id,
      tutorId: topStudent.id,
      subjectId: targetSubjectId
    });

    const subjectObj = targetSubjectId ? await Subject.findByPk(targetSubjectId) : null;
    const subName = subjectObj ? subjectObj.name : 'Study Session';

    await Notification.create({
      userId: topStudent.id,
      title: 'Study Buddy Request',
      message: `A peer has requested your help to study ${subName}.`,
      type: 'info'
    });

    res.status(201).json(studyReq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const studyReq = await StudyRequest.findByPk(req.params.id);
    if (!studyReq || studyReq.tutorId !== req.user.id) return res.status(404).json({ message: 'Request not found' });
    
    await studyReq.update({ status: 'accepted' });
    
    await Notification.create({
      userId: studyReq.requesterId,
      title: 'Buddy Found!',
      message: `Your tutor has accepted your study buddy request.`,
      type: 'success'
    });

    res.status(200).json(studyReq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const completeRequest = async (req, res) => {
  try {
    const studyReq = await StudyRequest.findByPk(req.params.id);
    if (!studyReq || studyReq.tutorId !== req.user.id) return res.status(404).json({ message: 'Request not found' });
    
    await studyReq.update({ status: 'completed' });
    
    res.status(200).json({ message: 'Session completed successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchGlobalPeers = async (req, res) => {
  try {
    // Lock Global Peer Matching behind premium checks for students
    if (req.user.role === 'student' && !req.user.isPremium) {
      return res.status(403).json({ message: 'Global Peer Finder requires a Premium Semester Pass.' });
    }
    const { query } = req.query;
    if (!query) return res.status(200).json([]);

    const mentors = await MentorProfile.findAll({
      where: {
        expertise: { [Op.iLike]: `%${query}%` },
        available: true
      },
      include: [{
        model: User,
        as: 'User',
        attributes: ['id', 'name', 'email', 'course'],
        include: [{
          model: College,
          as: 'College',
          attributes: ['name']
        }]
      }]
    });

    res.status(200).json(mentors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyRequests, getIncomingRequests, requestBuddy, acceptRequest, completeRequest, searchGlobalPeers };
