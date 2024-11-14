const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');
const Medico = require('./Medico');
const Paciente = require('./Paciente');
const Sucursal = require('./Sucursal');

const Turno = sequelize.define('Turno', {
    id_turno: {
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
    },
    estado: {
        type: DataTypes.ENUM('reservado', 'confirmado', 'cancelado', 'ausente', 'presente', 'en consulta', 'atendido'),
        allowNull: false,
        defaultValue: 'reservado'
    },
    motivo_consulta: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    obra_social: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    timestamps: false
});

Turno.belongsTo(Medico, { foreignKey: 'id_medico', onDelete: 'CASCADE' });
Turno.belongsTo(Paciente, { foreignKey: 'id_paciente', onDelete: 'CASCADE' });
Turno.belongsTo(Sucursal, { foreignKey: 'id_sucursal', onDelete: 'CASCADE' });

module.exports = Turno;
