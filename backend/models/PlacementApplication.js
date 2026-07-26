const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PlacementApplication = sequelize.define('PlacementApplication', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  companyListingId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('applied', 'exam_scheduled', 'interview_round', 'selected', 'rejected'),
    defaultValue: 'applied'
  },
  submissionText: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = PlacementApplication;
