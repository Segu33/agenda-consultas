const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');

const ObraSocial = sequelize.define('ObraSocial', {
  id_obra_social: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'obras_sociales',
  timestamps: false
});

module.exports = ObraSocial;
