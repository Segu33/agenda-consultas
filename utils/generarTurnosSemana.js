const { Op } = require('sequelize');
const Agenda = require('../models/Agenda');
const AgendaCerrada = require('../models/AgendaCerrada');
const Turno = require('../models/Turno');

// Mapa de días de la semana
const diasSemanaMap = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miércoles: 3,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sábado: 6,
  sabado: 6
};

async function generarTurnosSemana(agenda, fechaInicio) {
  const fechaBase = new Date(fechaInicio);
  const fechaFinSemana = agregarDias(fechaBase, 6); // semana de 7 días

  // Obtener bloqueos para la semana
  const bloqueos = await AgendaCerrada.findAll({
    where: {
      id_agenda: agenda.id_agenda,
      [Op.or]: [
        {
          fecha_inicio: { [Op.lte]: fechaInicio },
          fecha_fin: { [Op.gte]: fechaInicio }
        },
        {
          fecha_inicio: { [Op.between]: [fechaInicio, fechaFinSemana] }
        },
        {
          fecha_fin: { [Op.between]: [fechaInicio, fechaFinSemana] }
        }
      ]
    }
  });

  // Crear set de fechas bloqueadas (strings YYYY-MM-DD)
  const fechasBloqueadas = new Set();
  for (const bloqueo of bloqueos) {
    const inicio = new Date(bloqueo.fecha_inicio);
    const fin = new Date(bloqueo.fecha_fin);
    for (let f = new Date(inicio); f <= fin; f.setDate(f.getDate() + 1)) {
      fechasBloqueadas.add(f.toISOString().split('T')[0]);
    }
  }

  // Obtener los días habilitados de la agenda
  const diasHabilitados = agenda.dias.split(',').map(d => d.trim().toLowerCase());

  const turnosGenerados = [];

  // Validar hora de inicio y fin
  const horaInicio = typeof agenda.hora_inicio === 'string'
    ? agenda.hora_inicio.slice(0, 5)
    : agenda.hora_inicio.toTimeString().slice(0, 5);

  const horaFin = typeof agenda.hora_fin === 'string'
    ? agenda.hora_fin.slice(0, 5)
    : agenda.hora_fin.toTimeString().slice(0, 5);

  for (const diaTexto of diasHabilitados) {
    const diaNumero = diasSemanaMap[diaTexto];
    if (diaNumero === undefined) continue;

    // Calcular la fecha del día habilitado dentro de la semana
    const fechaTurno = agregarDias(fechaBase, (7 + diaNumero - fechaBase.getDay()) % 7);
    const fechaISO = fechaTurno.toISOString().split('T')[0];

    if (fechasBloqueadas.has(fechaISO)) continue;

    const duracion = agenda.duracion_turno;
    let horaActual = horaInicio;

    while (horaActual < horaFin) {
      const turno = {
        id_agenda: agenda.id_agenda,
        fecha: fechaISO,
        hora: horaActual,
        estado: 'Libre'
      };

      turnosGenerados.push(turno);
      horaActual = sumarMinutos(horaActual, duracion);
    }
  }

  // Guardar turnos evitando duplicados
  for (const turno of turnosGenerados) {
    const existe = await Turno.findOne({
      where: {
        id_agenda: turno.id_agenda,
        fecha: turno.fecha,
        hora: turno.hora
      }
    });

    if (!existe) {
      await Turno.create(turno);
    }
  }

  return turnosGenerados;
}

// Helpers
function agregarDias(fecha, dias) {
  const nueva = new Date(fecha);
  nueva.setDate(nueva.getDate() + dias);
  return nueva;
}

function sumarMinutos(horaStr, minutos) {
  const [h, m] = horaStr.split(':').map(Number);
  const nueva = new Date(0, 0, 0, h, m + minutos);
  return nueva.toTimeString().slice(0, 5);
}

module.exports = generarTurnosSemana;
