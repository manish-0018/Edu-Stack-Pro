const { Attendance, AttendanceRecord, Class, Subject, User, Notification } = require('../models');
const { Op } = require('sequelize');

const markAttendance = async (req, res) => {
  try {
    const { classId, subjectId, date, records } = req.body;

    if (!classId || !subjectId || !date || !records) {
      throw new Error('Please provide all required fields');
    }

    // Check if attendance already marked for this date
    let attendance = await Attendance.findOne({
      where: { classId, subjectId, date }
    });

    if (!attendance) {
      // Create the master attendance record
      attendance = await Attendance.create({
        classId,
        subjectId,
        date,
        markedById: req.user.id
      });
    }

    // Upsert individual student records
    for (const r of records) {
      let record = await AttendanceRecord.findOne({
        where: { attendanceId: attendance.id, studentId: r.studentId }
      });
      if (record) {
        await record.update({ status: r.status });
      } else {
        await AttendanceRecord.create({
          attendanceId: attendance.id,
          studentId: r.studentId,
          status: r.status
        });
      }
    }

    // Send notifications and email alerts in background
    const absentRecords = records.filter(r => r.status === 'absent');
    if (absentRecords.length > 0) {
      (async () => {
        try {
          const subject = await Subject.findByPk(subjectId);
          const subjectName = subject ? subject.name : 'Class';

          const nodemailer = require('nodemailer');
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            auth: {
              user: process.env.SMTP_USER || 'test@example.com',
              pass: process.env.SMTP_PASS || 'password'
            }
          });

          for (const record of absentRecords) {
            try {
              const student = await User.findByPk(record.studentId);
              if (!student) continue;

              // 1. In-app alert
              await Notification.create({
                userId: student.id,
                title: 'Absence Alert',
                message: `You were marked ABSENT for ${subjectName} on ${date}.`,
                type: 'alert'
              });

              // 2. Email alert to Student
              await transporter.sendMail({
                from: '"Edu Stack Pro Attendance" <attendance@edustack.edu>',
                to: student.email,
                subject: `Edu Stack Pro - Absence Alert: ${subjectName}`,
                text: `Dear ${student.name},\n\nYou were marked ABSENT for the ${subjectName} class held on ${date}.\n\nIf you believe this is an error, please contact your subject teacher.\n\nBest regards,\nEdu Stack Pro Team`
              });

              // 3. Email alert to Parent
              if (student.parentEmail && student.parentEmail !== student.email) {
                await transporter.sendMail({
                  from: '"Edu Stack Pro Attendance" <attendance@edustack.edu>',
                  to: student.parentEmail,
                  subject: `Edu Stack Pro - Absence Warning: ${student.name}`,
                  text: `Dear Parent,\n\nThis is to inform you that your ward ${student.name} was marked ABSENT for their ${subjectName} class held on ${date}.\n\nPlease ensure they attend classes regularly to maintain the required attendance percentage.\n\nBest regards,\nEdu Stack Pro Team`
                });
              }
            } catch (singleErr) {
              console.error(`Absence notifier failed for student ${record.studentId}`, singleErr);
            }
          }
        } catch (notifierErr) {
          console.error("Absence alert system error", notifierErr);
        }
      })();
    }

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

    const attendances = await Attendance.findAll({
      where: whereClause,
      include: [
        { model: Class, attributes: ['name'] },
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
