const { Attendance, AttendanceRecord, Class, Subject, User } = require('../models');
const { Op } = require('sequelize');

const markAttendance = async (req, res) => {
  try {
    const { classId, subjectId, date, records } = req.body;

    if (!classId || !subjectId || !date || !records) {
      throw new Error('Please provide all required fields');
    }

    // Scoping check
    const targetClass = await Class.findByPk(classId);
    if (!targetClass) throw new Error('Target class not found');
    if (req.user.collegeId && targetClass.collegeId !== req.user.collegeId) {
      throw new Error('Access denied. Class belongs to another college.');
    }
    if (req.user.course && targetClass.course !== req.user.course) {
      throw new Error('Access denied. Class belongs to another department.');
    }

    // Check if attendance already marked for this date
    const existingAttendance = await Attendance.findOne({
      where: { classId, subjectId, date }
    });

    if (existingAttendance) {
      throw new Error('Attendance already marked for this date');
    }

    // Create the master attendance record
    const attendance = await Attendance.create({
      classId,
      subjectId,
      date,
      markedById: req.user.id
    });

    // Create the individual student records
    const mappedRecords = records.map(r => ({
      attendanceId: attendance.id,
      studentId: r.studentId,
      status: r.status
    }));

    await AttendanceRecord.bulkCreate(mappedRecords);

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { classId, subjectId, date, studentId } = req.query;
    
    let whereClause = {};
    if (classId) whereClause.classId = classId;
    if (subjectId) whereClause.subjectId = subjectId;
    if (date) whereClause.date = date;

    // Handle student specific view
    let recordWhereClause = {};
    if (req.user.role === 'student') {
      recordWhereClause.studentId = req.user.id;
    } else if (studentId) {
      recordWhereClause.studentId = studentId;
    }

    let classWhere = {};
    if (req.user.collegeId) {
      classWhere.collegeId = req.user.collegeId;
    }
    if (req.user.course) {
      classWhere.course = req.user.course;
    }

    const attendances = await Attendance.findAll({
      where: whereClause,
      include: [
        { 
          model: Class, 
          where: classWhere,
          required: true,
          attributes: ['name', 'course'] 
        },
        { model: Subject, attributes: ['name', 'code', 'type'] },
        { model: User, as: 'Marker', attributes: ['name'] },
        { 
          model: AttendanceRecord, 
          as: 'records',
          where: Object.keys(recordWhereClause).length > 0 ? recordWhereClause : undefined,
          required: Object.keys(recordWhereClause).length > 0, // only return if matches when filtered
          include: [{ model: User, as: 'Student', attributes: ['name', 'email'] }]
        }
      ]
    });

    res.status(200).json(attendances);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { markAttendance, getAttendance };
