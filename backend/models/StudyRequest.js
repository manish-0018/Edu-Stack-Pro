const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StudyRequest = sequelize.define('StudyRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  requesterId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  tutorId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  subjectId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'completed', 'rejected'),
    defaultValue: 'pending'
  },
  scheduledTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  whiteboardData: {
    type: DataTypes.JSON,
    allowNull: true
  }
});

module.exports = StudyRequest;
