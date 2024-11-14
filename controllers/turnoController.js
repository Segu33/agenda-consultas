// turnoController.js
const Turno = require('../models/Turno');

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

exports.create = async (req, res) => {
    try {
        const newTurno = await Turno.create(req.body);
        res.status(201).json(newTurno);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear turno' });
    }
};

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

exports.delete = async (req, res) => {
    try {
        const deleted = await Turno.destroy({ where: { id_turno: req.params.id }});
        deleted ? res.json({ success: 'Turno eliminado' }) : res.status(404).json({ error: 'Turno no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el turno' });
    }
};

// Método para obtener turnos disponibles
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
