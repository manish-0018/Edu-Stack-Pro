const { User, Mark, Subject, PlacementApplication, CompanyListing, Opportunity, TeamRequest, Task, AttendanceRecord, Attendance, RecoveryAssignment } = require('../models');

// @desc Get portfolio for logged-in student
const getMyPortfolio = async (req, res) => {
  try {
    const studentId = req.user.id;
    await buildPortfolio(studentId, res);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get portfolio for a specific student (admin/teacher)
const getStudentPortfolio = async (req, res) => {
  try {
    await buildPortfolio(req.params.studentId, res);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const buildPortfolio = async (studentId, res) => {
  const user = await User.findByPk(studentId, { attributes: { exclude: ['password'] } });
  if (!user) return res.status(404).json({ message: 'Student not found' });

  // Marks
  const marks = await Mark.findAll({
    where: { studentId },
    include: [{ model: Subject, attributes: ['name', 'code', 'type'] }]
  });

  // Attendance
  const records = await AttendanceRecord.findAll({ where: { studentId } });
  const totalClasses = records.length;
  const attendedClasses = records.filter(r => ['present', 'late', 'excused', 'duty'].includes(r.status)).length;
  const recoveries = await RecoveryAssignment.findAll({ where: { studentId, status: 'approved' } });
  const boostedAttended = Math.min(totalClasses, attendedClasses + recoveries.reduce((s, r) => s + r.boostCount, 0));
  const attendancePercentage = totalClasses === 0 ? 100 : Math.round((boostedAttended / totalClasses) * 100);

  // Placement applications
  const placements = await PlacementApplication.findAll({
    where: { studentId },
    include: [{ model: CompanyListing, as: 'Company', attributes: ['name', 'position', 'package'] }]
  });

  // Opportunities / Hackathons
  const teamRequests = await TeamRequest.findAll({
    where: { studentId },
    include: [{ model: Opportunity, attributes: ['title', 'type'] }]
  });

  // Tasks completed
  const tasks = await Task.findAll({ where: { studentId, status: 'done' } });

  // Compute GPA (avg across subjects)
  const subjectAvgs = {};
  marks.forEach(m => {
    const key = m.Subject?.name || 'Unknown';
    if (!subjectAvgs[key]) subjectAvgs[key] = { total: 0, count: 0, maxMarks: m.maxMarks };
    subjectAvgs[key].total += m.marks;
    subjectAvgs[key].count++;
  });

  const subjectSummary = Object.entries(subjectAvgs).map(([subject, data]) => ({
    subject,
    average: Math.round(data.total / data.count),
    maxMarks: data.maxMarks
  }));

  const overallAvg = subjectSummary.length
    ? Math.round(subjectSummary.reduce((s, x) => s + x.average, 0) / subjectSummary.length)
    : 0;

  res.status(200).json({
    user,
    academics: {
      subjectSummary,
      overallAverage: overallAvg,
      totalMarksRecorded: marks.length
    },
    attendance: {
      totalClasses, attendedClasses: boostedAttended, attendancePercentage
    },
    placements: {
      total: placements.length,
      list: placements
    },
    opportunities: {
      total: teamRequests.length,
      list: teamRequests
    },
    achievements: {
      completedTasks: tasks.length,
      tasks
    }
  });
};

module.exports = { getMyPortfolio, getStudentPortfolio };
