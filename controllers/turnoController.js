// turnoController.js
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente'); // Asegurate que exista el modelo

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
exports.confirmarTurno = async (req, res) => {
    const { fecha, hora, medico_id, sucursal_id, dni, nombre, telefono, sobreturno } = req.body;
  
    try {
      // Buscar paciente por DNI
      let paciente = await Paciente.findOne({ where: { dni } });
  
      if (!paciente) {
        const [nombreCompleto, ...resto] = nombre.trim().split(' ');
        const apellido = resto.join(' ') || '---';
  
        paciente = await Paciente.create({
          nombre: nombreCompleto,
          apellido,
          dni,
          telefono,
          email: `${dni}@temporal.com` // temporal si no hay email
        });
      }
  
      // Crear el turno (o sobreturno)
      await Turno.create({
        id_paciente: paciente.id_paciente,
        id_medico: medico_id,
        id_sucursal: sucursal_id,
        fecha,
        hora,
        estado: sobreturno === 'on' ? 'reservado' : 'reservado' // usar solo estados válidos por ahora
      });
  
      res.redirect('/programacion?success=1');
    } catch (error) {
      console.error('Error al confirmar turno:', error);
      res.redirect('/programacion?error=1');
    }
  };
  

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newTurno = await Turno.create(req.body);
    res.status(201).json(newTurno);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear turno' });
  }
};
exports.create = async (req, res) => {
    // ...validaciones y creación del turno
    res.redirect('/turnos');
  };
  const Sobreturno = require('../models/Sobreturno'); // Asegurate de importar el modelo

exports.crearSobreturno = async (req, res) => {
  const { fecha, hora, medico_id, paciente_dni } = req.body;

  try {
    // Buscar o crear paciente
    let paciente = await Paciente.findOne({ where: { dni: paciente_dni } });

    if (!paciente) {
      return res.status(404).send('Paciente no encontrado. Debe estar registrado previamente.');
    }

    // Crear sobreturno
    await Sobreturno.create({
      fecha,
      hora,
      id_medico: medico_id,
      id_paciente: paciente.id_paciente
    });

    res.redirect('/programacion?success=sobreturno');
  } catch (error) {
    console.error('Error al crear sobreturno:', error);
    res.redirect('/programacion?error=sobreturno');
  }
};

