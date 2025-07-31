const sequelize = require('../configdb');

const Medico = require('./Medico');
const Paciente = require('./Paciente');
const Sucursal = require('./Sucursal');
const Agenda = require('./Agenda');
const AgendaCerrada = require('./AgendaCerrada');
const Turno = require('./Turno');
const Especialidad = require('./Especialidad');
const MedicoEspecialidad = require('./MedicoEspecialidad');
const Usuario = require('./Usuario');

// Definir asociaciones

Medico.hasMany(AgendaCerrada, { foreignKey: 'id_medico', onDelete: 'CASCADE' });
AgendaCerrada.belongsTo(Medico, { foreignKey: 'id_medico' });

Agenda.hasMany(AgendaCerrada, { foreignKey: 'id_agenda', onDelete: 'CASCADE' });
AgendaCerrada.belongsTo(Agenda, { foreignKey: 'id_agenda' });

Sucursal.hasMany(Turno, { foreignKey: 'id_sucursal' });
Turno.belongsTo(Sucursal, { foreignKey: 'id_sucursal' });

Paciente.hasMany(Turno, { foreignKey: 'id_paciente' });
Turno.belongsTo(Paciente, { foreignKey: 'id_paciente' });

Medico.hasMany(Turno, { foreignKey: 'id_medico' });
Turno.belongsTo(Medico, { foreignKey: 'id_medico' });

Agenda.hasMany(Turno, { foreignKey: 'id_agenda' });
Turno.belongsTo(Agenda, { foreignKey: 'id_agenda' });

Medico.hasMany(Agenda, { foreignKey: 'id_medico' });
Agenda.belongsTo(Medico, { foreignKey: 'id_medico' });

Sucursal.hasMany(Agenda, { foreignKey: 'id_sucursal' });
Agenda.belongsTo(Sucursal, { foreignKey: 'id_sucursal' });

// Relaciones muchos a muchos
Medico.belongsToMany(Especialidad, {
  through: MedicoEspecialidad,
  foreignKey: 'id_medico',
  otherKey: 'id_especialidad',
  as: 'especialidades'
});

Especialidad.belongsToMany(Medico, {
  through: MedicoEspecialidad,
  foreignKey: 'id_especialidad',
  otherKey: 'id_medico',
  as: 'medicos'
});

module.exports = {
  sequelize,
  Medico,
  Paciente,
  Sucursal,
  Agenda,
  AgendaCerrada,
  Turno,
  Especialidad,
  MedicoEspecialidad,
  Usuario
};
