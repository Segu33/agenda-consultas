const { AgendaCerrada, Medico, Agenda, Sucursal } = require('../models');

// Obtener todas las agendas cerradas en formato JSON
exports.getAgendaCerrada = async (req, res) => {
  try {
    const agendas = await AgendaCerrada.findAll({
      include: [
        { model: Medico, attributes: ['nombre', 'apellido'] },
        {
          model: Agenda,
          include: [
            { model: Sucursal, attributes: ['nombre'] },
            { model: Medico, attributes: ['nombre', 'apellido'] }
          ]
        }
      ]
    });
    res.status(200).json(agendas);
  } catch (error) {
    console.error('Error al obtener las agendas cerradas:', error);
    res.status(500).json({ error: 'Error al obtener las agendas cerradas' });
  }
};

// Obtener todas las agendas cerradas (uso interno para vista)
exports.getAgendaCerradaFull = async () => {
  try {
    return await AgendaCerrada.findAll({
      include: [
        { model: Medico, attributes: ['nombre', 'apellido'] },
        {
          model: Agenda,
          include: [
            { model: Sucursal, attributes: ['nombre'] },
            { model: Medico, attributes: ['nombre', 'apellido'] }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Error al obtener las agendas cerradas (full):', error);
    return [];
  }
};

// Crear nueva agenda cerrada
exports.createAgendaCerrada = async (req, res) => {
  const { id_agenda, fecha_inicio, fecha_fin, motivo } = req.body;

  if (!id_agenda || !fecha_inicio || !fecha_fin || !motivo) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    // Buscar agenda para obtener id_medico
    const agenda = await Agenda.findByPk(id_agenda);

    if (!agenda) {
      return res.status(400).send('La agenda indicada no existe');
    }

    const nuevaAgenda = await AgendaCerrada.create({
      id_agenda,
      id_medico: agenda.id_medico,  // asigno id_medico desde agenda
      fecha_inicio,
      fecha_fin,
      motivo
    });

    res.redirect('/agendas-cerradas/gestion');
  } catch (error) {
    console.error('Error al crear agenda cerrada:', error);
    res.status(500).send('Error al crear la agenda cerrada');
  }
};

// Actualizar agenda cerrada existente
exports.updateAgendaCerrada = async (req, res) => {
  const { id } = req.params;
  const { id_agenda, fecha_inicio, fecha_fin, motivo } = req.body;

  if (!id_agenda || !fecha_inicio || !fecha_fin || !motivo) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    const agenda = await AgendaCerrada.findByPk(id);
    if (!agenda) {
      return res.status(404).send('Agenda cerrada no encontrada');
    }

    await agenda.update({ id_agenda, fecha_inicio, fecha_fin, motivo });

    res.redirect('/agendas-cerradas/gestion');
  } catch (error) {
    console.error('Error al actualizar agenda cerrada:', error);
    res.status(500).send('Error al actualizar la agenda cerrada');
  }
};

// Eliminar agenda cerrada
exports.deleteAgendaCerrada = async (req, res) => {
  const { id } = req.params;

  try {
    const agenda = await AgendaCerrada.findByPk(id);
    if (!agenda) {
      return res.status(404).send('Agenda cerrada no encontrada');
    }

    await agenda.destroy();
    res.redirect('/agendas-cerradas/gestion');
  } catch (error) {
    console.error('Error al eliminar agenda cerrada:', error);
    res.status(500).send('Error al eliminar la agenda cerrada');
  }
};
