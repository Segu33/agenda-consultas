// models/AgendaCerrada.js
const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');
const Medico = require('./Medico');
const Agenda = require('./Agenda');

const AgendaCerrada = sequelize.define('AgendaCerrada', {
  id_agenda_cerrada: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_medico: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Medico,
      key: 'id_medico'
    }
  },
  id_agenda: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Agenda,
      key: 'id_agenda'
    }
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isAfterOrEqual(value) {
        if (value < this.fecha_inicio) {
          throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio.');
        }
      }
    }
  },
  motivo: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'AgendaCerrada',
  timestamps: false
});

// Relaciones (si no las definiste aún)
Medico.hasMany(AgendaCerrada, { foreignKey: 'id_medico' });
Agenda.hasMany(AgendaCerrada, { foreignKey: 'id_agenda' });

module.exports = AgendaCerrada;
