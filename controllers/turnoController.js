const { validationResult } = require('express-validator');
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const Medico = require('../models/Medico');

// Mostrar la vista de turnos con datos completos
exports.mostrarVistaTurnos = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [Medico, Paciente],
      order: [['fecha', 'ASC'], ['hora', 'ASC']]
    });

    res.render('turnos/lista-turnos', { turnos }); // asegurate de que la vista exista
  } catch (error) {
    console.error('Error al renderizar turnos:', error);
    res.status(500).send('Error al mostrar los turnos');
  }
};


// Obtener todos los turnos (API REST)
exports.getAll = async (req, res) => {
  try {
    const turnos = await Turno.findAll();
    res.json(turnos);
  } catch (error) {
    console.error('Error en getAll:', error);
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
};

// Obtener un turno por ID
exports.getById = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    turno ? res.json(turno) : res.status(404).json({ error: 'Turno no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el turno' });
  }
};

// Crear un nuevo turno (API REST)
exports.create = async (req, res) => {
  try {
    const newTurno = await Turno.create(req.body);
    res.status(201).json(newTurno);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear turno' });
  }
};

// Actualizar un turno
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

// Eliminar un turno
exports.delete = async (req, res) => {
  try {
    const deleted = await Turno.destroy({ where: { id_turno: req.params.id } });
    deleted ? res.json({ success: 'Turno eliminado' }) : res.status(404).json({ error: 'Turno no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el turno' });
  }
};

// Obtener turnos disponibles
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

// Confirmar turno desde formulario
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

    await Turno.create({
      id_paciente: paciente.id_paciente,
      id_medico: medico_id,
      id_sucursal: sucursal_id,
      fecha,
      hora,
      estado: 'reservado',
      es_sobreturno: sobreturno === 'on'
    });

    res.redirect('/programacion?success=1');
  } catch (error) {
    console.error('Error al confirmar turno:', error);
    res.redirect('/programacion?error=1');
  }
};

// Crear sobreturno (placeholder)
exports.crearSobreturno = async (req, res) => {
  res.send('crearSobreturno aún no implementado.');
};
const { Agenda } = require('../models');
const { Op } = require('sequelize');

exports.obtenerHorariosDisponibles = async (req, res) => {
  const { medico_id, fecha } = req.query;

  try {
    const agenda = await Agenda.findOne({ where: { id_medico: medico_id } });
    if (!agenda) return res.json([]);

    const diaSemana = new Date(fecha).getDay(); // 0: domingo, 1: lunes...
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
