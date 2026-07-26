const { User, Class, AttendanceRecord, Attendance, Subject, RecoveryAssignment } = require('../models');
const nodemailer = require('nodemailer');

const getUsers = async (req, res) => {
  try {
    const { role, classId } = req.query;
    let whereClause = {};

    if (role) whereClause.role = role;
    if (classId) whereClause.classId = classId;

    if (req.user.role === 'teacher') {
      whereClause.role = 'student';
    }

    if (req.user.collegeId) {
      whereClause.collegeId = req.user.collegeId;
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      include: [{ model: Class, attributes: ['name'] }]
    });

    const result = [];
    for (const u of users) {
      const userData = u.toJSON();
      if (u.role === 'student') {
        const records = await AttendanceRecord.findAll({
          where: { studentId: u.id },
          include: [{
            model: Attendance,
            include: [{ model: Subject, attributes: ['type'] }]
          }]
        });

        let theoryTotal = 0;
        let theoryAttended = 0;
        let labTotal = 0;
        let labAttended = 0;

        records.forEach(r => {
          const isAttended = r.status === 'present' || r.status === 'late' || r.status === 'excused' || r.status === 'duty';
          const subType = r.Attendance?.Subject?.type || 'theory';
          if (subType === 'theory') {
            theoryTotal++;
            if (isAttended) theoryAttended++;
          } else {
            labTotal++;
            if (isAttended) labAttended++;
          }
        });

        const approvedAssignments = await RecoveryAssignment.findAll({
          where: { studentId: u.id, status: 'approved' },
          include: [{ model: Subject, attributes: ['type'] }]
        });

        approvedAssignments.forEach(ass => {
          const subType = ass.Subject?.type || 'theory';
          if (subType === 'theory') {
            theoryAttended = Math.min(theoryTotal, theoryAttended + ass.boostCount);
          } else {
            labAttended = Math.min(labTotal, labAttended + ass.boostCount);
          }
        });

        const theoryPercentage = theoryTotal === 0 ? 100 : Math.round((theoryAttended / theoryTotal) * 100);
        const labPercentage = labTotal === 0 ? 100 : Math.round((labAttended / labTotal) * 100);
        const totalAttended = theoryAttended + labAttended;
        const totalHeld = theoryTotal + labTotal;
        const attendancePercentage = totalHeld === 0 ? 0 : Math.round((totalAttended / totalHeld) * 100);

        userData.theoryPercentage = theoryPercentage;
        userData.labPercentage = labPercentage;
        userData.attendancePercentage = attendancePercentage;
        userData.theoryRatio = `${theoryAttended}/${theoryTotal}`;
        userData.labRatio = `${labAttended}/${labTotal}`;
        userData.totalClasses = totalHeld;
        userData.attendedClasses = totalAttended;
      }
      result.push(userData);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) throw new Error('User not found');

    const { classId, parentEmail, course } = req.body;
    
    const updateData = {};
    if (classId !== undefined) updateData.classId = classId || null;
    if (parentEmail !== undefined) updateData.parentEmail = parentEmail || null;
    if (course !== undefined) updateData.course = course || null;

    await user.update(updateData);

    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Class, attributes: ['name'] }]
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendWarningEmail = async (req, res) => {
  try {
    const student = await User.findByPk(req.params.id);
    if (!student) throw new Error('Student not found');

    const { attendancePercentage, className, totalClasses, attendedClasses } = req.body;
    const targetEmail = student.parentEmail || student.email;

    if (!targetEmail) {
      throw new Error('Student has no registered parent or personal email address.');
    }

    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const mailOptions = {
      from: '"Edu Stack Pro School Registry" <noreply@edustack.com>',
      to: targetEmail,
      subject: `⚠️ ATTENDANCE WARNING NOTICE: ${student.name.toUpperCase()} (Below 75%)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <div style="background-color: #ef4444; color: white; padding: 15px; font-size: 20px; font-weight: bold; border-radius: 4px; text-align: center;">
            EDU STACK PRO ACADEMY - NOTICE
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #4a5568;">
            Dear Parent / Guardian,
          </p>
          <p style="font-size: 14px; color: #4a5568; line-height: 1.5;">
            This is an official notice regarding the attendance criteria of your child, <strong>${student.name}</strong>, enrolled in class <strong>${className || 'N/A'}</strong>.
          </p>
          <div style="background-color: #f7fafc; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0;"><strong>Current Attendance:</strong></td>
                <td style="color: #ef4444; font-weight: bold; padding: 4px 0;">${attendancePercentage}%</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;"><strong>Minimum Required:</strong></td>
                <td style="padding: 4px 0;">75%</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;"><strong>Total Classes Held:</strong></td>
                <td style="padding: 4px 0;">${totalClasses}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;"><strong>Attended Days:</strong></td>
                <td style="padding: 4px 0;">${attendedClasses}</td>
              </tr>
            </table>
          </div>
          <p style="font-size: 14px; color: #4a5568; line-height: 1.5;">
            Per the academic regulations, students who fail to maintain a minimum of 75% attendance are ineligible to appear for final semester examinations. <strong>${student.name}</strong> is currently at risk of debarment from exams.
          </p>
          <p style="font-size: 14px; color: #4a5568; line-height: 1.5;">
            We request your immediate attention to ensure regular class attendance.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #a0aec0; text-align: center; margin: 0;">
            This is an automated system email. Please contact the department registry office for further queries.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    let testUrl = '';
    if (!process.env.SMTP_HOST) {
      testUrl = nodemailer.getTestMessageUrl(info);
      console.log('Test email sent! View it here:', testUrl);
    }

    res.status(200).json({ 
      message: 'Warning email sent successfully!', 
      testUrl,
      recipient: targetEmail
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) throw new Error('User not found');

    await user.destroy();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getResumeData = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['name', 'email', 'course', 'role']
    });

    const marks = await require('../models').Mark.findAll({
      where: { studentId: req.user.id },
      include: [{ model: require('../models').Subject, attributes: ['name'] }]
    });

    const tasks = await require('../models').Task.findAll({
      where: { studentId: req.user.id, status: 'done' }
    });

    res.status(200).json({ user, marks, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGuardianStudent = async (req, res) => {
  try {
    const guardianEmail = req.user.email;
    const student = await User.findOne({
      where: { parentEmail: guardianEmail, role: 'student' },
      attributes: ['id', 'name', 'email', 'classId', 'course']
    });

    if (!student) {
      return res.status(404).json({ message: 'No student found linked to your email.' });
    }

    const { Subject, Class, Mark, Attendance, RecoveryAssignment } = require('../models');
    
    const marks = await Mark.findAll({
      where: { studentId: student.id },
      include: [{ model: Subject, attributes: ['name', 'type'] }]
    });

    const attendances = await Attendance.findAll({
      where: { studentId: student.id },
      include: [{ model: Subject, attributes: ['name', 'type'] }]
    });

    // Compute attendance percentage
    let totalClasses = 0;
    let attendedClasses = 0;
    attendances.forEach(a => {
      totalClasses++;
      if (a.status === 'present') attendedClasses++;
    });

    // Add recovery boosts
    const approvedAssignments = await RecoveryAssignment.findAll({
      where: { studentId: student.id, status: 'approved' }
    });
    approvedAssignments.forEach(ass => {
      attendedClasses = Math.min(totalClasses, attendedClasses + ass.boostCount);
    });

    const attendancePercentage = totalClasses === 0 ? 100 : Math.round((attendedClasses / totalClasses) * 100);

    res.status(200).json({ 
      student, 
      marks, 
      attendanceStats: { totalClasses, attendedClasses, attendancePercentage },
      attendances
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers, updateUser, sendWarningEmail, deleteUser, getResumeData, getGuardianStudent };
