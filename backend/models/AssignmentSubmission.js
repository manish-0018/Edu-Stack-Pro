const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
  id:           { type: DataTypes.UUID,    defaultValue: DataTypes.UUIDV4, primaryKey: true },
  assignmentId: { type: DataTypes.UUID,    allowNull: false },
  studentId:    { type: DataTypes.UUID,    allowNull: false },
  fileUrl:      { type: DataTypes.STRING,  allowNull: true  },
  submittedAt:  { type: DataTypes.DATE,    allowNull: true  },
  grade:        { type: DataTypes.INTEGER, allowNull: true  },
  feedback:     { type: DataTypes.TEXT,    allowNull: true  },
  status:       {
    type: DataTypes.ENUM('pending', 'submitted', 'graded', 'late'),
    defaultValue: 'pending'
  }
});

module.exports = AssignmentSubmission;
