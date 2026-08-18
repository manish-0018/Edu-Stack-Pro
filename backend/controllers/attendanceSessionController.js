const { Class, Attendance, AttendanceRecord, User, Subject, Notification } = require('../models');
const crypto = require('crypto');

// Helper: Calculate distance in meters using Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const startSession = async (req, res) => {
  try {
    const classId = req.params.id;
    const { subjectId, date, latitude, longitude, enableLocationLock } = req.body;

    if (!subjectId || !date) {
      throw new Error('Please provide subjectId and date');
    }

    const targetClass = await Class.findByPk(classId);
    if (!targetClass) {
      throw new Error('Class not found');
    }

    // 1. Create or Find the Attendance parent record
    let attendance = await Attendance.findOne({
      where: { classId, subjectId, date }
    });

    if (!attendance) {
      attendance = await Attendance.create({
        classId,
        subjectId,
        date,
        markedById: req.user.id
      });
    }

    // 2. Generate initial session codes
    const activeOtp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const activeQrToken = crypto.randomBytes(16).toString('hex'); // 32-char token
    const activeOtpExpires = new Date(Date.now() + 15 * 1000); // 15 seconds validity

    await targetClass.update({
      isSessionActive: true,
      activeOtp,
      activeQrToken,
      activeOtpExpires,
      latitude: enableLocationLock ? parseFloat(latitude) : null,
      longitude: enableLocationLock ? parseFloat(longitude) : null,
      isLocationLocked: !!enableLocationLock
    });

    // 3. Broadcast to socket room
    const io = req.app.get('io');
    if (io) {
      io.to(classId).emit('session_codes_updated', {
        activeOtp,
        activeQrToken,
        activeOtpExpires
      });
    }

    res.status(200).json({
      message: 'Attendance session started successfully',
      activeOtp,
      activeQrToken,
      activeOtpExpires,
      attendanceId: attendance.id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const rotateSessionCodes = async (req, res) => {
  try {
    const classId = req.params.id;

    const targetClass = await Class.findByPk(classId);
    if (!targetClass || !targetClass.isSessionActive) {
      throw new Error('No active attendance session found for this class');
    }

    const activeOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const activeQrToken = crypto.randomBytes(16).toString('hex');
    const activeOtpExpires = new Date(Date.now() + 15 * 1000);

    await targetClass.update({
      activeOtp,
      activeQrToken,
      activeOtpExpires
    });

    const io = req.app.get('io');
    if (io) {
      io.to(classId).emit('session_codes_updated', {
        activeOtp,
        activeQrToken,
        activeOtpExpires
      });
    }

    res.status(200).json({
      activeOtp,
      activeQrToken,
      activeOtpExpires
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const endSession = async (req, res) => {
  try {
    const classId = req.params.id;
    const { subjectId, date } = req.body;

    const targetClass = await Class.findByPk(classId);
    if (!targetClass) {
      throw new Error('Class not found');
    }

    // 1. Find Attendance parent record
    const attendance = await Attendance.findOne({
      where: { classId, subjectId, date }
    });

    if (attendance) {
      // 2. Find all students registered in this class
      const classStudents = await User.findAll({
        where: { classId, role: 'student' }
      });

      // 3. Find already marked students
      const markedRecords = await AttendanceRecord.findAll({
        where: { attendanceId: attendance.id }
      });
      const markedStudentIds = new Set(markedRecords.map(r => r.studentId));

      // 4. Mark all missing students as absent
      const absentRecords = [];
      for (const student of classStudents) {
        if (!markedStudentIds.has(student.id)) {
          absentRecords.push({
            attendanceId: attendance.id,
            studentId: student.id,
            status: 'absent'
          });
        }
      }

      if (absentRecords.length > 0) {
        await AttendanceRecord.bulkCreate(absentRecords);

        // Send notifications and email alerts in background
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

                // In-app alert
                await Notification.create({
                  userId: student.id,
                  title: 'Absence Alert',
                  message: `You were marked ABSENT for ${subjectName} on ${date}.`,
                  type: 'alert'
                });

                // Email alert to Student
                await transporter.sendMail({
                  from: '"Edu Stack Pro Attendance" <attendance@edustack.edu>',
                  to: student.email,
                  subject: `Edu Stack Pro - Absence Alert: ${subjectName}`,
                  text: `Dear ${student.name},\n\nYou were marked ABSENT for the ${subjectName} class held on ${date}.\n\nIf you believe this is an error, please contact your subject teacher.\n\nBest regards,\nEdu Stack Pro Team`
                });

                // Email alert to Parent
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
    }

    // 5. Reset Class session fields
    await targetClass.update({
      isSessionActive: false,
      activeOtp: null,
      activeQrToken: null,
      activeOtpExpires: null
    });

    const io = req.app.get('io');
    if (io) {
      io.to(classId).emit('session_ended');
    }

    res.status(200).json({ message: 'Attendance session closed and missing students marked absent.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkIn = async (req, res) => {
  try {
    const classId = req.params.id;
    const { otp, qrToken, subjectId, date, latitude, longitude, bypassGps } = req.body;

    if (!subjectId || !date) {
      throw new Error('Missing subjectId or date');
    }

    const targetClass = await Class.findByPk(classId);
    if (!targetClass || !targetClass.isSessionActive) {
      throw new Error('Attendance session is not active for this class');
    }

    // 1. Verify Code (OTP or QR Token)
    let isCodeValid = false;
    if (qrToken) {
      isCodeValid = (targetClass.activeQrToken === qrToken);
    } else if (otp) {
      const now = new Date();
      // Allow a 5-second network transmission grace window
      const expirationWithGrace = new Date(new Date(targetClass.activeOtpExpires).getTime() + 5000);
      isCodeValid = (targetClass.activeOtp === otp && now < expirationWithGrace);
    }

    if (!isCodeValid) {
      throw new Error('Invalid or expired verification code. Please scan/enter the latest active code.');
    }

    // 2. Verify Geofence GPS location
    const isGpsBypassed = !!(bypassGps && req.user.role !== 'student');
    if (!isGpsBypassed && targetClass.isLocationLocked && targetClass.latitude && targetClass.longitude) {
      if (!latitude || !longitude) {
        throw new Error('This session requires location lock. Please enable GPS location access to check-in.');
      }
      const distance = getDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        targetClass.latitude,
        targetClass.longitude
      );
      if (distance > 5) { // Limit to 5m classroom radius
        throw new Error(`Access restricted. You are standing outside the classroom (distance: ${Math.round(distance)}m, limit is 5m).`);
      }
    }

    // 3. Find Attendance Session record
    const attendance = await Attendance.findOne({
      where: { classId, subjectId, date }
    });

    if (!attendance) {
      throw new Error('Attendance session has not been initialized by the teacher.');
    }

    // 4. Create/Update student attendance record
    const [record, created] = await AttendanceRecord.findOrCreate({
      where: { attendanceId: attendance.id, studentId: req.user.id },
      defaults: { status: 'present' }
    });

    if (!created) {
      await record.update({ status: 'present' });
    }

    // 5. Notify teacher screen via WebSockets
    const io = req.app.get('io');
    if (io) {
      io.to(classId).emit('student_checked_in', {
        studentId: req.user.id,
        name: req.user.name,
        email: req.user.email
      });
    }

    res.status(200).json({ message: 'Checked-in successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  startSession,
  rotateSessionCodes,
  endSession,
  checkIn
};
