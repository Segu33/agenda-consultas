const Medico = require('../models/Medico');
const Especialidad = require('../models/Especialidad'); // Importa tu modelo de Especialidad si existe

exports.getAll = async (req, res) => {
    try {
        const medicos = await Medico.findAll();
        res.render('medicos/list', { medicos });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener médicos' });
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id, {
            include: Especialidad // Suponiendo que tienes una relación entre Médico y Especialidad
        });

        if (!medico) {
            return res.status(404).send('Médico no encontrado');
        }

        const especialidades = await Especialidad.findAll(); // Obtener todas las especialidades para el selector

        res.render('medicos/edit', { medico, especialidades });
    } catch (error) {
        console.error('Error al cargar el médico para edición:', error);
        res.status(500).send('Error al cargar el médico para edición');
    }
};


exports.create = async (req, res) => {
    try {
        const newMedico = await Medico.create(req.body);
        res.redirect('/medicos');
    } catch (error) {
        res.status(500).json({ error: 'Error al crear médico' });
    }
};

exports.update = async (req, res) => {
    try {
        req.body.estado = req.body.estado === 'true'; // Convertir a booleano
        const updated = await Medico.update(req.body, {
            where: { id_medico: req.params.id }
        });
        updated[0] ? res.redirect('/medicos') : res.status(404).send('Médico no encontrado');
    } catch (error) {
        res.status(500).send('Error al actualizar el médico');
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await Medico.destroy({ where: { id_medico: req.params.id } });
        deleted ? res.redirect('/medicos') : res.status(404).send('Médico no encontrado');
    } catch (error) {
        res.status(500).send('Error al eliminar el médico');
    }
};

exports.asignarEspecialidad = async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id);
        const especialidad = await Especialidad.findByPk(req.body.especialidadId);
        if (medico && especialidad) {
            await medico.addEspecialidad(especialidad); // Usando la relación N:N
            res.redirect(`/medicos/edit/${req.params.id}`);
        } else {
            res.status(404).send('Médico o Especialidad no encontrada');
        }
    } catch (error) {
        res.status(500).send('Error al asignar especialidad');
    }
};

exports.eliminarEspecialidad = async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id);
        const especialidad = await Especialidad.findByPk(req.body.especialidadId);
        if (medico && especialidad) {
            await medico.removeEspecialidad(especialidad); // Usando la relación N:N
            res.redirect(`/medicos/edit/${req.params.id}`);
        } else {
            res.status(404).send('Médico o Especialidad no encontrada');
        }
    } catch (error) {
        res.status(500).send('Error al eliminar especialidad');
    }
};
