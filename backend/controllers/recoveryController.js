const { RecoveryAssignment, User, Subject, Task, Attendance, AttendanceRecord, Notification } = require('../models');

// Get all recovery assignments
const getRecoveryAssignments = async (req, res) => {
  try {
    let whereClause = {};
    const studentInclude = { model: User, as: 'Student', attributes: ['name', 'email', 'collegeId'] };

    if (req.user.role === 'student') {
      whereClause.studentId = req.user.id;
    }

    if (req.user.collegeId) {
      studentInclude.where = { collegeId: req.user.collegeId };
    }

    const assignments = await RecoveryAssignment.findAll({
      where: whereClause,
      include: [
        studentInclude,
        { model: Subject, attributes: ['name', 'code'] }
      ]
    });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a recovery assignment request (Student) or Schedule Remedial Class (Teacher)
const createRecoveryRequest = async (req, res) => {
  try {
    const { 
      subjectId, 
      studentId,
      title, 
      description, 
      absenceReason, 
      absenceDate, 
      hoursMissed, 
      documentUrl,
      feePaid,
      sessionType
    } = req.body;

    if (!subjectId || !title || !description) {
      throw new Error('Please add all required fields');
    }

    const computedBoost = hoursMissed ? parseInt(hoursMissed) : 2;

    const assignmentData = {
      subjectId,
      title,
      description,
      boostCount: computedBoost,
      sessionType: sessionType || 'Condonation Petition'
    };

    if (req.user.role === 'student') {
      assignmentData.studentId = req.user.id;
      assignmentData.status = 'pending';
      assignmentData.absenceReason = absenceReason || 'Medical Leave';
      assignmentData.absenceDate = absenceDate || new Date().toISOString().split('T')[0];
      assignmentData.hoursMissed = computedBoost;
      assignmentData.documentUrl = documentUrl || '';
      assignmentData.feePaid = feePaid ? parseFloat(feePaid) : 0;
      assignmentData.remedialStatus = 'Pending';
    } else {
      // Teacher scheduling a remedial class
      if (!studentId) {
        throw new Error('Please select a student for this remedial session.');
      }
      assignmentData.studentId = studentId;
      assignmentData.status = 'pending';
      assignmentData.absenceReason = 'Remedial Class Session';
      assignmentData.absenceDate = absenceDate || new Date().toISOString().split('T')[0];
      assignmentData.hoursMissed = computedBoost;
      assignmentData.remedialStatus = 'Scheduled';
    }

    const assignment = await RecoveryAssignment.create(assignmentData);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Submit work for recovery assignment (Student)
const submitRecoveryWork = async (req, res) => {
  try {
    const { submissionText } = req.body;
    const assignment = await RecoveryAssignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await assignment.update({
      submissionText,
      status: 'submitted'
    });

    res.status(200).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update assignment status (Teacher/Admin - Approve/Reject Condonation OR Update Remedial Status)
const updateRecoveryStatus = async (req, res) => {
  try {
    const { status, reviewFeedback, remedialStatus } = req.body;
    const assignment = await RecoveryAssignment.findByPk(req.params.id, {
      include: [{ model: User, as: 'Student' }]
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (req.user.collegeId && assignment.Student && assignment.Student.collegeId !== req.user.collegeId) {
      return res.status(403).json({ message: 'You are not authorized to access sessions in a different college.' });
    }

    const updates = {};
    if (status) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only the Dean (Admin) is authorized to audit condonation petitions.' });
      }
      updates.status = status;
    }
    if (reviewFeedback !== undefined) updates.reviewFeedback = reviewFeedback;
    if (remedialStatus) {
      if (remedialStatus === 'Checked-In') {
        if (req.user.role === 'student' && assignment.studentId !== req.user.id) {
          return res.status(403).json({ message: 'You are not authorized to check-in for this student.' });
        }
      } else if (remedialStatus === 'Attended' || remedialStatus === 'Absent') {
        if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Only teachers or administrators can verify remedial class attendance.' });
        }
      }
      updates.remedialStatus = remedialStatus;
    }

    await assignment.update(updates);

    // Write real attendance credit into the database
    if (status === 'approved' || remedialStatus === 'Attended') {
      const student = await User.findByPk(assignment.studentId);
      if (student && student.classId) {
        // Find or create parent Attendance record
        let attendance = await Attendance.findOne({
          where: {
            classId: student.classId,
            subjectId: assignment.subjectId,
            date: assignment.absenceDate
          }
        });

        if (!attendance) {
          attendance = await Attendance.create({
            classId: student.classId,
            subjectId: assignment.subjectId,
            date: assignment.absenceDate,
            markedById: req.user.id
          });
        }

        // Find or create AttendanceRecord entry
        const statusType = assignment.sessionType === 'Condonation Petition' ? 'duty' : 'present';
        let record = await AttendanceRecord.findOne({
          where: {
            attendanceId: attendance.id,
            studentId: student.id
          }
        });

        if (!record) {
          await AttendanceRecord.create({
            attendanceId: attendance.id,
            studentId: student.id,
            status: statusType
          });
        } else {
          await record.update({ status: statusType });
        }

        // Add Notification
        try {
          await Notification.create({
            userId: student.id,
            title: 'Attendance Credit Added 📈',
            message: `Your attendance shortage recovery petition for ${assignment.sessionType === 'Condonation Petition' ? 'Condonation' : 'Saturday Remedial class'} has been verified! Credit of ${assignment.boostCount} hours has been logged.`,
            type: 'alert'
          });
        } catch (notifErr) {
          console.error("Failed to create credit notification", notifErr);
        }
      }
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getRecoveryAssignments,
  createRecoveryRequest,
  submitRecoveryWork,
  updateRecoveryStatus
};
