const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Holiday = sequelize.define('Holiday', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('holiday', 'exam', 'festival', 'other'),
    defaultValue: 'holiday'
  }
});

module.exports = Holiday;
