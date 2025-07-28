const { Agenda, AgendaCerrada, Medico, Sucursal } = require('../models');
const { validationResult } = require('express-validator');
const moment = require('moment');

// Crear una nueva agenda
async function createAgenda(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      id_medico,
      id_sucursal,
      nombre,
      duracion_turno,
      dia_semana,
      hora_inicio,
      hora_fin,
      fecha_fin,
    } = req.body;

    const newAgenda = await Agenda.create({
      id_medico,
      id_sucursal,
      nombre,
      duracion_turno,
      dias: dia_semana,
      hora_inicio,
      hora_fin,
      fecha_fin,
    });

    res.status(201).json(newAgenda);
  } catch (error) {
    console.error('Error al crear la agenda:', error);
    res.status(500).json({ error: 'Error al crear la agenda' });
  }
}

// Mostrar formulario para crear agenda
async function mostrarFormularioCrear(req, res) {
  try {
    const medicos = await Medico.findAll();
    const sucursales = await Sucursal.findAll();
    res.render('agendas/crear', { medicos, sucursales });
  } catch (error) {
    console.error('Error al cargar datos para formulario:', error);
    res.render('agendas/crear', {
      error: 'Error al cargar los datos',
      medicos: [],
      sucursales: [],
    });
  }
}

// Bloquear una agenda
async function bloquearAgenda(req, res) {
  try {
    const { id_agenda, fecha_inicio, fecha_fin, motivo } = req.body;

    const bloqueo = await AgendaCerrada.create({
      id_agenda,
      fecha_inicio,
      fecha_fin,
      motivo,
    });

    res.status(201).json(bloqueo);
  } catch (error) {
    console.error('Error al bloquear la agenda:', error);
    res.status(500).json({ error: 'Error al bloquear la agenda' });
  }
}

// Obtener horarios disponibles
async function getAvailableTimes(req, res) {
  try {
    const { medico_id, fecha } = req.query;

    const agenda = await Agenda.findOne({ where: { id_medico: medico_id } });

    if (!agenda) {
      return res.status(404).json({ error: 'No se encontró la agenda del médico' });
    }

    const horariosEjemplo = [
      { id_turno: 1, hora: '08:00' },
      { id_turno: 2, hora: '08:30' },
      { id_turno: 3, hora: '09:00' },
    ];

    res.json(horariosEjemplo);
  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    res.status(500).json({ error: 'Error al obtener horarios disponibles' });
  }
}

// Mostrar calendario con agendas
async function mostrarCalendarioAgendas(req, res) {
  try {
    const agendas = await Agenda.findAll({
      include: [Medico, Sucursal],
    });

    const diasMap = {
      lunes: 1,
      martes: 2,
      miércoles: 3,
      jueves: 4,
      viernes: 5,
      sábado: 6,
      domingo: 0,
    };

    const eventos = [];

    agendas.forEach((agenda) => {
      const dias = agenda.dias.split(',').map((d) => d.trim());

      dias.forEach((dia) => {
        const dow = diasMap[dia];
        if (dow === undefined) return;

        const horaInicio = moment(agenda.hora_inicio, 'HH:mm:ss').format('HH:mm:ss');
        const horaFin = moment(agenda.hora_fin, 'HH:mm:ss').format('HH:mm:ss');

        eventos.push({
          daysOfWeek: [dow],
          startTime: horaInicio,
          endTime: horaFin,
          title: `${agenda.Medico?.nombre} - ${agenda.Sucursal?.nombre}`,
          display: 'background',
          color: '#00c0ff33',
        });
      });
    });

    res.render('agendas/calendario-agendas', { title: 'Calendario de Agendas', eventos });
  } catch (error) {
    console.error('Error al mostrar el calendario:', error);
    res.status(500).send('Error al cargar el calendario');
  }
}

// ✅ Exportar todas las funciones juntas
module.exports = {
  createAgenda,
  mostrarFormularioCrear,
  bloquearAgenda,
  getAvailableTimes,
  mostrarCalendarioAgendas,
};
