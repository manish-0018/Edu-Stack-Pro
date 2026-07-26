const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StudyGroupParticipant = sequelize.define('StudyGroupParticipant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studyGroupId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

module.exports = StudyGroupParticipant;
