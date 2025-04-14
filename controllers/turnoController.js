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
    const { horarioId, dni, nombre, telefono, sobreturno } = req.body;
  
    try {
      // Buscar paciente por DNI
      let paciente = await Paciente.findOne({ where: { dni } });
  
      if (!paciente) {
        const [nombreCompleto, ...resto] = nombre.trim().split(' ');
        const apellido = resto.join(' ') || '---'; // Por si solo ponen un nombre
  
        paciente = await Paciente.create({
          nombre: nombreCompleto,
          apellido,
          dni,
          telefono,
          email: `${dni}@temporal.com` // Podés generar un email temporal si no se carga desde el form
        });
      }
  
      // Crear el turno
      await Turno.create({
        paciente_id: paciente.id_paciente,
        horario_id: horarioId, // Asegurate que exista en tu modelo de Turno
        sobreturno: sobreturno === 'on',
        estado: sobreturno === 'on' ? 'sobreturno' : 'reservado'
      });
  
      res.redirect('/programacion?success=1');
    } catch (error) {
      console.error('Error al confirmar turno:', error);
      res.redirect('/programacion?error=1');
    }
  };
  
