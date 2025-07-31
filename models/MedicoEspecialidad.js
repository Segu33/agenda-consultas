const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');

const MedicoEspecialidad = sequelize.define('MedicoEspecialidad', {
  id_medico: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_especialidad: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  matricula: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'medico_especialidad',
  timestamps: false
});

module.exports = MedicoEspecialidad;
