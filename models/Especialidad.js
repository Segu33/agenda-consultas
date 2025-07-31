const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');

const Especialidad = sequelize.define('Especialidad', {
  id_especialidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'especialidades',
  timestamps: false
});

module.exports = Especialidad;
