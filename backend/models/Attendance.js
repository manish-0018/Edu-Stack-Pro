const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Represents a daily attendance session for a subject/class
const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  classId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  subjectId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  markedById: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['classId', 'subjectId', 'date']
    }
  ]
});

module.exports = Attendance;
