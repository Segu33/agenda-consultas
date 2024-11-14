const { AgendaCerrada, Medico, Sucursal } = require('../models'); // Asegúrate de importar tus modelos correctamente

// Obtener todas las agendas cerradas
exports.getAgendaCerrada = async (req, res) => {
    try {
        const agendas = await AgendaCerrada.findAll({
            include: [
                { model: Medico, attributes: ['nombre', 'apellido'] },
                { model: Sucursal, attributes: ['nombre'] }
            ]
        });
        res.status(200).json(agendas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las agendas cerradas' });
    }
};

// Crear una nueva agenda cerrada
exports.createAgendaCerrada = async (req, res) => {
    const { id_medico, fecha_inicio, fecha_fin, motivo } = req.body;

    try {
        const nuevaAgenda = await AgendaCerrada.create({
            id_medico,
            fecha_inicio,
            fecha_fin,
            motivo
        });
        res.status(201).json(nuevaAgenda);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la agenda cerrada' });
    }
};

// Actualizar una agenda cerrada
exports.updateAgendaCerrada = async (req, res) => {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin, motivo } = req.body;

    try {
        const agenda = await AgendaCerrada.findByPk(id);
        if (!agenda) {
            return res.status(404).json({ error: 'Agenda cerrada no encontrada' });
        }

        agenda.fecha_inicio = fecha_inicio;
        agenda.fecha_fin = fecha_fin;
        agenda.motivo = motivo;

        await agenda.save();
        res.status(200).json(agenda);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la agenda cerrada' });
    }
};

// Eliminar una agenda cerrada
exports.deleteAgendaCerrada = async (req, res) => {
    const { id } = req.params;

    try {
        const agenda = await AgendaCerrada.findByPk(id);
        if (!agenda) {
            return res.status(404).json({ error: 'Agenda cerrada no encontrada' });
        }

        await agenda.destroy();
        res.status(200).json({ message: 'Agenda cerrada eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la agenda cerrada' });
    }
};
