const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

module.exports = sequelize.define('MentorProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  expertise: { type: DataTypes.TEXT, allowNull: false },
  available: { type: DataTypes.BOOLEAN, defaultValue: true },
  rating: { type: DataTypes.DECIMAL(3,2), defaultValue: 0.0 },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
});
