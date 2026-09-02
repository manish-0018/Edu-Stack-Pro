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
  course: {
    type: DataTypes.STRING,
    allowNull: true
  },
  year: {
    type: DataTypes.STRING,
    allowNull: true
  },
  section: {
    type: DataTypes.STRING,
    allowNull: true
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  isLocationLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isSessionActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activeOtp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  activeQrToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  activeOtpExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Class;
