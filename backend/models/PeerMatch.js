const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

module.exports = sequelize.define('PeerMatch', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  studentId: { type: DataTypes.UUID, allowNull: false }, // Matches User UUID
  matchedStudentId: { type: DataTypes.UUID, allowNull: false }, // Matches User UUID
  collegeId: { type: DataTypes.UUID, allowNull: false }, // Matches College UUID
  compatibilityScore: { type: DataTypes.FLOAT, allowNull: false }, // cosine similarity percentage (0-100)
  matchReasons: { type: DataTypes.JSON, defaultValue: [] }, // Array of match reasons
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false
});
