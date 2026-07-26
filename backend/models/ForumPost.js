const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ForumPost = sequelize.define('ForumPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tag: {
    type: DataTypes.ENUM('doubt', 'resource', 'exam-prep', 'discussion', 'announcement'),
    defaultValue: 'doubt'
  },
  isSolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  upvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = ForumPost;
