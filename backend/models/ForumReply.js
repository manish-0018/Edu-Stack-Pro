const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ForumReply = sequelize.define('ForumReply', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isAnswer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = ForumReply;
