const Medico = require('../models/Medico');
const Especialidad = require('../models/Especialidad');
const MedicoEspecialidad = require('../models/MedicoEspecialidad');

// Listar todos los médicos con sus especialidades
exports.getAll = async (req, res) => {
  try {
    const medicos = await Medico.findAll({
      include: { model: Especialidad, as: 'especialidades' }
    });
    res.render('medicos/list', { medicos });
  } catch (error) {
    console.error('Error al obtener médicos:', error);
    res.status(500).send('Error al obtener médicos');
  }
};

// Mostrar formulario de edición de un médico con sus especialidades
exports.showEditForm = async (req, res) => {
  const { id } = req.params;

  try {
    const medico = await Medico.findByPk(id, {
      include: {
        model: Especialidad,
        as: 'especialidades',
        through: { attributes: ['matricula'] }
      }
    });

    if (!medico) return res.status(404).send('Médico no encontrado');

    const especialidades = await Especialidad.findAll();

    res.render('medicos/edit', { medico, especialidades });
  } catch (error) {
    console.error('Error al cargar formulario de edición:', error);
    res.status(500).send('Error interno del servidor');
  }
};

// Crear un nuevo médico y asignar especialidad si se provee
exports.create = async (req, res) => {
  try {
    const { nombre, apellido, dni, email, telefono, estado, id_especialidad, matricula } = req.body;

    const nuevoMedico = await Medico.create({
      nombre,
      apellido,
      dni,
      email,
      telefono,
      estado: estado === '1'
    });

    if (id_especialidad && matricula) {
      const idEspecialidadArray = Array.isArray(id_especialidad) ? id_especialidad : [id_especialidad];
      const matriculaArray = Array.isArray(matricula) ? matricula : [matricula];

      if (idEspecialidadArray.length !== matriculaArray.length) {
        return res.status(400).send('Error: la cantidad de especialidades y matrículas no coincide');
      }

      for (let i = 0; i < idEspecialidadArray.length; i++) {
        await MedicoEspecialidad.create({
          id_medico: nuevoMedico.id_medico,
          id_especialidad: idEspecialidadArray[i],
          matricula: matriculaArray[i]
        });
      }
    }

    res.redirect('/medicos');
  } catch (error) {
    console.error('Error al crear médico:', error);
    res.status(500).send('Error al crear médico');
  }
};

// Actualizar un médico
exports.update = async (req, res) => {
  try {
    const { nombre, apellido, dni, email, telefono, estado, id_especialidad, matricula } = req.body;
    const id = req.params.id;

    const idEspecialidadArray = Array.isArray(id_especialidad) ? id_especialidad : [id_especialidad];
    const matriculaArray = Array.isArray(matricula) ? matricula : [matricula];

    if (idEspecialidadArray.length !== matriculaArray.length) {
      return res.status(400).send('Error: cantidad de especialidades y matrículas no coincide');
    }

    const medicoExistente = await Medico.findByPk(id);
    if (!medicoExistente) return res.status(404).send('Médico no encontrado');

    await Medico.update(
      { nombre, apellido, dni, email, telefono, estado: estado === '1' },
      { where: { id_medico: id } }
    );

    await MedicoEspecialidad.destroy({
      where: { id_medico: id }
    });

    for (let i = 0; i < idEspecialidadArray.length; i++) {
      await MedicoEspecialidad.create({
        id_medico: id,
        id_especialidad: idEspecialidadArray[i],
        matricula: matriculaArray[i]
      });
    }

    res.redirect('/medicos');
  } catch (error) {
    console.error('Error al actualizar médico:', error);
    res.status(500).send('Error al actualizar médico');
  }
};

// Eliminar un médico
exports.delete = async (req, res) => {
  try {
    const eliminado = await Medico.destroy({
      where: { id_medico: req.params.id }
    });
    if (!eliminado) return res.status(404).send('Médico no encontrado');
    res.redirect('/medicos');
  } catch (error) {
    console.error('Error al eliminar médico:', error);
    res.status(500).send('Error al eliminar médico');
  }
};

// Asignar especialidad a un médico
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

// Eliminar especialidad de un médico
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
// Obtener especialidades asociadas a un médico (usado para crear agenda)
exports.obtenerEspecialidades = async (req, res) => {
  try {
    const medico = await Medico.findByPk(req.params.id, {
      include: {
        model: Especialidad,
        as: 'especialidades', // debe coincidir con tu alias
        through: { attributes: [] }
      }
    });

    if (!medico) return res.status(404).json({ error: 'Médico no encontrado' });

    res.json(medico.especialidades); // este alias es correcto en tu caso
  } catch (error) {
    console.error('Error al obtener especialidades del médico:', error);
    res.status(500).json({ error: 'Error al obtener especialidades' });
  }
};
