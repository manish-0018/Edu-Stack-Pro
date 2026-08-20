const { Announcement, User } = require('../models');
const { Op } = require('sequelize');

// @desc Create announcement (admin/teacher)
const createAnnouncement = async (req, res) => {
  try {
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
      if (req.user.role === 'mentor') {
        // Mentors can see: 'all', 'mentor', 'student' targetted, OR anything they personally posted
        where[Op.and] = where[Op.and] || [];
        where[Op.and].push({
          [Op.or]: [
            { targetRole: { [Op.in]: ['all', 'mentor', 'student'] } },
            { postedById: req.user.id }
          ]
        });
      } else {
        where.targetRole = { [Op.in]: ['all', req.user.role] };
      }
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

// @desc Delete announcement (admin/teacher who posted)
const deleteAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.findByPk(req.params.id);
    if (!ann) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && ann.postedById !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await ann.destroy();
    res.status(200).json({ id: req.params.id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.findByPk(req.params.id);
    if (!ann) return res.status(404).json({ message: 'Not found' });
    await ann.update(req.body);
    res.status(200).json(ann);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createAnnouncement, getAnnouncements, togglePin, deleteAnnouncement, updateAnnouncement };
