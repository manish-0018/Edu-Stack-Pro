const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LibraryBook = sequelize.define('LibraryBook', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  totalCopies: { type: DataTypes.INTEGER, defaultValue: 1 },
  availableCopies: { type: DataTypes.INTEGER, defaultValue: 1 },
  ebookUrl: { type: DataTypes.STRING, allowNull: true },
  coverUrl: { type: DataTypes.STRING, allowNull: true }
});

module.exports = LibraryBook;
