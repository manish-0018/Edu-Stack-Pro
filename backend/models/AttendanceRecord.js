const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Represents an individual student's presence/absence in a specific Attendance session
const AttendanceRecord = sequelize.define('AttendanceRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  attendanceId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'excused', 'duty'),
    defaultValue: 'present'
  }
});

module.exports = AttendanceRecord;
