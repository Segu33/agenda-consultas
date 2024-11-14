const Paciente = require('../models/Paciente');

exports.getAll = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll();
        res.json(pacientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pacientes' });
    }
};

exports.getById = async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);
        paciente ? res.json(paciente) : res.status(404).json({ error: 'Paciente no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el paciente' });
    }
};

exports.create = async (req, res) => {
    try {
        const newPaciente = await Paciente.create(req.body);
        res.status(201).json(newPaciente);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear paciente' });
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await Paciente.update(req.body, {
            where: { id_paciente: req.params.id }
        });
        updated[0] ? res.json({ success: 'Paciente actualizado' }) : res.status(404).json({ error: 'Paciente no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el paciente' });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await Paciente.destroy({ where: { id_paciente: req.params.id } });
        deleted ? res.json({ success: 'Paciente eliminado' }) : res.status(404).json({ error: 'Paciente no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el paciente' });
    }
};
