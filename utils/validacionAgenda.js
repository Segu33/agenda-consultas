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

/**
 * Genera los turnos de una agenda médica para una semana a partir de la fecha indicada
 * @param {Agenda} agenda - Instancia de Agenda con los datos de planificación
 * @param {string} fechaInicio - Fecha base en formato YYYY-MM-DD
 * @returns {Promise<Array>} - Lista de turnos generados
 */
async function generarTurnosSemana(agenda, fechaInicio) {
  const fechaBase = new Date(fechaInicio);
  const fechaFinSemana = agregarDias(fechaBase, 6); // semana completa

  // Buscar fechas bloqueadas (AgendaCerrada)
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

  const fechasBloqueadas = new Set();
  for (const bloqueo of bloqueos) {
    const inicio = new Date(bloqueo.fecha_inicio);
    const fin = new Date(bloqueo.fecha_fin);
    for (let f = new Date(inicio); f <= fin; f.setDate(f.getDate() + 1)) {
      fechasBloqueadas.add(f.toISOString().split('T')[0]);
    }
  }

  const diasHabilitados = agenda.dias.split(',').map(d => d.trim().toLowerCase());
  const turnosGenerados = [];

  // Validar y formatear horas
  const horaInicio = formatearHora(agenda.hora_inicio);
  const horaFin = formatearHora(agenda.hora_fin);
  const duracion = agenda.duracion_turno;

  for (const diaTexto of diasHabilitados) {
    const diaNumero = diasSemanaMap[diaTexto];
    if (diaNumero === undefined) continue;

    const fechaTurno = agregarDias(fechaBase, (7 + diaNumero - fechaBase.getDay()) % 7);
    const fechaISO = fechaTurno.toISOString().split('T')[0];

    if (fechasBloqueadas.has(fechaISO)) continue;

    let horaActual = horaInicio;
    while (horaMenor(horaActual, horaFin)) {
      const turno = {
        id_agenda: agenda.id_agenda,
        fecha: fechaISO,
        hora: horaActual,
        estado: 'Libre',
        ocupado: false,
        es_sobreturno: false,
        id_medico: agenda.id_medico,
        id_sucursal: agenda.id_sucursal,
        duracion_turno: duracion
      };

      // Verificar si ya existe el turno
      const existe = await Turno.findOne({
        where: {
          id_agenda: turno.id_agenda,
          fecha: turno.fecha,
          hora: turno.hora
        }
      });

      if (!existe) {
        await Turno.create(turno);
        turnosGenerados.push(turno);
      }

      horaActual = sumarMinutos(horaActual, duracion);
    }
  }

  return turnosGenerados;
}

// =======================
// Funciones auxiliares
// =======================

function agregarDias(fecha, dias) {
  const nueva = new Date(fecha);
  nueva.setDate(nueva.getDate() + dias);
  return nueva;
}

function formatearHora(hora) {
  if (typeof hora === 'string') return hora.slice(0, 5);
  if (hora instanceof Date) return hora.toTimeString().slice(0, 5);
  return '00:00';
}

function sumarMinutos(horaStr, minutos) {
  const [h, m] = horaStr.split(':').map(Number);
  const nueva = new Date(0, 0, 0, h, m + minutos);
  return nueva.toTimeString().slice(0, 5);
}

function horaMenor(h1, h2) {
  const [h1h, h1m] = h1.split(':').map(Number);
  const [h2h, h2m] = h2.split(':').map(Number);
  return h1h < h2h || (h1h === h2h && h1m < h2m);
}

module.exports = generarTurnosSemana;
