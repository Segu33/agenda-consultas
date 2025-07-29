// models/Agenda.js
const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');
const Medico = require('./Medico');

const Agenda = sequelize.define('Agenda', {
  id_agenda: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_medico: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Medico, key: 'id_medico' }
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duracion_turno: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dias: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
    esDiaValido(value) {
  const diasValidos = ['lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes', 'sábado', 'sabado', 'domingo', 'domingo'];
  const ingresados = value.split(',').map(d => d.trim().toLowerCase());

  for (let dia of ingresados) {
    if (!diasValidos.includes(dia)) {
      throw new Error(`Día inválido en la agenda: "${dia}". Solo se permiten: lunes, martes, miércoles, jueves, viernes, sábado, domingo`);
       }
      }  
     }  
    }
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  tableName: 'agendas',
  freezeTableName: true,
  timestamps: false
});

Agenda.belongsTo(Medico, { foreignKey: 'id_medico' });

module.exports = Agenda;
