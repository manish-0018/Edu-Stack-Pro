const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BookCheckout = sequelize.define('BookCheckout', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  bookId: { type: DataTypes.UUID, allowNull: false },
  studentId: { type: DataTypes.UUID, allowNull: false },
  checkoutDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  dueDate: { type: DataTypes.DATE, allowNull: false },
  returnDate: { type: DataTypes.DATE, allowNull: true },
  status: { type: DataTypes.ENUM('active', 'returned', 'overdue'), defaultValue: 'active' }
});

module.exports = BookCheckout;
