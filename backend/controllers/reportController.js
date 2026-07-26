const { User, Class, Subject, AttendanceRecord, Attendance, Mark, RecoveryAssignment } = require('../models');

const generateDefaulterReport = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'student' },
      include: [{ model: Class, attributes: ['name'] }]
    });

    let csv = 'Student Name, Email, Roll Number, Class, Theory %, Lab %, Status\n';

    for (const student of students) {
      const records = await AttendanceRecord.findAll({
        where: { studentId: student.id },
        include: [{
          model: Attendance,
          include: [{ model: Subject, attributes: ['type'] }]
        }]
      });

      const totalCount = records.length;
      if (totalCount > 0) {
        let theoryTotal = 0;
        let theoryAttended = 0;
        let labTotal = 0;
        let labAttended = 0;

        records.forEach(r => {
          const isAttended = ['present', 'late', 'excused', 'duty'].includes(r.status);
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

        if (theoryPercentage < 75 || labPercentage < 60) {
          csv += `"${student.name}", "${student.email}", "${student.id}", "${student.Class?.name || 'N/A'}", "${theoryPercentage}%", "${labPercentage}%", "DEFAULTER"\n`;
        }
      }
    }

    res.header('Content-Type', 'text/csv');
    res.attachment('defaulters_report.csv');
    res.send(csv);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const generateMarksReport = async (req, res) => {
  try {
    const marks = await Mark.findAll({
      include: [
        { model: User, as: 'Student', attributes: ['name', 'email'] },
        { model: Subject, attributes: ['name', 'code'] }
      ]
    });
    
    // Using a map to avoid duplicate rows, and clean spacing
    let csv = 'Student Name, Email, Subject Code, Subject Name, Mid Sem, Quiz, Assignment\n';
    
    const uniqueMarks = new Map();
    marks.forEach(m => {
      const key = `${m.studentId}-${m.subjectId}`;
      if (!uniqueMarks.has(key)) {
        uniqueMarks.set(key, m);
      }
    });

    uniqueMarks.forEach(m => {
      csv += `"${m.Student?.name || ''}", "${m.Student?.email || ''}", "${m.Subject?.code || ''}", "${m.Subject?.name || ''}", "${m.midSem || 0}", "${m.quiz || 0}", "${m.assignment || 0}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('marks_report.csv');
    res.send(csv);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { generateDefaulterReport, generateMarksReport };
