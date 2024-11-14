const Medico = require('../models/Medico');

exports.getAll = async (req, res) => {
    try {
        const medicos = await Medico.findAll();
        res.json(medicos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener médicos' });
    }
};

exports.getById = async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id);
        if (medico) {
            res.json(medico);
        } else {
            res.status(404).json({ error: 'Médico no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el médico' });
    }
};

exports.create = async (req, res) => {
    try {
        const newMedico = await Medico.create(req.body);
        res.status(201).json(newMedico);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear médico' });
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await Medico.update(req.body, {
            where: { id_medico: req.params.id }
        });
        updated[0] ? res.json({ success: 'Médico actualizado' }) : res.status(404).json({ error: 'Médico no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el médico' });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await Medico.destroy({ where: { id_medico: req.params.id } });
        deleted ? res.json({ success: 'Médico eliminado' }) : res.status(404).json({ error: 'Médico no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el médico' });
    }
};
