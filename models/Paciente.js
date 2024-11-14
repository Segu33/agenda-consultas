const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');
const Paciente = sequelize.define('Paciente', {
    id_paciente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    dni: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            isNumeric: true
        }
    },
    obra_social: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'fecha_alta',
    updatedAt: false
});

module.exports = Paciente;
