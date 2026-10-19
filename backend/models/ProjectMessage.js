const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProjectMessage = sequelize.define('ProjectMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectPostingId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

module.exports = ProjectMessage;
