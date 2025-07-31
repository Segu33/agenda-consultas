const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');

const Medico = sequelize.define('Medico', {
  id_medico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING(100),
  apellido: DataTypes.STRING(100),
  dni: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: { isNumeric: true }
  },
  estado: DataTypes.BOOLEAN
}, {
  timestamps: true,
  createdAt: 'fecha_alta',
  updatedAt: false
});

module.exports = Medico;
