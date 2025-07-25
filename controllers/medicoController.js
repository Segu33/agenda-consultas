const Medico = require('../models/Medico');
const Especialidad = require('../models/Especialidad');

exports.getAll = async (req, res) => {
    try {
        const medicos = await Medico.findAll({ include: Especialidad });
        res.render('medicos/list', { medicos });
    } catch (error) {
        console.error('Error al obtener médicos:', error);
        res.status(500).send('Error al obtener médicos');
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id, { include: Especialidad });
        if (!medico) return res.status(404).send('Médico no encontrado');
        const especialidades = await Especialidad.findAll();
        res.render('medicos/edit', { medico, especialidades });
    } catch (error) {
        console.error('Error al cargar el médico para edición:', error);
        res.status(500).send('Error al cargar el médico para edición');
    }
};

exports.create = async (req, res) => {
    try {
        const { nombre, apellido, dni, email, telefono, estado, id_especialidad } = req.body;
        const nuevoMedico = await Medico.create({ nombre, apellido, dni, email, telefono, estado });

        if (id_especialidad) {
            const especialidad = await Especialidad.findByPk(id_especialidad);
            if (especialidad) await nuevoMedico.addEspecialidad(especialidad);
        }

        res.redirect('/medicos');
    } catch (error) {
        console.error('Error al crear médico:', error);
        res.status(500).send('Error al crear médico');
    }
};

exports.update = async (req, res) => {
    try {
        req.body.estado = req.body.estado === 'true' || req.body.estado === true || req.body.estado === 'Activo';

        const actualizado = await Medico.update(req.body, {
            where: { id_medico: req.params.id }
        });

        if (!actualizado[0]) return res.status(404).send('Médico no encontrado');
        res.redirect('/medicos');
    } catch (error) {
        console.error('Error al actualizar médico:', error);
        res.status(500).send('Error al actualizar médico');
    }
};

exports.delete = async (req, res) => {
    try {
        const eliminado = await Medico.destroy({ where: { id_medico: req.params.id } });
        if (!eliminado) return res.status(404).send('Médico no encontrado');
        res.redirect('/medicos');
    } catch (error) {
        console.error('Error al eliminar médico:', error);
        res.status(500).send('Error al eliminar médico');
    }
};

exports.asignarEspecialidad = async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id);
        const especialidad = await Especialidad.findByPk(req.body.especialidadId);
        if (medico && especialidad) {
            await medico.addEspecialidad(especialidad);
            res.redirect(`/medicos/edit/${req.params.id}`);
        } else {
            res.status(404).send('Médico o Especialidad no encontrada');
        }
    } catch (error) {
        console.error('Error al asignar especialidad:', error);
        res.status(500).send('Error al asignar especialidad');
    }
};

exports.eliminarEspecialidad = async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id);
        const especialidad = await Especialidad.findByPk(req.body.especialidadId);
        if (medico && especialidad) {
            await medico.removeEspecialidad(especialidad);
            res.redirect(`/medicos/edit/${req.params.id}`);
        } else {
            res.status(404).send('Médico o Especialidad no encontrada');
        }
    } catch (error) {
        console.error('Error al eliminar especialidad:', error);
        res.status(500).send('Error al eliminar especialidad');
    }
};
