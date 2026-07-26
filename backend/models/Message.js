const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: true // Can be null if it's a group message
  },
  studyGroupId: {
    type: DataTypes.UUID,
    allowNull: true // If it's a group message
  },
  studyRequestId: {
    type: DataTypes.UUID,
    allowNull: true // Link to a specific 1-on-1 tutoring session
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Message;
