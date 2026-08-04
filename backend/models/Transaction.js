const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'UPI',
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'completed',
  }
});

module.exports = Transaction;
