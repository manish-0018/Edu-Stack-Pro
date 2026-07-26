const { AlumniProfile, User } = require('../models');
const { Op } = require('sequelize');

// @desc Create or update alumni profile
const createOrUpdateProfile = async (req, res) => {
  try {
    const { graduationYear, batch, company, designation, location, linkedIn, bio, skills } = req.body;
    let profile = await AlumniProfile.findOne({ where: { userId: req.user.id } });
    if (profile) {
      await profile.update({ graduationYear, batch, company, designation, location, linkedIn, bio, skills: skills || [] });
    } else {
      profile = await AlumniProfile.create({
        userId: req.user.id, graduationYear, batch, company, designation, location, linkedIn, bio, skills: skills || []
      });
    }
    res.status(200).json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get all alumni (filterable)
const getAlumni = async (req, res) => {
  try {
    const { batch, company, skill, search } = req.query;
    let where = {};
    if (batch) where.batch = batch;
    if (company) where.company = { [Op.iLike]: `%${company}%` };

    const alumni = await AlumniProfile.findAll({
      where,
      include: [{ model: User, as: 'User', attributes: ['name', 'email', 'course'] }],
      order: [['graduationYear', 'DESC']]
    });

    let result = alumni;
    if (skill) {
      result = alumni.filter(a => (a.skills || []).some(s => s.toLowerCase().includes(skill.toLowerCase())));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.User?.name?.toLowerCase().includes(q) ||
        a.company?.toLowerCase().includes(q) ||
        a.designation?.toLowerCase().includes(q)
      );
    }

    res.status(200).json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Verify alumni (admin only)
const verifyAlumni = async (req, res) => {
  try {
    const profile = await AlumniProfile.findByPk(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    profile.isVerified = !profile.isVerified;
    await profile.save();
    res.status(200).json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get my alumni profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await AlumniProfile.findOne({ where: { userId: req.user.id } });
    res.status(200).json(profile || null);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createOrUpdateProfile, getAlumni, verifyAlumni, getMyProfile };
