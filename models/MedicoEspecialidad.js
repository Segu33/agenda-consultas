const { DataTypes } = require('sequelize');
const sequelize = require('../configdb');
const Medico = require('./Medico');
const Especialidad = require('./Especialidad');

const MedicoEspecialidad = sequelize.define('MedicoEspecialidad', {
    id_medico: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Medico,
            key: 'id_medico'
        }
    },
    id_especialidad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Especialidad,
            key: 'id_especialidad'
        }
    },
    matricula: {
        type: DataTypes.STRING(20),
        allowNull: true
    }
}, {
    tableName: 'medico_especialidad', // ← clave para resolver tu error
    timestamps: false
});

// Relación muchos a muchos
Medico.belongsToMany(Especialidad, {
  through: MedicoEspecialidad,
  foreignKey: 'id_medico',
  as: 'especialidades'
});

Especialidad.belongsToMany(Medico, {
  through: MedicoEspecialidad,
  foreignKey: 'id_especialidad',
  as: 'medicos'
});

module.exports = MedicoEspecialidad;
