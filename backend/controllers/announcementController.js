const { Announcement, User } = require('../models');
const { Op } = require('sequelize');

// @desc Create announcement (admin only)
const createAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators are authorized to post announcements.' });
    }
    const { title, content, category, expiresAt, targetRole } = req.body;
    const ann = await Announcement.create({
      title, content,
      category: category || 'General',
      expiresAt: expiresAt || null,
      postedById: req.user.id,
      targetRole: targetRole || 'all',
      collegeId: req.user.collegeId
    });
    res.status(201).json(ann);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get announcements (pinned first, filter expired)
const getAnnouncements = async (req, res) => {
  try {
    const { category } = req.query;
    let where = {
      [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }]
    };
    if (category) where.category = category;

    // College Tenancy Isolation
    if (req.user.collegeId) {
      where.collegeId = req.user.collegeId;
    }

    // Role filter
    if (req.user.role !== 'admin') {
      where.targetRole = { [Op.in]: ['all', req.user.role] };
    }

    const announcements = await Announcement.findAll({
      where,
      include: [{ model: User, as: 'PostedBy', attributes: ['name', 'role'] }],
      order: [['isPinned', 'DESC'], ['createdAt', 'DESC']]
    });
    res.status(200).json(announcements);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Toggle pin (admin only)
const togglePin = async (req, res) => {
  try {
    const ann = await Announcement.findByPk(req.params.id);
    if (!ann) return res.status(404).json({ message: 'Announcement not found' });
    ann.isPinned = !ann.isPinned;
    await ann.save();
    res.status(200).json(ann);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Delete announcement (admin only)
const deleteAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators are authorized to delete announcements.' });
    }
    const ann = await Announcement.findByPk(req.params.id);
    if (!ann) return res.status(404).json({ message: 'Not found' });
    await ann.destroy();
    res.status(200).json({ id: req.params.id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Update announcement (admin only)
const updateAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators are authorized to update announcements.' });
    }
    const ann = await Announcement.findByPk(req.params.id);
    if (!ann) return res.status(404).json({ message: 'Not found' });
    await ann.update(req.body);
    res.status(200).json(ann);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createAnnouncement, getAnnouncements, togglePin, deleteAnnouncement, updateAnnouncement };
