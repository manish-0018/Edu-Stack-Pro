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
  }
});

module.exports = ProjectInvite;
