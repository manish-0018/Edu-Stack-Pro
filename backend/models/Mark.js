const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Mark = sequelize.define('Mark', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  subjectId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  midSem: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: {
      min: 0,
      max: 20  // Theory only: max 20
    }
  },
  assignment: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: {
      min: 0,
      max: 40  // Lab practical: max 40, Theory: max 20
    }
  },
  quiz: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: {
      min: 0,
      max: 10  // Both theory and lab: max 10
    }
  }
});

module.exports = Mark;
