const { Material, Subject, Class } = require('../models');

// Get all materials for a subject
const getMaterialsBySubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.subjectId, {
      include: [{ model: Class }]
    });
    if (!subject) throw new Error('Subject not found');
    if (req.user.collegeId && subject.Class?.collegeId !== req.user.collegeId) {
      throw new Error('Access denied. Subject belongs to another college.');
    }
    if (req.user.course && subject.Class?.course !== req.user.course) {
      throw new Error('Access denied. Subject belongs to another department.');
    }

    const materials = await Material.findAll({
      where: { subjectId: req.params.subjectId },
      order: [['date', 'DESC']]
    });
    res.status(200).json(materials);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all materials
const getAllMaterials = async (req, res) => {
  try {
    const classWhere = {};
    if (req.user.collegeId) classWhere.collegeId = req.user.collegeId;
    if (req.user.course) classWhere.course = req.user.course;

    const materials = await Material.findAll({
      include: [{
        model: Subject,
        required: true,
        include: [{ model: Class, where: classWhere, required: true, attributes: [] }]
      }],
      order: [['date', 'DESC']]
    });
    res.status(200).json(materials);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new material posting (Teacher/Admin)
const createMaterial = async (req, res) => {
  try {
    const { subjectId, title, contentUrl, date } = req.body;
    if (!subjectId || !title || !contentUrl || !date) {
      throw new Error('Please add all required fields');
    }

    const subject = await Subject.findByPk(subjectId, {
      include: [{ model: Class }]
    });
    if (!subject) throw new Error('Subject not found');
    if (req.user.collegeId && subject.Class?.collegeId !== req.user.collegeId) {
      throw new Error('Access denied. Subject belongs to another college.');
    }
    if (req.user.course && subject.Class?.course !== req.user.course) {
      throw new Error('Access denied. Subject belongs to another department.');
    }

    const material = await Material.create({
      subjectId,
      title,
      contentUrl,
      date
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMaterialsBySubject,
  getAllMaterials,
  createMaterial
};
