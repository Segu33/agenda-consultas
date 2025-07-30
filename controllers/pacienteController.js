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
        console.log("ID recibido:", req.params.id);
        const paciente = await Paciente.findByPk(req.params.id);
        paciente ? res.json(paciente) : res.status(404).json({ error: 'Paciente no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el paciente' });
    }
};

// 🔍 Buscar paciente por DNI (usado por AJAX desde sobreturno.pug)
exports.buscarPorDni = async (req, res) => {
    const { dni } = req.query;
    try {
        const paciente = await Paciente.findOne({ where: { dni } });
        if (paciente) {
            res.json({
                nombre: `${paciente.nombre} ${paciente.apellido}`,
                telefono: paciente.telefono
            });
        } else {
            res.status(404).json({});
        }
    } catch (error) {
        console.error('Error al buscar paciente por DNI:', error);
        res.status(500).json({});
    }
};

// Renderizar formulario para agregar un nuevo paciente
exports.renderAgregarPaciente = (req, res) => {
    res.render('pacientes/agregar-paciente', { title: 'Agregar Paciente' });
};

// Crear un nuevo paciente
exports.create = async (req, res) => {
    try {
        const { nombre, apellido, dni, email, telefono, obra_social } = req.body;

        if (!nombre || !apellido || !dni || !email) {
            return res.status(400).render('pacientes/agregar-paciente', {
                title: 'Agregar Paciente',
                error: 'Faltan datos obligatorios',
                datos: req.body
            });
        }

        console.log("Datos recibidos:", req.body);

        await Paciente.create(req.body);

        // Redireccionar si fue exitoso
        res.redirect('/pacientes');

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // ⚠️ DNI duplicado u otro campo único repetido
            return res.status(400).render('pacientes/agregar-paciente', {
                title: 'Agregar Paciente',
                error: 'Ya existe un paciente con ese DNI.',
                datos: req.body
            });
        }

        console.error('Error al crear paciente:', error);
        res.status(500).render('pacientes/agregar-paciente', {
            title: 'Agregar Paciente',
            error: 'Error al crear el paciente',
            datos: req.body
        });
    }
};


// Actualizar un paciente
exports.update = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).render('error', { message: 'Paciente no encontrado' });
    }

    await paciente.update(req.body);

    // Renderiza la vista de éxito
    res.render('pacientes/paciente-actualizado', {
      title: 'Paciente actualizado'
    });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).render('error', { message: 'Error al actualizar el paciente' });
  }
};



// Eliminar un paciente
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Paciente.destroy({ where: { id_paciente: id } });
    res.render('pacientes/eliminado'); // ✅ Renderiza la vista amigable
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).send('Error interno del servidor');
  }
};

// Renderizar formulario para editar un paciente
exports.renderEditarPaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);
        if (!paciente) {
            return res.status(404).send('Paciente no encontrado');
        }

        res.render('pacientes/editar-paciente', {
            title: 'Editar Paciente',
           paciente
        });
    } catch (error) {
        console.error('Error al mostrar formulario de edición:', error);
        res.status(500).send('Error del servidor');
    }
};
