const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const QuizQuestion = sequelize.define('QuizQuestion', {
  id:            { type: DataTypes.UUID,    defaultValue: DataTypes.UUIDV4, primaryKey: true },
  quizId:        { type: DataTypes.UUID,    allowNull: false },
  question:      { type: DataTypes.TEXT,    allowNull: false },
  options:       { type: DataTypes.JSON,    allowNull: false }, // array of 4 strings
  correctAnswer: { type: DataTypes.INTEGER, allowNull: false }, // index 0-3
  marks:         { type: DataTypes.INTEGER, defaultValue: 1 }
});

module.exports = QuizQuestion;
