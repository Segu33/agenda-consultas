const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const turnoController = require('../controllers/turnoController');
const Medico = require('../models/Medico');
const Paciente = require('../models/Paciente');
const Sucursal = require('../models/Sucursal');
const Agenda = require('../models/Agenda');
const { verificarAdmin, verificarUsuario } = require('../middlewares/roles');

// ------------------------
// Formularios públicos
// ------------------------

// Formulario público para agendar turno
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

// Formulario de sobreturno
router.get('/sobreturno', async (req, res) => {
  try {
    const medicos = await Medico.findAll();
    res.render('turnos/sobreturno', { medicos });
  } catch (err) {
    console.error('Error al cargar sobreturno:', err);
    res.status(500).send('Error al mostrar formulario de sobreturno');
  }
});

// ------------------------
// Formularios internos (requiere admin)
// ------------------------

router.get('/nuevo', verificarAdmin, async (req, res) => {
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

// ------------------------
// Consultas y vistas (requiere usuario autenticado)
// ------------------------

router.get('/', verificarUsuario, turnoController.mostrarVistaTurnos);
router.get('/:id', verificarUsuario, turnoController.mostrarTurno);

// ------------------------
// API REST
// ------------------------

router.get('/api', verificarUsuario, turnoController.getAll);
router.get('/api/:id', verificarUsuario, turnoController.getById);

// ------------------------
// Lógica de creación y confirmación
// ------------------------

// Crear turno (manual o desde público) → requiere admin
router.post(
  '/',
  verificarAdmin,
  [
    body('fecha').isISO8601().withMessage('Fecha inválida'),
    body('hora').matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('Hora inválida'),
    body('id_medico').isInt().withMessage('ID de médico inválido'),
    body('id_paciente').isInt().withMessage('ID de paciente inválido'),
    body('id_sucursal').isInt().withMessage('ID de sucursal inválido'),
  ],
  turnoController.create
);

// Confirmar turno desde pantalla de programación rápida → requiere usuario
router.post('/confirmar', verificarUsuario, turnoController.confirmarTurno);

// Crear sobreturno (requiere admin)
router.post('/sobreturno', verificarAdmin, turnoController.crearSobreturno);

// ------------------------
// Edición y eliminación (requiere admin)
// ------------------------

router.put('/:id', verificarAdmin, turnoController.update);
router.delete('/:id', verificarAdmin, turnoController.delete);

// ------------------------
// Horarios disponibles (requiere usuario)
// ------------------------

router.get('/disponibles', verificarUsuario, turnoController.obtenerHorariosDisponibles);
router.post('/generar-turnos', verificarAdmin, turnoController.generarTurnosAutomaticos);
// Formulario web para generar turnos automáticamente (admin)
router.get('/generar-turnos-web', verificarAdmin, async (req, res) => {
  try {
    const agendas = await Agenda.findAll({ include: Medico });
    res.render('turnos/form-generar-turnos', { agendas, mensaje: null, error: null });
  } catch (err) {
    console.error('Error al cargar formulario de generación:', err);
    res.status(500).send('Error al mostrar formulario de generación de turnos.');
  }
});

router.post('/generar-turnos-web', verificarAdmin, async (req, res) => {
  const { id_agenda, fecha_inicio } = req.body;
  const generarTurnosSemana = require('../utils/generarTurnos');
  try {
    const agenda = await Agenda.findByPk(id_agenda);
    if (!agenda) throw new Error('Agenda no encontrada');

    const turnos = await generarTurnosSemana(agenda, new Date(fecha_inicio));
    const agendas = await Agenda.findAll({ include: Medico });

    res.render('turnos/form-generar-turnos', {
      agendas,
      mensaje: `✅ Se generaron ${turnos.length} turnos correctamente.`,
      error: null
    });
  } catch (err) {
    console.error('Error al generar turnos:', err);
    const agendas = await Agenda.findAll({ include: Medico });
    res.render('turnos/form-generar-turnos', {
      agendas,
      mensaje: null,
      error: '❌ Error al generar turnos. Verificá los datos.'
    });
  }
});





module.exports = router;
