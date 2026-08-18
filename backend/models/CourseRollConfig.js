const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CourseRollConfig = sequelize.define('CourseRollConfig', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  course: {
    type: DataTypes.STRING,
    allowNull: false
  },
  collegeId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  startRollNo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currentRollNo: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['course', 'collegeId']
    }
  ]
});

module.exports = CourseRollConfig;
