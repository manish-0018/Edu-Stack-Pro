const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

module.exports = sequelize.define('StudyRecommendation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  studentId: { type: DataTypes.UUID, allowNull: false }, // Matches User UUID
  collegeId: { type: DataTypes.UUID, allowNull: false }, // Matches College UUID
  subjectName: { type: DataTypes.STRING, allowNull: false },
  priority: { type: DataTypes.INTEGER, defaultValue: 1 }, // 1 = High, 2 = Medium, 3 = Low
  weaknessScore: { type: DataTypes.FLOAT, allowNull: false }, // calculated average score
  reason: { type: DataTypes.STRING, allowNull: false }, // e.g. "Low recent quiz marks"
  recommendedResources: { type: DataTypes.JSON, defaultValue: [] }, // Array of resource IDs/details
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false
});
