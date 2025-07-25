const { validationResult } = require('express-validator');
const { Turno, Paciente, Medico, Sucursal, Agenda, AgendaCerrada } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

// Validar turno contra agenda y cierres
async function validarTurnoContraAgenda(id_medico, fecha, hora) {
  const diaSemana = moment(fecha).format('dddd').toLowerCase();

  const agendas = await Agenda.findAll({
    where: {
      id_medico,
      dias: { [Op.like]: `%${diaSemana}%` }
    }
  });

  if (!agendas || agendas.length === 0) {
    return { valido: false, motivo: 'El médico no atiende ese día' };
  }

  const agendaValida = agendas.find(agenda => hora >= agenda.hora_inicio && hora <= agenda.hora_fin);

  if (!agendaValida) {
    return { valido: false, motivo: 'La hora está fuera del horario de atención' };
  }

  const cierre = await AgendaCerrada.findOne({
    where: {
      id_medico,
      fecha
    }
  });

  if (cierre) {
    return { valido: false, motivo: 'La agenda está cerrada ese día' };
  }

  return { valido: true, agenda: agendaValida };
}

// Mostrar todos los turnos (usuarios autenticados)
exports.mostrarVistaTurnos = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [Medico, Paciente],
      order: [['fecha', 'ASC'], ['hora', 'ASC']]
    });

    res.render('turnos/lista-turnos', { turnos });
  } catch (error) {
    console.error('Error al renderizar turnos:', error);
    res.status(500).send('Error al mostrar los turnos');
  }
};

// Mostrar formulario para crear turno (solo admin)
exports.mostrarFormularioCrearTurno = async (req, res) => {
  try {
    const medicos = await Medico.findAll();
    const pacientes = await Paciente.findAll();
    const sucursales = await Sucursal.findAll();

    res.render('turnos/turnos', {
      title: 'Crear Turno',
      medicos,
      pacientes,
      sucursales,
      error: null,
      datos: {}
    });
  } catch (error) {
    console.error('Error al cargar formulario manual:', error);
    res.status(500).send('Error al mostrar formulario de turnos');
  }
};

// Crear turno (solo admin)
exports.create = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).render('turnos/turnos', {
        title: 'Crear Turno',
        medicos: await Medico.findAll(),
        pacientes: await Paciente.findAll(),
        sucursales: await Sucursal.findAll(),
        error: 'Errores de validación',
        datos: req.body
      });
    }

    const { fecha, hora, id_medico, id_paciente, id_sucursal, motivo_consulta, obra_social, sobreturno } = req.body;

    if (sobreturno !== 'on') {
      const resultadoValidacion = await validarTurnoContraAgenda(id_medico, fecha, hora);
      if (!resultadoValidacion.valido) {
        return res.status(400).render('turnos/turnos', {
          title: 'Crear Turno',
          medicos: await Medico.findAll(),
          pacientes: await Paciente.findAll(),
          sucursales: await Sucursal.findAll(),
          error: resultadoValidacion.motivo,
          datos: req.body
        });
      }

      const turnoExistente = await Turno.findOne({
        where: {
          fecha,
          hora,
          id_medico,
          es_sobreturno: false
        }
      });

      if (turnoExistente) {
        return res.redirect(`/turnos/sobreturno?fecha=${fecha}&hora=${hora}&id_medico=${id_medico}&id_paciente=${id_paciente}`);
      }
    }

    const nuevoTurno = await Turno.create({
      fecha,
      hora,
      id_medico,
      id_paciente,
      id_sucursal,
      estado: 'reservado',
      motivo_consulta,
      obra_social,
      ocupado: true,
      es_sobreturno: sobreturno === 'on',
      id_agenda: sobreturno === 'on' ? null : (await validarTurnoContraAgenda(id_medico, fecha, hora)).agenda.id_agenda
    });

    res.redirect(`/turnos/${nuevoTurno.id_turno}`);
  } catch (error) {
    console.error('Error al crear turno:', error);
    res.status(500).json({ error: 'Error al crear turno', detalle: error.message });
  }
};

// Mostrar turno (usuarios autenticados)
exports.mostrarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id, {
      include: [Medico, Paciente, Sucursal]
    });
    if (!turno) return res.status(404).send('Turno no encontrado');
    res.render('turnos/turno-generado', { turno });
  } catch (error) {
    console.error('Error al mostrar turno:', error);
    res.status(500).send('Error interno');
  }
};

// Confirmar turno desde programación rápida (usuarios autenticados)
exports.confirmarTurno = async (req, res) => {
  const { fecha, hora, medico_id, sucursal_id, dni, nombre, telefono, sobreturno } = req.body;
  try {
    let paciente = await Paciente.findOne({ where: { dni } });

    if (!paciente) {
      const [nombreCompleto, ...resto] = nombre.trim().split(' ');
      const apellido = resto.join(' ') || '---';
      paciente = await Paciente.create({
        nombre: nombreCompleto,
        apellido,
        dni,
        telefono,
        email: `${dni}@temporal.com`
      });
    }

    const turnoExistente = await Turno.findOne({
      where: {
        fecha,
        hora,
        id_medico: medico_id,
        es_sobreturno: false
      }
    });

    if (turnoExistente && sobreturno !== 'on') {
      return res.redirect(`/turnos/sobreturno?fecha=${fecha}&hora=${hora}&id_medico=${medico_id}&id_paciente=${paciente.id_paciente}`);
    }

    const turno = await Turno.create({
      id_paciente: paciente.id_paciente,
      id_medico: medico_id,
      id_sucursal: sucursal_id,
      fecha,
      hora,
      estado: 'reservado',
      ocupado: true,
      es_sobreturno: sobreturno === 'on'
    });

    res.redirect(`/turnos/${turno.id_turno}`);
  } catch (error) {
    console.error('Error al confirmar turno:', error);
    res.redirect('/programacion?error=1');
  }
};

// Actualizar turno (solo admin)
exports.update = async (req, res) => {
  try {
    const updated = await Turno.update(req.body, {
      where: { id_turno: req.params.id }
    });
    updated[0] ? res.json({ success: 'Turno actualizado' }) : res.status(404).json({ error: 'Turno no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el turno' });
  }
};

// Eliminar turno (solo admin)
exports.delete = async (req, res) => {
  try {
    const deleted = await Turno.destroy({ where: { id_turno: req.params.id } });
    deleted ? res.json({ success: 'Turno eliminado' }) : res.status(404).json({ error: 'Turno no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el turno' });
  }
};

// Obtener todos los turnos (usuarios autenticados)
exports.getAll = async (req, res) => {
  try {
    const turnos = await Turno.findAll();
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    turno ? res.json(turno) : res.status(404).json({ error: 'Turno no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el turno' });
  }
};

// Sobreturno aún no implementado
exports.crearSobreturno = async (req, res) => {
  res.send('crearSobreturno aún no implementado.');
};

// Obtener turnos libres por médico y fecha (usuarios autenticados)
exports.getAvailable = async (req, res) => {
  const { medico_id, fecha } = req.query;
  try {
    const turnosDisponibles = await Turno.findAll({
      where: {
        id_medico: medico_id,
        fecha,
        ocupado: false
      }
    });
    res.json(turnosDisponibles);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener turnos disponibles' });
  }
};

// Obtener horarios disponibles por fecha (usuarios autenticados)
exports.obtenerHorariosDisponibles = async (req, res) => {
  const { medico_id, fecha } = req.query;
  try {
    const agenda = await Agenda.findOne({ where: { id_medico: medico_id } });
    if (!agenda) return res.json([]);

    const diaSemana = new Date(fecha).getDay();
    const diasPermitidos = agenda.dias.split(',').map(d => d.trim());

    if (!diasPermitidos.includes(diaSemana.toString())) {
      return res.json([]);
    }

    const horaInicio = agenda.hora_inicio;
    const horaFin = agenda.hora_fin;
    const duracion = agenda.duracion_turno;

    const turnosTomados = await Turno.findAll({
      where: {
        id_medico: medico_id,
        fecha,
        ocupado: true
      }
    });

    const horasTomadas = turnosTomados.map(t => t.hora);

    const horariosDisponibles = generarHorarios(horaInicio, horaFin, duracion)
      .filter(hora => !horasTomadas.includes(hora));

    res.json(horariosDisponibles.map(hora => ({ hora })));
  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    res.status(500).json([]);
  }
};

// Generar array de horarios disponibles
function generarHorarios(inicio, fin, duracionMin) {
  const result = [];
  let [h, m] = inicio.split(':').map(Number);
  const [fh, fm] = fin.split(':').map(Number);

  while (h < fh || (h === fh && m < fm)) {
    const horaStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
    result.push(horaStr);
    m += duracionMin;
    if (m >= 60) {
      h += Math.floor(m / 60);
      m = m % 60;
    }
  }

  return result;
}
