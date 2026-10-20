const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProjectInvite = sequelize.define('ProjectInvite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectPostingId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  inviteeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', // pending, accepted, rejected
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'invite', // 'invite' (sent by creator) or 'application' (sent by student)
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  skills: {
    type: DataTypes.TEXT, // comma-separated or JSON list of skills applicant knows
    allowNull: true,
  },
  experienceLevel: {
    type: DataTypes.STRING, // 'Beginner', 'Intermediate', 'Advanced'
    defaultValue: 'Intermediate',
  },
  portfolioUrl: {
    type: DataTypes.STRING, // GitHub or portfolio profile/repo URL
    allowNull: true,
  },
  skillMatchScore: {
    type: DataTypes.INTEGER, // calculated synergy match percentage
    defaultValue: 0,
  }
});

module.exports = ProjectInvite;
