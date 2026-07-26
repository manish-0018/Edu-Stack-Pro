const { Confession } = require('../models');

// Get all confessions; if query includes ?collegeId=, filter by that, else global only.
const getConfessions = async (req, res) => {
  try {
    const { collegeId } = req.query;
    const whereClause = collegeId ? { collegeId } : { collegeId: null };
    const confessions = await Confession.findAll({ where: whereClause, order: [['createdAt', 'DESC']] });
    res.json(confessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch confessions' });
  }
};

const createConfession = async (req, res) => {
  try {
    const { content, collegeId } = req.body;
    const confession = await Confession.create({ content, collegeId: collegeId || null });
    res.status(201).json(confession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create confession' });
  }
};

// Simple admin delete – only allow if user.role === 'admin' (or guardian?)
const deleteConfession = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { id } = req.params;
    await Confession.destroy({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete confession' });
  }
};

module.exports = { getConfessions, createConfession, deleteConfession };
