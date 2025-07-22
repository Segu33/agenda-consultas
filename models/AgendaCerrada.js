const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');

const AgendaCerrada = sequelize.define('AgendaCerrada', {
  id_agenda_cerrada: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_medico: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_agenda: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  motivo: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  timestamps: false
});

module.exports = AgendaCerrada;
