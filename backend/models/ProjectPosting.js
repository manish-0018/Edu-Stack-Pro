const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProjectPosting = sequelize.define('ProjectPosting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  creatorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  requiredSkills: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maxTeamSize: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'open', // open, closed
  }
});

module.exports = ProjectPosting;
