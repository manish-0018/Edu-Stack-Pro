const { LeaveRequest, User, AttendanceRecord, Attendance, Notification } = require('../models');
const { Op } = require('sequelize');

const createLeaveRequest = async (req, res) => {
  try {
    const { startDate, endDate, reason, type } = req.body;
    if (!startDate || !endDate || !reason) throw new Error('Please provide all fields');

    const leaveRequest = await LeaveRequest.create({
      studentId: req.user.id,
      startDate,
      endDate,
      reason,
      type: type || 'personal'
    });

    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLeaveRequests = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === 'student') {
      whereClause.studentId = req.user.id;
    }

    let studentWhere = {};
    if (req.user.collegeId) {
      studentWhere.collegeId = req.user.collegeId;
    }
    if (req.user.course) {
      studentWhere.course = req.user.course;
    }

    const leaveRequests = await LeaveRequest.findAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'Student', 
          where: studentWhere,
          required: true,
          attributes: ['name', 'email', 'course', 'collegeId'] 
        },
        { model: User, as: 'Approver', attributes: ['name'] }
      ]
    });
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leaveRequest = await LeaveRequest.findByPk(req.params.id, {
      include: [{ model: User, as: 'Student', required: true }]
    });

    if (!leaveRequest) throw new Error('Leave request not found');

    if (req.user.collegeId && leaveRequest.Student?.collegeId !== req.user.collegeId) {
      throw new Error('Access denied. Cross-college action blocked.');
    }
    if (req.user.course && leaveRequest.Student?.course !== req.user.course) {
      throw new Error('Access denied. Cross-department action blocked.');
    }

    await leaveRequest.update({
      status,
      approvedById: req.user.id
    });

    // Smart Leave Recalculation:
    // If the leave request is approved, find all Attendance records for this student
    // that overlap with the leave startDate and endDate, and update status.
    if (status === 'approved') {
      const { studentId, startDate, endDate, type } = leaveRequest;

      // Find all AttendanceRecords belonging to this student
      const studentRecords = await AttendanceRecord.findAll({
        where: { studentId },
        include: [{
          model: Attendance,
          where: {
            date: {
              [Op.between]: [startDate, endDate]
            }
          }
        }]
      });

      // Update status: 'duty' for Duty Leave (counts as present), 'excused' for others
      const targetStatus = type === 'duty' ? 'duty' : 'excused';
      for (const record of studentRecords) {
        await record.update({ status: targetStatus });
      }
    }

    // Create a Notification for the student
    await Notification.create({
      userId: leaveRequest.studentId,
      title: `Leave Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your ${leaveRequest.type} leave request from ${new Date(leaveRequest.startDate).toLocaleDateString()} to ${new Date(leaveRequest.endDate).toLocaleDateString()} has been ${status}.`,
      type: status === 'approved' ? 'success' : 'alert'
    });

    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createLeaveRequest, getLeaveRequests, updateLeaveStatus };
