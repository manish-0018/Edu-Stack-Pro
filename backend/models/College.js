const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const College = sequelize.define('College', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  secretKey: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'EDU-STAFF-KEY-2026'
  }
});

module.exports = College;
