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
        allowNull: false
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
    timestamps: false
});

module.exports = Agenda;
