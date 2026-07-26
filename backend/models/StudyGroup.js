const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StudyGroup = sequelize.define('StudyGroup', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  creatorId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  subjectId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  scheduledTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  meetLink: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  },
  notesData: {
    type: DataTypes.JSON,
    allowNull: true
  }
});

module.exports = StudyGroup;
