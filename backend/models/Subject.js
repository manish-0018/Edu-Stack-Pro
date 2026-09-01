const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Subject = sequelize.define('Subject', {
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
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  classId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('theory', 'lab'),
    defaultValue: 'theory',
    allowNull: false
  },
  credits: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    allowNull: false
  },
  course: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Subject;
