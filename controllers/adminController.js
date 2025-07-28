const { Agenda } = require('../models');
const generarTurnosSemana = require('../utils/generarTurnos'); // ajusta el path si es diferente

exports.generarTurnosDesdeAgenda = async (req, res) => {
  try {
    const { id_agenda, fecha_inicio } = req.body;

    if (!id_agenda || !fecha_inicio) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const agenda = await Agenda.findByPk(id_agenda);

    if (!agenda) {
      return res.status(404).json({ error: 'Agenda no encontrada' });
    }

    const turnos = await generarTurnos(agenda, fecha_inicio);

    return res.status(200).json({
      mensaje: 'Turnos generados correctamente',
      cantidad: turnos.length,
      turnos
    });
  } catch (error) {
    console.error('Error al generar turnos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
