const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const RecoveryAssignment = sequelize.define('RecoveryAssignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
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
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'submitted', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
  },
  submissionText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  boostCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1, // Number of virtual classes to add
    allowNull: false
  }
});

module.exports = RecoveryAssignment;
