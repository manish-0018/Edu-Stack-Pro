const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Announcement = sequelize.define('Announcement', {
  id:         { type: DataTypes.UUID,    defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title:      { type: DataTypes.STRING,  allowNull: false },
  content:    { type: DataTypes.TEXT,    allowNull: false },
  category:   {
    type: DataTypes.ENUM('Exam', 'Holiday', 'Event', 'Fee', 'Result', 'General'),
    defaultValue: 'General'
  },
  isPinned:   { type: DataTypes.BOOLEAN, defaultValue: false },
  expiresAt:  { type: DataTypes.DATE,    allowNull: true  },
  postedById: { type: DataTypes.UUID,    allowNull: false },
  targetRole: {
    type: DataTypes.ENUM('all', 'student', 'teacher'),
    defaultValue: 'all'
  },
  collegeId: {
    type: DataTypes.UUID,
    allowNull: true
  }
});

module.exports = Announcement;
