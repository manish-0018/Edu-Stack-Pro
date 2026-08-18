const { Assignment, AssignmentSubmission, User, Subject, Class } = require('../models');
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
      const { title, description, subjectId, dueDate, maxMarks } = req.body;
      const fileUrl = req.file ? `/uploads/assignments/${req.file.filename}` : null;
      const assignment = await Assignment.create({
        title, description, subjectId,
        teacherId: req.user.id,
        dueDate: dueDate || null,
        maxMarks: maxMarks || 100,
        fileUrl
      });
      res.status(201).json(assignment);
    } catch (err) { res.status(500).json({ message: err.message }); }
  });
};

// @desc   Get all assignments (filtered by role)
const getAssignments = async (req, res) => {
  try {
    let where = {};
    if (req.user.role === 'teacher') where.teacherId = req.user.id;

    const assignments = await Assignment.findAll({
      where,
      include: [
        { model: Subject, attributes: ['name', 'code'] },
        { model: User, as: 'Teacher', attributes: ['name'] },
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
    const { id } = req.params; // submissionId
    const { grade, feedback } = req.body;
    const submission = await AssignmentSubmission.findByPk(id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
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
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    await assignment.destroy();
    res.status(200).json({ id: req.params.id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createAssignment, getAssignments, submitAssignment, gradeSubmission, getSubmissions, getMySubmission, deleteAssignment };
