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
  }
});

module.exports = MaterialPurchase;
