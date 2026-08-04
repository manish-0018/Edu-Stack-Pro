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
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 20.3533
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 85.8266
  },
  midSemStartDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  midSemEndDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  isMidSemAdmitCardEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  endSemStartDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  endSemEndDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  isEndSemAdmitCardEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = College;
