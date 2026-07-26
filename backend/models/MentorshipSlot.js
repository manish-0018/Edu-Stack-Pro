const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MentorshipSlot = sequelize.define('MentorshipSlot', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  mentorId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  menteeId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'booked', 'completed', 'cancelled'),
    defaultValue: 'open'
  },
  meetingLink: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = MentorshipSlot;
