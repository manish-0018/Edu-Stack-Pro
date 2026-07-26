const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const JobApplication = sequelize.define('JobApplication', {
  id:          { type: DataTypes.UUID,   defaultValue: DataTypes.UUIDV4, primaryKey: true },
  jobPostId:   { type: DataTypes.UUID,   allowNull: false },
  studentId:   { type: DataTypes.UUID,   allowNull: false },
  coverLetter: { type: DataTypes.TEXT,   allowNull: true  },
  status:      {
    type: DataTypes.ENUM('applied', 'shortlisted', 'rejected', 'hired'),
    defaultValue: 'applied'
  }
});

module.exports = JobApplication;
