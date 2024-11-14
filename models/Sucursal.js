const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');

const Sucursal = sequelize.define('Sucursal', {
    id_sucursal: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            isNumeric: true
        }
    }
}, {
    timestamps: false
});

module.exports = Sucursal;
