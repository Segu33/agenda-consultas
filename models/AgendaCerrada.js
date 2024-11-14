const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');
const Medico = require('./Medico');

const AgendaCerrada = sequelize.define('AgendaCerrada', {
    id_agenda: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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

AgendaCerrada.belongsTo(Medico, { foreignKey: 'id_medico', onDelete: 'CASCADE' });

module.exports = AgendaCerrada;
