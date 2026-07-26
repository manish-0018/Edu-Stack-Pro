const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const QuizAttempt = sequelize.define('QuizAttempt', {
  id:               { type: DataTypes.UUID,    defaultValue: DataTypes.UUIDV4, primaryKey: true },
  quizId:           { type: DataTypes.UUID,    allowNull: false },
  studentId:        { type: DataTypes.UUID,    allowNull: false },
  answers:          { type: DataTypes.JSON,    allowNull: true }, // { questionId: selectedIndex }
  score:            { type: DataTypes.INTEGER, defaultValue: 0 },
  completedAt:      { type: DataTypes.DATE,    allowNull: true },
  timeTakenSeconds: { type: DataTypes.INTEGER, allowNull: true }
});

module.exports = QuizAttempt;
