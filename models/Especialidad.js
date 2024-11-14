const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');
//const Medico = require('./Medico'); // Importa el modelo Medico para definir la relación

const Especialidad = sequelize.define('Especialidad', {
    id_especialidad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    timestamps: false
});

// Define la relación muchos a muchos con Medico a través de MedicoEspecialidad
//Especialidad.belongsToMany(Medico, { through: 'MedicoEspecialidad', foreignKey: 'id_especialidad' });

module.exports = Especialidad;
