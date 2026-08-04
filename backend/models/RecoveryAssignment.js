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
  },
  absenceReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  absenceDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  hoursMissed: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: true
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reviewFeedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  feePaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  sessionType: {
    type: DataTypes.STRING,
    defaultValue: 'Condonation Petition',
    allowNull: false
  },
  remedialStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
    allowNull: false
  }
});

module.exports = RecoveryAssignment;
