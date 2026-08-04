const { User, Class, Subject, AttendanceRecord, Attendance, Mark, RecoveryAssignment, College } = require('../models');

const getDashboardStats = async (req, res) => {
  try {
    const stats = {};

    if (req.user.role === 'admin' || req.user.role === 'teacher') {
      let userWhere = { role: 'student' };
      let teacherWhere = { role: 'teacher' };
      let classWhere = {};
      let subjectInclude = [];

      if (req.user.collegeId) {
        userWhere.collegeId = req.user.collegeId;
        teacherWhere.collegeId = req.user.collegeId;
        classWhere.collegeId = req.user.collegeId;
        subjectInclude.push({
          model: Class,
          where: { collegeId: req.user.collegeId },
          attributes: []
        });
      }

      stats.totalStudents = await User.count({ where: userWhere });
      stats.totalTeachers = await User.count({ where: teacherWhere });
      stats.totalClasses = await Class.count({ where: classWhere });
      stats.totalSubjects = await Subject.count({ include: subjectInclude });

      // Find all students in this college and calculate their attendance percentage
      const students = await User.findAll({
        where: userWhere,
        include: [{ model: Class, attributes: ['name'] }]
      });

      const defaulters = [];
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

          // Fetch approved recovery assignments
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

          const totalAttended = theoryAttended + labAttended;
          const totalHeld = theoryTotal + labTotal;
          const attendancePercentage = totalHeld === 0 ? 0 : Math.round((totalAttended / totalHeld) * 100);

          if (theoryPercentage < 75 || labPercentage < 60) {
            defaulters.push({
              id: student.id,
              name: student.name,
              email: student.email,
              className: student.Class?.name || 'N/A',
              theoryPercentage,
              labPercentage,
              theoryRatio: `${theoryAttended}/${theoryTotal}`,
              labRatio: `${labAttended}/${labTotal}`,
              attendancePercentage,
              totalClasses: totalHeld,
              attendedClasses: totalAttended,
              gracePeriodEnds: student.gracePeriodEnds || null
            });
          }
        }
      }
      stats.defaulters = defaulters;
    } else if (req.user.role === 'student') {
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

      // Overall average percentage for grace period logic:
      const totalAttended = theoryAttended + labAttended;
      const totalHeld = theoryTotal + labTotal;
      stats.attendancePercentage = totalHeld === 0 ? 0 : Math.round((totalAttended / totalHeld) * 100);

      // Check / Set Grace Period based on: either theory < 75 OR lab < 60!
      const studentUser = await User.findByPk(req.user.id);
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

      // AI Predictor Stats
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

      // Check if student's class has an active attendance session
      const studentClassId = studentUser.classId;
      if (studentClassId) {
        const studentClass = await Class.findByPk(studentClassId);
        if (studentClass && studentClass.isSessionActive) {
          // Find the active attendance session to get the subject name
          const activeAttendance = await Attendance.findOne({
            where: { classId: studentClassId, date: new Date().toISOString().split('T')[0] },
            include: [{ model: Subject, attributes: ['name'] }]
          });
          stats.activeClass = {
            id: studentClass.id,
            name: studentClass.name,
            latitude: studentClass.latitude,
            longitude: studentClass.longitude,
            subjectId: activeAttendance ? activeAttendance.subjectId : null,
            subjectName: activeAttendance && activeAttendance.Subject ? activeAttendance.Subject.name : 'Current Class'
          };
        } else {
          stats.activeClass = null;
        }
      } else {
        stats.activeClass = null;
      }

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

      // Subject-wise attendance calculation
      const subjectMap = {};
      classSubjects.forEach(sub => {
        subjectMap[sub.id] = {
          id: sub.id,
          name: sub.name,
          code: sub.code,
          type: sub.type || 'theory',
          credits: sub.credits || 3,
          total: 0,
          attended: 0
        };
      });

      records.forEach(rec => {
        const subject = rec.Attendance?.Subject;
        if (subject) {
          if (!subjectMap[subject.id]) {
            subjectMap[subject.id] = {
              id: subject.id,
              name: subject.name,
              code: subject.code,
              type: subject.type || 'theory',
              credits: subject.credits || 3,
              total: 0,
              attended: 0
            };
          }
          subjectMap[subject.id].total++;
          if (rec.status === 'present' || rec.status === 'late' || rec.status === 'excused' || rec.status === 'duty') {
            subjectMap[subject.id].attended++;
          }
        }
      });

      // Apply subject-wise boost from recovery assignments
      approvedAssignments.forEach(ass => {
        if (subjectMap[ass.subjectId]) {
          subjectMap[ass.subjectId].attended = Math.min(
            subjectMap[ass.subjectId].total,
            subjectMap[ass.subjectId].attended + ass.boostCount
          );
        }
      });

      const subjectWiseStats = Object.values(subjectMap).map(sub => ({
        ...sub,
        percentage: sub.total === 0 ? 100 : Math.round((sub.attended / sub.total) * 100)
      }));

      stats.subjectWiseStats = subjectWiseStats;

      // Fetch recorded internal marks
      const marks = await Mark.findAll({
        where: { studentId: req.user.id }
      });

      // Construct a list of marks for all subjects (prefilled with DB values if they exist)
      const allMarks = classSubjects.map(sub => {
        const mark = marks.find(m => m.subjectId === sub.id);
        return {
          id: mark ? mark.id : `temp-${sub.id}`,
          studentId: req.user.id,
          subjectId: sub.id,
          midSem: mark ? mark.midSem : null,
          quiz: mark ? mark.quiz : null,
          assignment: mark ? mark.assignment : null,
          Subject: {
            id: sub.id,
            name: sub.name,
            code: sub.code,
            type: sub.type || 'theory',
            credits: sub.credits || 3
          }
        };
      });

      stats.marks = allMarks;
    }

    if (req.user.collegeId) {
      stats.college = await College.findByPk(req.user.collegeId);
    }

    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getStudentDashboardById = async (req, res) => {
  try {
    const studentId = req.params.id;
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const studentUser = await User.findByPk(studentId);
    if (!studentUser) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.user.collegeId && studentUser.collegeId !== req.user.collegeId) {
      return res.status(403).json({ message: 'Access denied: Student belongs to another college.' });
    }

    // Fetch all attendance records with subject details including type and credits
    const records = await AttendanceRecord.findAll({
      where: { studentId },
      include: [{
        model: Attendance,
        include: [{ model: Subject, attributes: ['id', 'name', 'code', 'type', 'credits'] }]
      }]
    });

    // Fetch approved recovery assignments
    const approvedAssignments = await RecoveryAssignment.findAll({
      where: { studentId, status: 'approved' },
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

    const totalAttended = theoryAttended + labAttended;
    const totalHeld = theoryTotal + labTotal;
    const attendancePercentage = totalHeld === 0 ? 0 : Math.round((totalAttended / totalHeld) * 100);

    // Fetch all subjects for the student's class
    const studentClassId = studentUser.classId;
    const classSubjects = await Subject.findAll({
      where: { classId: studentClassId }
    });

    // Subject-wise attendance calculation
    const subjectMap = {};
    classSubjects.forEach(sub => {
      subjectMap[sub.id] = {
        id: sub.id,
        name: sub.name,
        code: sub.code,
        type: sub.type || 'theory',
        credits: sub.credits || 3,
        total: 0,
        attended: 0
      };
    });

    records.forEach(rec => {
      const subject = rec.Attendance?.Subject;
      if (subject) {
        if (!subjectMap[subject.id]) {
          subjectMap[subject.id] = {
            id: subject.id,
            name: subject.name,
            code: subject.code,
            type: subject.type || 'theory',
            credits: subject.credits || 3,
            total: 0,
            attended: 0
          };
        }
        subjectMap[subject.id].total++;
        const isAttended = rec.status === 'present' || rec.status === 'late' || rec.status === 'excused' || rec.status === 'duty';
        if (isAttended) {
          subjectMap[subject.id].attended++;
        }
      }
    });

    // Boost subject-wise attendance using approved recovery assignments
    approvedAssignments.forEach(ass => {
      if (subjectMap[ass.subjectId]) {
        subjectMap[ass.subjectId].attended = Math.min(
          subjectMap[ass.subjectId].total,
          subjectMap[ass.subjectId].attended + ass.boostCount
        );
      }
    });

    const subjectsList = Object.values(subjectMap).map(sub => ({
      ...sub,
      percentage: sub.total === 0 ? 100 : Math.round((sub.attended / sub.total) * 100)
    }));

    res.status(200).json({
      student: {
        id: studentUser.id,
        name: studentUser.name,
        email: studentUser.email
      },
      theoryAttended,
      theoryTotal,
      theoryPercentage,
      labAttended,
      labTotal,
      labPercentage,
      attendancePercentage,
      subjects: subjectsList
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getStudentDashboardById };
