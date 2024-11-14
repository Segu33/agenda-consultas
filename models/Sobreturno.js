const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');
const Turno = require('./Turno');
const Medico = require('./Medico');
const Paciente = require('./Paciente');

const Sobreturno = sequelize.define('Sobreturno', {
    id_sobreturno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    timestamps: false
});

Sobreturno.belongsTo(Turno, { foreignKey: 'id_turno', onDelete: 'CASCADE' });
Sobreturno.belongsTo(Medico, { foreignKey: 'id_medico', onDelete: 'CASCADE' });
Sobreturno.belongsTo(Paciente, { foreignKey: 'id_paciente', onDelete: 'CASCADE' });

module.exports = Sobreturno;
