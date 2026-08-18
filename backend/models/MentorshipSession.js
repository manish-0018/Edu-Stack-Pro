const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MentorshipSession = sequelize.define('MentorshipSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  mentorId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  sessionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  actionItems: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'follow-up'),
    defaultValue: 'completed',
    allowNull: false
  },
  collegeId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

module.exports = MentorshipSession;
