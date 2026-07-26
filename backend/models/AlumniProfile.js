const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AlumniProfile = sequelize.define('AlumniProfile', {
  id:             { type: DataTypes.UUID,    defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:         { type: DataTypes.UUID,    allowNull: false, unique: true },
  graduationYear: { type: DataTypes.INTEGER, allowNull: true },
  batch:          { type: DataTypes.STRING,  allowNull: true },
  company:        { type: DataTypes.STRING,  allowNull: true },
  designation:    { type: DataTypes.STRING,  allowNull: true },
  location:       { type: DataTypes.STRING,  allowNull: true },
  linkedIn:       { type: DataTypes.STRING,  allowNull: true },
  bio:            { type: DataTypes.TEXT,    allowNull: true },
  skills:         { type: DataTypes.JSON,    defaultValue: [] },
  isVerified:     { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = AlumniProfile;
