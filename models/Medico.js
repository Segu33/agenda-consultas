const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');
//const Especialidad = require('./Especialidad'); // Importa el modelo Especialidad para definir la relación

const Medico = sequelize.define('Medico', {
    id_medico: {
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
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        //defaultValue: true//
    }
}, {
    timestamps: true,
    createdAt: 'fecha_alta',
    updatedAt: false
});

// Define la relación muchos a muchos con Especialidad a través de MedicoEspecialidad
//Medico.belongsToMany(Especialidad, { through: 'MedicoEspecialidad', foreignKey: 'id_medico' });

module.exports = Medico;
