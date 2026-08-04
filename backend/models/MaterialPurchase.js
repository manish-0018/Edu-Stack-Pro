const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MaterialPurchase = sequelize.define('MaterialPurchase', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  materialId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  purchaseType: {
    type: DataTypes.STRING,
    defaultValue: 'lifetime' // lifetime, rental
  },
  leaseExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = MaterialPurchase;
