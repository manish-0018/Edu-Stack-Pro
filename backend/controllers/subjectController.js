const { Subject, Class, User } = require('../models');

const getSubjects = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === 'teacher') {
      whereClause.teacherId = req.user.id;
    } else if (req.user.role === 'student') {
      whereClause.classId = req.user.classId;
    }

    let classWhere = {};
    if (req.user.collegeId) {
      classWhere.collegeId = req.user.collegeId;
    }

    let subjects = await Subject.findAll({
      where: whereClause,
      include: [
        { 
          model: Class, 
          where: classWhere,
          attributes: ['name'] 
        },
        { model: User, as: 'Teacher', attributes: ['name'] }
      ]
    });

    // Specific user requests
    if (req.user.name && req.user.name.toLowerCase() === 'aryan') {
      subjects = subjects.filter(s => s.name !== 'ML');
    }
    if (req.user.name && req.user.name.toLowerCase() === 'ujjwal') {
      subjects = subjects.filter(s => s.name !== 'IDS');
    }

    res.status(200).json(subjects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const { name, code, classId, teacherId, type, credits, course } = req.body;
    if (!name || !code || !classId || !teacherId) throw new Error('Please add all required fields');

    const subjectExists = await Subject.findOne({ where: { code } });
    if (subjectExists) throw new Error('Subject code already exists');

    const newSubject = await Subject.create({ 
      name, 
      code, 
      classId, 
      teacherId, 
      type: type || 'theory', 
      credits: credits !== undefined ? credits : 3,
      course: course || null
    });
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const subjectData = await Subject.findByPk(req.params.id);
    if (!subjectData) throw new Error('Subject not found');

    await subjectData.update(req.body);
    res.status(200).json(subjectData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subjectData = await Subject.findByPk(req.params.id);
    if (!subjectData) throw new Error('Subject not found');

    await subjectData.destroy();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject };
