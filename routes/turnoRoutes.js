const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
const Medico = require('../models/Medico');
const Paciente = require('../models/Paciente');

// Mostrar formulario para agendar turno (vista pública)
router.get('/agendar-turno', async (req, res) => {
  try {
    const medicos = await Medico.findAll();
    const pacientes = await Paciente.findAll();
    res.render('turnos/agendar-turno', { medicos, pacientes });
  } catch (err) {
    console.error('Error al cargar agendar-turno:', err);
    res.status(500).send('Error al mostrar formulario de turnos');
  }
});

// Mostrar formulario para sobreturno
router.get('/sobreturno', async (req, res) => {
  try {
    const medicos = await Medico.findAll();
    res.render('turnos/sobreturno', { medicos });
  } catch (err) {
    console.error('Error al cargar sobreturno:', err);
    res.status(500).send('Error al mostrar formulario de sobreturno');
  }
});

// Mostrar formulario de carga manual (turnos.pug)
router.get('/nuevo', async (req, res) => {
  try {
    const medicos = await Medico.findAll();
    const pacientes = await Paciente.findAll();
    res.render('turnos/turnos', { medicos, pacientes });
  } catch (err) {
    console.error('Error al cargar nuevo turno:', err);
    res.status(500).send('Error al mostrar formulario');
  }
});


router.get('/disponibles', turnoController.obtenerHorariosDisponibles);


// Mostrar todos los turnos en vista
router.get('/', turnoController.mostrarVistaTurnos);

// API REST: obtener todos los turnos
router.get('/api', turnoController.getAll);

// Obtener turnos disponibles
router.get('/disponibles', turnoController.getAvailable);

// Obtener un turno por ID (después de las demás rutas)
router.get('/:id', turnoController.getById);

// Crear un nuevo turno con validación
router.post('/',
  [
    body('fecha').isISO8601().withMessage('Fecha inválida'),
    body('hora').matches(/^([0-1]\\d|2[0-3]):([0-5]\\d)$/).withMessage('Hora inválida'),
    body('id_medico').isInt().withMessage('ID de médico inválido'),
    body('id_paciente').isInt().withMessage('ID de paciente inválido'),
    body('id_sucursal').isInt().withMessage('ID de sucursal inválido')
  ],
  turnoController.create
);

// Confirmar turno desde programación rápida
router.post('/confirmar', turnoController.confirmarTurno);

// Crear sobreturno
router.post('/sobreturno', turnoController.crearSobreturno);

// Actualizar un turno
router.put('/:id', turnoController.update);

// Eliminar un turno
router.delete('/:id', turnoController.delete);

module.exports = router;
