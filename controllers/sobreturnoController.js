const Sobreturno = require('../models/Sobreturno');

exports.getAll = async (req, res) => {
    try {
        const sobreturnos = await Sobreturno.findAll();
        res.json(sobreturnos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener sobreturnos' });
    }
};

exports.getById = async (req, res) => {
    try {
        const sobreturno = await Sobreturno.findByPk(req.params.id);
        sobreturno ? res.json(sobreturno) : res.status(404).json({ error: 'Sobreturno no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el sobreturno' });
    }
};

exports.create = async (req, res) => {
    try {
        const newSobreturno = await Sobreturno.create(req.body);
        res.status(201).json(newSobreturno);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear sobreturno' });
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await Sobreturno.update(req.body, {
            where: { id_sobreturno: req.params.id }
        });
        updated[0] ? res.json({ success: 'Sobreturno actualizado' }) : res.status(404).json({ error: 'Sobreturno no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el sobreturno' });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await Sobreturno.destroy({ where: { id_sobreturno: req.params.id } });
        deleted ? res.json({ success: 'Sobreturno eliminado' }) : res.status(404).json({ error: 'Sobreturno no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el sobreturno' });
    }
};
