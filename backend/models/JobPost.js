const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const JobPost = sequelize.define('JobPost', {
  id:          { type: DataTypes.UUID,    defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title:       { type: DataTypes.STRING,  allowNull: false },
  company:     { type: DataTypes.STRING,  allowNull: false },
  description: { type: DataTypes.TEXT,    allowNull: false },
  location:    { type: DataTypes.STRING,  allowNull: true  },
  salary:      { type: DataTypes.STRING,  allowNull: true  },
  type:        {
    type: DataTypes.ENUM('fulltime', 'internship', 'parttime', 'contract'),
    defaultValue: 'fulltime'
  },
  postedById:  { type: DataTypes.UUID,    allowNull: false },
  deadline:    { type: DataTypes.DATE,    allowNull: true  },
  skills:      { type: DataTypes.JSON,    defaultValue: [] },
  applyLink:   { type: DataTypes.STRING,  allowNull: true  },
  isActive:    { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = JobPost;
