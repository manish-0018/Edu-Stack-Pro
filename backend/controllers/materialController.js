const { Material, Subject } = require('../models');

// Get all materials for a subject
const getMaterialsBySubject = async (req, res) => {
  try {
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
    const materials = await Material.findAll({ order: [['date', 'DESC']] });
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
