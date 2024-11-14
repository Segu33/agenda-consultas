const Paciente = require('../models/Paciente');

// Obtener todos los pacientes
exports.getAll = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll();
        res.render('pacientes/lista-pacientes', { title: 'Lista de Pacientes', pacientes });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pacientes' });
    }
};

// Obtener un paciente por ID
exports.getById = async (req, res) => {
    try {
        console.log("ID recibido:", req.params.id); // Verifica el ID que llega
        const paciente = await Paciente.findByPk(req.params.id);
        paciente ? res.json(paciente) : res.status(404).json({ error: 'Paciente no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el paciente' });
    }
};


// Renderizar formulario para agregar un nuevo paciente
exports.renderAgregarPaciente = (req, res) => {
    res.render('pacientes/agregar-paciente', { title: 'Agregar Paciente' });
};

// Crear un nuevo paciente
// controllers/pacienteController.js

exports.create = async (req, res) => {
    try {
        const { nombre, apellido, dni, email, telefono, obra_social } = req.body;

        // Verifica que todos los campos requeridos estén presentes
        if (!nombre || !apellido || !dni || !email) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }

        console.log("Datos recibidos:", req.body); // Verifica los datos recibidos

        const newPaciente = await Paciente.create(req.body);
        res.status(201).json(newPaciente);
    } catch (error) {
        console.error('Error al crear paciente:', error); // Log para detalles del error
        res.status(500).json({ error: 'Error al crear paciente' });
    }
};



// Actualizar un paciente
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

// Eliminar un paciente
exports.delete = async (req, res) => {
    try {
        const deleted = await Paciente.destroy({ where: { id_paciente: req.params.id } });
        deleted ? res.json({ success: 'Paciente eliminado' }) : res.status(404).json({ error: 'Paciente no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el paciente' });
    }
};
