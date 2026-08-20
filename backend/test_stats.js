const { User, Class, Subject, AttendanceRecord, Attendance, Mark, RecoveryAssignment } = require('./models');
const { Op } = require('sequelize');

async function test() {
  const req = {
    user: await User.findOne({ where: { email: 'neeraj123@gmail.com' } })
  };
  const res = {
    status: (code) => {
      console.log('STATUS:', code);
      return res;
    },
    json: (data) => {
      console.log('JSON RESULT:', JSON.stringify(data, null, 2));
    }
  };

  try {
    const stats = {};
    const studentUser = await User.findByPk(req.user.id);
    const studentClassId = studentUser.classId;

    // Fetch all attendance records with subject details including type and credits
    const records = await AttendanceRecord.findAll({
      where: { studentId: req.user.id },
      include: [{
        model: Attendance,
        include: [{ model: Subject, attributes: ['id', 'name', 'code', 'type', 'credits'] }]
      }]
    });

    // Fetch approved recovery assignments
    const approvedAssignments = await RecoveryAssignment.findAll({
      where: { studentId: req.user.id, status: 'approved' },
      include: [{ model: Subject, attributes: ['type'] }]
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

    // Apply recovery assignment boost to totals
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

    stats.theoryAttended = theoryAttended;
    stats.theoryTotal = theoryTotal;
    stats.theoryPercentage = theoryPercentage;

    stats.labAttended = labAttended;
    stats.labTotal = labTotal;
    stats.labPercentage = labPercentage;

    const totalAttended = theoryAttended + labAttended;
    const totalHeld = theoryTotal + labTotal;
    stats.attendancePercentage = totalHeld === 0 ? 0 : Math.round((totalAttended / totalHeld) * 100);

    const hasDeficit = (theoryTotal > 0 && theoryPercentage < 75) || (labTotal > 0 && labPercentage < 60);

    if (hasDeficit && totalHeld > 0) {
      if (!studentUser.gracePeriodEnds) {
        const graceDate = new Date();
        graceDate.setDate(graceDate.getDate() + 7);
        studentUser.gracePeriodEnds = graceDate.toISOString().split('T')[0];
        await studentUser.save();
      }
    } else {
      if (studentUser.gracePeriodEnds) {
        studentUser.gracePeriodEnds = null;
        await studentUser.save();
      }
    }
    stats.gracePeriodEnds = studentUser.gracePeriodEnds;

    // Active check-in session detection for student's class
    const activeClassData = await Class.findOne({
      where: { id: studentClassId, isSessionActive: true }
    });
    if (activeClassData) {
      const activeAttendance = await Attendance.findOne({
        where: { classId: studentClassId, date: new Date().toISOString().split('T')[0] },
        order: [['createdAt', 'DESC']],
        include: [{ model: Subject, attributes: ['name', 'code'] }]
      });

      stats.activeClass = {
        id: activeClassData.id,
        name: activeClassData.name,
        latitude: activeClassData.latitude,
        longitude: activeClassData.longitude,
        isLocationLocked: activeClassData.isLocationLocked,
        subjectId: activeAttendance ? activeAttendance.subjectId : null,
        subjectName: activeAttendance && activeAttendance.Subject ? activeAttendance.Subject.name : 'Class Session',
        subjectCode: activeAttendance && activeAttendance.Subject ? activeAttendance.Subject.code : ''
      };
    } else {
      stats.activeClass = null;
    }

    const theorySafe = theoryAttended > 0 ? Math.max(0, Math.floor(theoryAttended / 0.75) - theoryTotal) : 0;
    const labSafe = labAttended > 0 ? Math.max(0, Math.floor(labAttended / 0.60) - labTotal) : 0;
    
    let theoryDropTo = 0;
    if (theoryTotal > 0) {
      theoryDropTo = Math.round((theoryAttended / (theoryTotal + 3)) * 100);
    }
    
    stats.aiPredictor = {
      theorySafeMisses: theorySafe,
      labSafeMisses: labSafe,
      theoryDropAfter3Misses: theoryDropTo
    };

    // Fetch all subjects for the student's class, including Teacher details
    const classSubjects = await Subject.findAll({
      where: { classId: studentClassId },
      include: [{ model: User, as: 'Teacher', attributes: ['name', 'email'] }]
    });

    // Extract unique teachers
    const teachersMap = {};
    classSubjects.forEach(sub => {
      if (sub.Teacher) {
        teachersMap[sub.Teacher.email] = {
          name: sub.Teacher.name,
          email: sub.Teacher.email,
          subjectName: sub.name,
          subjectCode: sub.code
        };
      }
    });
    stats.myTeachers = Object.values(teachersMap);

    // Fetch Class Mentor
    const classMentor = await User.findOne({
      where: {
        collegeId: studentUser.collegeId,
        role: { [Op.in]: ['admin', 'teacher', 'mentor'] }
      },
      attributes: ['name', 'email']
    });
    stats.classMentor = classMentor ? { name: classMentor.name, email: classMentor.email } : null;

    res.status(200).json(stats);
  } catch (error) {
    console.error('ERROR IN CONTROLLER:', error);
  }
}

test();
