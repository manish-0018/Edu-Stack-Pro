const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PrepHistory = sequelize.define('PrepHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // 'ats' or 'quiz'
    allowNull: false,
  },
  target: {
    type: DataTypes.STRING, // e.g. 'Google', 'Amazon', or 'Resume ATS Scan'
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  details: {
    type: DataTypes.TEXT, // Store feedback comments or JSON summary
    allowNull: true,
  }
});

module.exports = PrepHistory;
