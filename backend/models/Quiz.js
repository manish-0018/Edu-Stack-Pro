const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Quiz = sequelize.define('Quiz', {
  id:               { type: DataTypes.UUID,    defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title:            { type: DataTypes.STRING,  allowNull: false },
  subjectId:        { type: DataTypes.UUID,    allowNull: false },
  teacherId:        { type: DataTypes.UUID,    allowNull: false },
  timeLimitMinutes: { type: DataTypes.INTEGER, defaultValue: 30 },
  dueDate:          { type: DataTypes.DATE,    allowNull: true },
  totalMarks:       { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive:         { type: DataTypes.BOOLEAN, defaultValue: true },
  isLocked:         { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Quiz;
