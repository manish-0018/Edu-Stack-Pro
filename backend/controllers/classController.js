const { Class } = require('../models');

const getClasses = async (req, res) => {
  try {
    let whereClause = {};
    const { collegeId } = req.query;

    if (req.user && req.user.collegeId) {
      whereClause.collegeId = req.user.collegeId;
      if (req.user.course) {
        whereClause.course = req.user.course;
      }
    } else if (collegeId) {
      whereClause.collegeId = collegeId;
    }

    const classes = await Class.findAll({ where: whereClause });
    res.status(200).json(classes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createClass = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) throw new Error('Please add a class name');

    // Scope class check to the college and course
    const classExists = await Class.findOne({ 
      where: { 
        name, 
        collegeId: req.user.collegeId || null,
        course: req.user.course || null
      } 
    });
    if (classExists) throw new Error('Class already exists in this course/college');

    const newClass = await Class.create({ 
      name, 
      description,
      collegeId: req.user.collegeId || null,
      course: req.user.course || null
    });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateClass = async (req, res) => {
  try {
    const whereClause = { id: req.params.id };
    if (req.user.collegeId) whereClause.collegeId = req.user.collegeId;
    if (req.user.course) whereClause.course = req.user.course;

    const classData = await Class.findOne({ where: whereClause });
    if (!classData) throw new Error('Class not found or access denied');

    await classData.update(req.body);
    res.status(200).json(classData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    const whereClause = { id: req.params.id };
    if (req.user.collegeId) whereClause.collegeId = req.user.collegeId;
    if (req.user.course) whereClause.course = req.user.course;

    const classData = await Class.findOne({ where: whereClause });
    if (!classData) throw new Error('Class not found or access denied');

    await classData.destroy();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getClasses, createClass, updateClass, deleteClass };
