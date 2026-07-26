const { RecoveryAssignment, User, Subject, Task } = require('../models');

// Get all recovery assignments
const getRecoveryAssignments = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === 'student') {
      whereClause.studentId = req.user.id;
    }

    const assignments = await RecoveryAssignment.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'Student', attributes: ['name', 'email'] },
        { model: Subject, attributes: ['name', 'code'] }
      ]
    });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a recovery assignment request (Student)
const createRecoveryRequest = async (req, res) => {
  try {
    const { subjectId, title, description } = req.body;
    if (!subjectId || !title || !description) {
      throw new Error('Please add all required fields');
    }

    const assignment = await RecoveryAssignment.create({
      studentId: req.user.id,
      subjectId,
      title,
      description,
      status: 'pending',
      boostCount: 2
    });

    const subject = await Subject.findByPk(subjectId);
    await Task.create({
      studentId: req.user.id,
      title: `Submit Recovery Assignment: ${title} (${subject ? subject.name : ''})`,
      dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      type: 'assignment'
    });

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

// Update assignment status (Teacher/Admin - Approve/Reject)
const updateRecoveryStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const assignment = await RecoveryAssignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.update({ status });
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
