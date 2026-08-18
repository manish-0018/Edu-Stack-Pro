const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Assignment = sequelize.define('Assignment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title:       { type: DataTypes.STRING,  allowNull: false },
  description: { type: DataTypes.TEXT,    allowNull: true  },
  subjectId:   { type: DataTypes.UUID,    allowNull: false },
  teacherId:   { type: DataTypes.UUID,    allowNull: false },
  dueDate:     { type: DataTypes.DATE,    allowNull: true  },
  maxMarks:    { type: DataTypes.INTEGER, defaultValue: 100 },
  fileUrl:     { type: DataTypes.STRING,  allowNull: true  }
});

module.exports = Assignment;
