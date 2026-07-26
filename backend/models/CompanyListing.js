const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CompanyListing = sequelize.define('CompanyListing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('internship', 'placement'),
    defaultValue: 'placement'
  },
  package: {
    type: DataTypes.STRING,
    allowNull: false
  },
  criteria: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  steps: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
});

module.exports = CompanyListing;
