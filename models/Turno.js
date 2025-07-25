// models/Turno.js
const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');

const Turno = sequelize.define('Turno', {
  id_turno: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'reservado'
  },
  motivo_consulta: {
    type: DataTypes.STRING,
    allowNull: true
  },
  obra_social: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ocupado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  es_sobreturno: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  duracion_turno: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'turnos',
  timestamps: false
});

module.exports = Turno;
