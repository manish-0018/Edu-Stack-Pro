const { Class } = require('../models');

const getClasses = async (req, res) => {
  try {
    let whereClause = {};
    const { collegeId, course } = req.query;

    if (req.user && req.user.collegeId) {
      whereClause.collegeId = req.user.collegeId;
      if (req.user.course) {
        whereClause.course = req.user.course;
      }
    } else if (collegeId) {
      whereClause.collegeId = collegeId;
    }

    if (course) {
      whereClause.course = course;
    }

    const classes = await Class.findAll({ 
      where: whereClause,
      order: [
        ['course', 'ASC'],
        ['year', 'ASC'],
        ['section', 'ASC'],
        ['name', 'ASC']
      ]
    });
    res.status(200).json(classes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createClass = async (req, res) => {
  try {
    let { name, description, course, year, section } = req.body;

    const assignedCourse = req.user.course || course || null;
    year = year ? year.trim() : null;
    section = section ? section.trim() : null;

    // Standardize class name if year and section are provided
    if (year && section && (!name || name.trim() === year || name.trim() === '')) {
      name = `${year} - ${section}`;
    } else if (!name || !name.trim()) {
      if (year && section) {
        name = `${year} - ${section}`;
      } else if (year) {
        name = year;
      } else {
        throw new Error('Please provide class name or year and section');
      }
    }
    name = name.trim();

    const { Op } = require('sequelize');

    // Duplicate check scoped to college and course/branch
    let duplicateWhere = {
      collegeId: req.user.collegeId || null,
      course: assignedCourse
    };

    if (year && section) {
      duplicateWhere[Op.or] = [
        { name: { [Op.iLike]: name } },
        { 
          [Op.and]: [
            { year: { [Op.iLike]: year } },
            { section: { [Op.iLike]: section } }
          ]
        }
      ];
    } else {
      duplicateWhere.name = { [Op.iLike]: name };
    }

    const classExists = await Class.findOne({ where: duplicateWhere });
    if (classExists) {
      throw new Error(`Section "${name}" already exists in ${assignedCourse || 'this college'}`);
    }

    const newClass = await Class.create({ 
      name, 
      description: description ? description.trim() : null,
      collegeId: req.user.collegeId || null,
      course: assignedCourse,
      year,
      section
    });
    res.status(201).json(newClass);
  } catch (error) {
    const errMsg = error.errors && error.errors.length > 0 
      ? error.errors.map(e => e.message).join(', ') 
      : error.message;
    res.status(400).json({ message: errMsg });
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
