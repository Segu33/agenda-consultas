const { Agenda, AgendaCerrada, Medico, Especialidad, Sucursal, Turno } = require('../models');
const { validationResult } = require('express-validator');
const moment = require('moment');
const generarTurnosSemana = require('../utils/generarTurnosSemana');


async function createAgenda(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      id_medico,
      id_especialidad,
      id_sucursal,
      nombre,
      duracion_turno,
      dia_semana,
      hora_inicio,
      hora_fin,
      fecha_fin
    } = req.body;

    // Crear la agenda
    const newAgenda = await Agenda.create({
      id_medico,
      id_especialidad,
      id_sucursal,
      nombre: nombre || `Agenda ${dia_semana}`,
      duracion_turno,
      dias: dia_semana,
      hora_inicio,
      hora_fin
    });

    // Generar turnos semanales desde hoy hasta la fecha_fin
    const fechaInicio = new Date(); // hoy
    const fechaLimite = new Date(fecha_fin);

    while (fechaInicio <= fechaLimite) {
      await generarTurnosSemana(newAgenda, new Date(fechaInicio));
      fechaInicio.setDate(fechaInicio.getDate() + 7); 
    }

    res.redirect('/agendas/calendario');
  } catch (error) {
    console.error('Error al crear la agenda y turnos:', error);
    res.status(500).send('Error al crear la agenda');
  }
}

// Mostrar formulario para crear agenda
async function mostrarFormularioCrear(req, res) {
  try {
    const medicos = await Medico.findAll();
    const especialidades = await Especialidad.findAll();
    const sucursales = await Sucursal.findAll();

    res.render('agendas/crear', { medicos, especialidades, sucursales });
  } catch (error) {
    console.error('Error al cargar datos para formulario:', error);
    res.render('agendas/crear', {
      error: 'Error al cargar los datos',
      medicos: [],
      especialidades: [],
      sucursales: []
    });
  }
}

// Bloquear una agenda por vacaciones o imprevistos
async function bloquearAgenda(req, res) {
  try {
    const { id_agenda, fecha_inicio, fecha_fin, motivo } = req.body;

    const bloqueo = await AgendaCerrada.create({
      id_agenda,
      fecha_inicio,
      fecha_fin,
      motivo
    });

    res.status(201).json(bloqueo);
  } catch (error) {
    console.error('Error al bloquear la agenda:', error);
    res.status(500).json({ error: 'Error al bloquear la agenda' });
  }
}

// Obtener horarios disponibles para una fecha y médico
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
      { id_turno: 3, hora: '09:00' }
    ];

    res.json(horariosEjemplo);
  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    res.status(500).json({ error: 'Error al obtener horarios disponibles' });
  }
}


async function mostrarCalendarioAgendas(req, res) {
  try {
    const { medico, especialidad } = req.query;

    // Cargar médicos y especialidades para el formulario
    const [medicos, especialidades] = await Promise.all([
      Medico.findAll(),
      Especialidad.findAll()
    ]);

    // Filtros para la búsqueda de agendas
    const whereClause = {};
    if (medico) whereClause.id_medico = medico;
    if (especialidad) whereClause.id_especialidad = especialidad;

    const agendas = await Agenda.findAll({
      where: whereClause,
      include: [
        {
          model: Medico,
          include: [{
            model: Especialidad,
            as: 'especialidades'
          }]
        },
        Sucursal
      ]
    });

    const diasMap = {
      lunes: 1,
      martes: 2,
      miércoles: 3,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sábado: 6,
      sabado: 6,
      domingo: 0
    };

    const eventos = [];

    agendas.forEach((agenda) => {
      const dias = agenda.dias.split(',').map((d) => d.trim().toLowerCase());

      dias.forEach((dia) => {
        const dow = diasMap[dia];
        if (dow === undefined) return;

        const horaInicio = moment(agenda.hora_inicio, 'HH:mm:ss').format('HH:mm:ss');
        const horaFin = moment(agenda.hora_fin, 'HH:mm:ss').format('HH:mm:ss');

        const medicoObj = agenda.Medico;
        const especialidadNombre = medicoObj?.especialidades?.[0]?.nombre || 'Sin especialidad';
        const sucursalNombre = agenda.Sucursal?.nombre || 'Sucursal no definida';

        eventos.push({
          daysOfWeek: [dow],
          startTime: horaInicio,
          endTime: horaFin,
          title: `${medicoObj?.nombre} ${medicoObj?.apellido} (${especialidadNombre}) - ${sucursalNombre}`,
          display: 'background',
          color: '#00c0ff33'
        });
      });
    });

    const hoy = moment().format('YYYY-MM-DD');

    res.render('agendas/calendario-agendas', {
      title: 'Calendario de Agendas',
      eventos,
      medicos,
      especialidades,
      medicoSeleccionado: parseInt(medico) || '',
      especialidadSeleccionada: parseInt(especialidad) || '',
      fechaActual: hoy
    });

  } catch (error) {
    console.error('Error al mostrar el calendario:', error);
    res.status(500).send('Error al cargar el calendario');
  }
}

module.exports = {
  mostrarCalendarioAgendas
};



module.exports = {
  createAgenda,
  mostrarFormularioCrear,
  bloquearAgenda,
  getAvailableTimes,
  mostrarCalendarioAgendas
};
