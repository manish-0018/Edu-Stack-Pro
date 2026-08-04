const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StudyGuide = sequelize.define('StudyGuide', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  transcript: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
});

module.exports = StudyGuide;
