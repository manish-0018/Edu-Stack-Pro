const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Opportunity = sequelize.define('Opportunity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('hackathon', 'internship', 'full-time', 'other'),
    allowNull: false
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  postedById: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

module.exports = Opportunity;
