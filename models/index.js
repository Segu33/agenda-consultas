const sequelize = require('sequelize');
const Medico = require('./Medico');
const Sucursal = require('./Sucursal');
const AgendaCerrada = require('./agendaCerrada');
const Turno = require('./Turno');
const Paciente = require('./Paciente');
const Sobreturno = require('./Sobreturno');
const Especialidad = require('./Especialidad');
const MedicoEspecialidad = require('./MedicoEspecialidad');

// Aquí defines las relaciones entre los modelos si es necesario
Medico.hasMany(AgendaCerrada, { foreignKey: 'id_medico' });
AgendaCerrada.belongsTo(Medico, { foreignKey: 'id_medico' });

Sucursal.hasMany(Turno, { foreignKey: 'id_sucursal' });
Turno.belongsTo(Sucursal, { foreignKey: 'id_sucursal' });

Paciente.hasMany(Turno, { foreignKey: 'id_paciente' });
Turno.belongsTo(Paciente, { foreignKey: 'id_paciente' });

// Agregar más relaciones según la estructura de tu base de datos

module.exports = {
    sequelize,
    Medico,
    Sucursal,
    AgendaCerrada,
    Turno,
    Paciente,
    Sobreturno,
    Especialidad,
    MedicoEspecialidad,
};
