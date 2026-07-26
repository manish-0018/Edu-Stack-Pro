const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  subjectId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contentUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  uploaderId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  price: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  itemType: {
    type: DataTypes.STRING,
    defaultValue: 'notes'
  }
});

module.exports = Material;
