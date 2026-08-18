const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

module.exports = sequelize.define('PredictionLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.UUID, allowNull: false }, // Matches User UUID
  collegeId: { type: DataTypes.UUID, allowNull: true }, // Matches College UUID
  inputData: { type: DataTypes.JSON, allowNull: false },
  predictionResult: { type: DataTypes.JSON, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
});
