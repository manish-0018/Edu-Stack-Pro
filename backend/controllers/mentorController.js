const { User, AttendanceRecord, Attendance, LeaveRequest, MentorshipSession, Class, Subject } = require('../models');
const { Op } = require('sequelize');

// Helper to calculate student attendance %
const calculateStudentAttendance = async (studentId) => {
  const records = await AttendanceRecord.findAll({
    where: { studentId },
    include: [{ model: Attendance }]
  });
  if (records.length === 0) return 100;
  let attended = 0;
  records.forEach(r => {
    if (['present', 'late', 'excused', 'duty'].includes(r.status)) attended++;
  });
  return Math.round((attended / records.length) * 100);
};

// 1. Get all mentees (students in the same course and college)
const getMentees = async (req, res) => {
  try {
    const { course, collegeId } = req.user;
    if (!course || !collegeId) {
      return res.status(400).json({ message: "Mentor is not assigned to a department/college." });
    }
    
    // Find all students in this course & college
    const mentees = await User.findAll({
      where: {
        role: 'student',
        course: { [Op.iLike]: course },
        collegeId:
      },
      attributes: ['id', 'name', 'email', 'rollNo', 'course']
    });

    const menteesWithStats = [];
    for (const mentee of mentees) {
      const attendance = await calculateStudentAttendance(mentee.id);
      menteesWithStats.push({
        ...mentee.toJSON(),
        attendancePercentage: attendance
      });
    }

    res.status(200).json(menteesWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get attendance shortages (mentees under 75% attendance)
const getAttendanceShortages = async (req, res) => {
  try {
    const { course, collegeId } = req.user;
    if (!course || !collegeId) {
      return res.status(400).json({ message: "Mentor is not assigned to a department/college." });
    }
    const mentees = await User.findAll({
      where: { role: 'student', course, collegeId },
      attributes: ['id', 'name', 'email', 'rollNo']
    });

    const shortageList = [];
    for (const mentee of mentees) {
      const attendance = await calculateStudentAttendance(mentee.id);
      if (attendance < 75) {
        shortageList.push({
          ...mentee.toJSON(),
          attendancePercentage: attendance
        });
      }
    }

    res.status(200).json(shortageList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get pending leave requests for mentees
const getMenteesLeaves = async (req, res) => {
  try {
    const { course, collegeId } = req.user;
    if (!course || !collegeId) {
      return res.status(400).json({ message: "Mentor is not assigned to a department/college." });
    }
    const leaves = await LeaveRequest.findAll({
      where: { status: 'pending' },
      include: [{
        model: User,
        as: 'Student',
        where: { course, collegeId },
        attributes: ['name', 'email', 'rollNo'],
        required: true
      }]
    });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Approve / Reject Leave
const updateMenteeLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leaveRequest = await LeaveRequest.findByPk(req.params.id, {
      include: [{ model: User, as: 'Student', required: true }]
    });

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Validate course/college boundary
    if (leaveRequest.Student.collegeId !== req.user.collegeId || leaveRequest.Student.course !== req.user.course) {
      return res.status(403).json({ message: 'Access denied. Cross-department actions are blocked.' });
    }

    await leaveRequest.update({
      status,
      approvedById: req.user.id
    });

    // Attendance Recalculation
    if (status === 'approved') {
      const { studentId, startDate, endDate, type } = leaveRequest;
      const studentRecords = await AttendanceRecord.findAll({
        where: { studentId },
        include: [{
          model: Attendance,
          where: { date: { [Op.between]: [startDate, endDate] } }
        }]
      });

      const targetStatus = type === 'duty' ? 'duty' : 'excused';
      for (const record of studentRecords) {
        await record.update({ status: targetStatus });
      }
    }

    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Get counseling logs
const getMentorshipSessions = async (req, res) => {
  try {
    const { course, collegeId } = req.user;
    if (!course || !collegeId) {
      return res.status(400).json({ message: "Mentor is not assigned to a department/college." });
    }
    const sessions = await MentorshipSession.findAll({
      where: { collegeId },
      include: [
        {
          model: User,
          as: 'Student',
          where: { course },
          attributes: ['name', 'email', 'rollNo'],
          required: true
        },
        {
          model: User,
          as: 'Mentor',
          attributes: ['name']
        }
      ],
      order: [['sessionDate', 'DESC']]
    });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Create counseling log or schedule meeting
const createMentorshipSession = async (req, res) => {
  try {
    const { studentId, notes, actionItems, status, sessionDate, meetingLink, meetingDate } = req.body;
    if (!studentId || !notes) {
      return res.status(400).json({ message: 'Please provide studentId and notes' });
    }

    // Verify student belongs to the mentor's course/college
    const student = await User.findOne({
      where: { id: studentId, role: 'student', course: req.user.course, collegeId: req.user.collegeId }
    });
    if (!student) {
      return res.status(403).json({ message: 'Access denied. Student is not mapped to your course/college.' });
    }

    const session = await MentorshipSession.create({
      studentId,
      mentorId: req.user.id,
      notes,
      actionItems,
      status: status || 'completed',
      sessionDate: sessionDate || new Date(),
      collegeId: req.user.collegeId,
      meetingLink: meetingLink || null,
      meetingDate: meetingDate || null
    });

    // Targeted notification only for the student
    try {
      const { Notification } = require('../models');
      await Notification.create({
        userId: studentId,
        title: status === 'scheduled' ? '📅 New Meeting Scheduled' : '📝 New Advising Log Added',
        message: status === 'scheduled'
          ? `Your mentor ${req.user.name} has scheduled a meeting: "${notes}" for ${new Date(meetingDate).toLocaleString()}.`
          : `Your mentor ${req.user.name} has logged a new advising/counseling session: "${notes}".`,
        type: 'info',
        isRead: false
      });
    } catch (err) {
      console.error("Failed to trigger student advising notification:", err);
    }

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Mentorship Session status (e.g. End Meeting)
const updateMentorshipSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, actionItems } = req.body;
    const session = await MentorshipSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    if (session.mentorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You do not own this session.' });
    }
    await session.update({
      status: status || session.status,
      notes: notes || session.notes,
      actionItems: actionItems || session.actionItems
    });
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Mentorship Session (e.g. Cancel Meeting)
const deleteMentorshipSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await MentorshipSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    if (session.mentorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You do not own this session.' });
    }
    await session.destroy();
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get advising view for student (returns mentor profile and advising/meeting logs)
const getStudentAdvisingView = async (req, res) => {
  try {
    const mentor = await User.findOne({
      where: {
        role: 'mentor',
        course: { [Op.iLike]: req.user.course },
        collegeId: req.user.collegeId
      },
      attributes: ['name', 'email', 'course']
    });

    const sessions = await MentorshipSession.findAll({
      where: { studentId: req.user.id },
      include: [
        {
          model: User,
          as: 'Mentor',
          attributes: ['name', 'email']
        }
      ],
      order: [['sessionDate', 'DESC']]
    });

    res.status(200).json({
      mentor: mentor || null,
      sessions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMentees,
  getAttendanceShortages,
  getMenteesLeaves,
  updateMenteeLeaveStatus,
  getMentorshipSessions,
  createMentorshipSession,
  updateMentorshipSession,
  deleteMentorshipSession,
  getStudentAdvisingView
};
