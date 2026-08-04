const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  collegeId: {
    type: DataTypes.UUID,
    allowNull: true
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
  activeOtp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  activeOtpExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  activeQrToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isSessionActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Class;
