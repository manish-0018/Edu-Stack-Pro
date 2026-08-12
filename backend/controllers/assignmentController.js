const { Assignment, AssignmentSubmission, User, Subject, Class, Notification } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for assignment file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/assignments');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage }).single('file');

// @desc   Create assignment (teacher)
const createAssignment = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Only teachers are authorized to upload assignments.' });
      }
      const { title, description, subjectId, dueDate, maxMarks } = req.body;
      const fileUrl = req.file ? `/uploads/assignments/${req.file.filename}` : null;
      const assignment = await Assignment.create({
        title, description, subjectId,
        teacherId: req.user.id,
        dueDate: dueDate || null,
        maxMarks: maxMarks || 100,
        fileUrl
      });

      // Send notification to all students in the class section
      try {
        const subject = await Subject.findByPk(subjectId);
        if (subject && subject.classId) {
          const students = await User.findAll({
            where: {
              role: 'student',
              classId: subject.classId,
              collegeId: req.user.collegeId
            }
          });

          const notifications = students.map(student => ({
            userId: student.id,
            title: 'New Assignment Uploaded 📝',
            message: `A new assignment "${title}" has been uploaded for ${subject.name}. Due date: ${dueDate ? new Date(dueDate).toLocaleDateString() : 'No due date'}.`,
            type: 'info'
          }));

          if (notifications.length > 0) {
            await Notification.bulkCreate(notifications);
          }
        }
      } catch (notifErr) {
        console.error("Failed to dispatch assignment notifications", notifErr);
      }

      res.status(201).json(assignment);
    } catch (err) { res.status(500).json({ message: err.message }); }
  });
};

// @desc   Get all assignments (filtered by role)
const getAssignments = async (req, res) => {
  try {
    let where = {};
    let subjectWhere = {};

    if (req.user.role === 'teacher') {
      where.teacherId = req.user.id;
    } else if (req.user.role === 'student') {
      if (!req.user.classId) {
        return res.status(200).json([]);
      }
      subjectWhere.classId = req.user.classId;
    }

    const assignments = await Assignment.findAll({
      where,
      include: [
        { 
          model: Subject, 
          where: subjectWhere,
          attributes: ['name', 'code', 'classId'] 
        },
        { 
          model: User, 
          as: 'Teacher', 
          attributes: ['name'],
          where: { collegeId: req.user.collegeId },
          required: true
        },
        { model: AssignmentSubmission, required: false }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(assignments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc   Submit assignment (student - file upload)
const submitAssignment = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      const { id: assignmentId } = req.params;
      const assignment = await Assignment.findByPk(assignmentId);
      if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
      if (assignment.isLocked) {
        return res.status(400).json({ message: 'This assignment has been locked by the teacher. Submissions are no longer accepted.' });
      }

      const isLate = assignment.dueDate && new Date() > new Date(assignment.dueDate);
      const fileUrl = req.file ? `/uploads/assignments/${req.file.filename}` : null;

      let submission = await AssignmentSubmission.findOne({
        where: { assignmentId, studentId: req.user.id }
      });

      if (submission) {
        submission.fileUrl = fileUrl;
        submission.submittedAt = new Date();
        submission.status = isLate ? 'late' : 'submitted';
        await submission.save();
      } else {
        submission = await AssignmentSubmission.create({
          assignmentId, studentId: req.user.id,
          fileUrl, submittedAt: new Date(),
          status: isLate ? 'late' : 'submitted'
        });
      }
      res.status(200).json(submission);
    } catch (e) { res.status(500).json({ message: e.message }); }
  });
};

// @desc   Grade a submission (teacher)
const gradeSubmission = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers are authorized to grade submissions.' });
    }
    const { id } = req.params; // submissionId
    const { grade, feedback } = req.body;
    const submission = await AssignmentSubmission.findByPk(id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    const assignment = await Assignment.findByPk(submission.assignmentId);
    if (assignment && Number(grade) > assignment.maxMarks) {
      return res.status(400).json({ message: `Grade cannot exceed the maximum marks of ${assignment.maxMarks}` });
    }

    submission.grade = grade;
    submission.feedback = feedback || '';
    submission.status = 'graded';
    await submission.save();
    res.status(200).json(submission);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc   Get all submissions for an assignment (teacher)
const getSubmissions = async (req, res) => {
  try {
    const { id: assignmentId } = req.params;

    // Verify assignment belongs to the user's college
    const assignment = await Assignment.findOne({
      where: { id: assignmentId },
      include: [{
        model: User,
        as: 'Teacher',
        where: { collegeId: req.user.collegeId },
        required: true
      }]
    });

    if (!assignment) {
      return res.status(403).json({ message: 'Access denied. Assignment does not belong to your college.' });
    }

    const submissions = await AssignmentSubmission.findAll({
      where: { assignmentId },
      include: [{ model: User, as: 'Student', attributes: ['name', 'email'] }]
    });
    res.status(200).json(submissions);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc   Get my submission for an assignment (student)
const getMySubmission = async (req, res) => {
  try {
    const { id: assignmentId } = req.params;
    const submission = await AssignmentSubmission.findOne({
      where: { assignmentId, studentId: req.user.id }
    });
    res.status(200).json(submission || null);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Delete assignment (teacher/admin)
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      where: { id: req.params.id },
      include: [{
        model: User,
        as: 'Teacher',
        attributes: ['collegeId'],
        required: true
      }]
    });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    if (req.user.role === 'teacher' && assignment.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own assignments.' });
    }

    if (req.user.role === 'admin' && assignment.Teacher?.collegeId !== req.user.collegeId) {
      return res.status(403).json({ message: 'Access denied. You can only delete assignments for your college.' });
    }

    await assignment.destroy();
    res.status(200).json({ id: req.params.id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Toggle assignment submission lock (teacher who posted)
const toggleAssignmentLock = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (req.user.role !== 'teacher' || assignment.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Only the teacher who uploaded the assignment can lock it.' });
    }
    assignment.isLocked = !assignment.isLocked;
    await assignment.save();
    res.status(200).json(assignment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createAssignment, getAssignments, submitAssignment, gradeSubmission, getSubmissions, getMySubmission, deleteAssignment, toggleAssignmentLock };
