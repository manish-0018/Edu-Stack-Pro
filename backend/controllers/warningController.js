const { User, AttendanceRecord, Attendance, Subject, RecoveryAssignment, Notification } = require('../models');
const nodemailer = require('nodemailer');

const triggerDefaulterWarnings = async (req, res) => {
  try {
    // Basic setup for email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER || 'test@example.com',
        pass: process.env.SMTP_PASS || 'password'
      }
    });

    const students = await User.findAll({ where: { role: 'student' } });
    
    let warningCount = 0;

    for (const student of students) {
      const records = await AttendanceRecord.findAll({
        where: { studentId: student.id },
        include: [{
          model: Attendance,
          include: [{ model: Subject, attributes: ['type'] }]
        }]
      });

      if (records.length === 0) continue;

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
        where: { studentId: student.id, status: 'approved' },
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

      // Defaulter condition: theory < 75% or lab < 60%
      if (theoryPercentage < 75 || labPercentage < 60) {
        warningCount++;
        
        // Notify Student In-App
        await Notification.create({
          userId: student.id,
          title: 'ATTENDANCE WARNING',
          message: `Your attendance is critically low (Theory: ${theoryPercentage}%, Lab: ${labPercentage}%). Please attend classes regularly to avoid detention.`,
          type: 'alert'
        });
        
        // Email Parent only
        if (student.parentEmail && student.parentEmail !== student.email) {
          try {
            await transporter.sendMail({
              from: '"Edu Stack Pro Admin" <admin@edustack.edu>',
              to: student.parentEmail,
              subject: 'URGENT: Academic Attendance Warning',
              text: `Dear Parent,\n\nThis is an automated warning that your ward ${student.name}'s attendance has dropped below the required threshold (Theory: ${theoryPercentage}%, Lab: ${labPercentage}%).\n\nPlease ensure they attend classes regularly.`
            });
          } catch (e) {
            console.error("Failed to send email to parent", student.parentEmail, e);
          }
        }
      }
    }
    
    res.status(200).json({ message: `Scanned all students. Issued ${warningCount} warnings.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { triggerDefaulterWarnings };
