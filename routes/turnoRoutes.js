const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
const Medico = require('../models/Medico');
const Paciente = require('../models/Paciente');
const Sucursal = require('../models/Sucursal'); // ✅ Necesario para formulario manual

// Formulario público de turnos
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

// Formulario para sobreturno
router.get('/sobreturno', async (req, res) => {
  try {
    const medicos = await Medico.findAll();
    res.render('turnos/sobreturno', { medicos });
  } catch (err) {
    console.error('Error al cargar sobreturno:', err);
    res.status(500).send('Error al mostrar formulario de sobreturno');
  }
});

// Formulario de carga manual de turnos
router.get('/nuevo', async (req, res) => {
  try {
    const medicos = await Medico.findAll();
    const pacientes = await Paciente.findAll();
    const sucursales = await Sucursal.findAll();
    res.render('turnos/turnos', { medicos, pacientes, sucursales });
  } catch (err) {
    console.error('Error al cargar nuevo turno:', err);
    res.status(500).send('Error al mostrar formulario');
  }
});

// Horarios disponibles por agenda
router.get('/disponibles', turnoController.obtenerHorariosDisponibles);

// Listar todos los turnos (vista)
router.get('/', turnoController.mostrarVistaTurnos);

// API REST
router.get('/api', turnoController.getAll);
router.get('/:id', turnoController.getById);

// Crear nuevo turno
router.post(
  '/',
  [
    body('fecha').isISO8601().withMessage('Fecha inválida'),
    body('hora').matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('Hora inválida'),
    body('id_medico').isInt().withMessage('ID de médico inválido'),
    body('id_paciente').isInt().withMessage('ID de paciente inválido'),
    body('id_sucursal').isInt().withMessage('ID de sucursal inválido'),
  ],
  turnoController.create
);

// Confirmación de turno (desde programación rápida)
router.post('/confirmar', turnoController.confirmarTurno);

// Crear sobreturno
router.post('/sobreturno', turnoController.crearSobreturno);

// Editar y eliminar
router.put('/:id', turnoController.update);
router.delete('/:id', turnoController.delete);

module.exports = router;
