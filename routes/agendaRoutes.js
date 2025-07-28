// routes/agendaRoutes.js
const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

// Mostrar formulario para crear agenda
router.get('/crear', agendaController.mostrarFormularioCrear);

// Crear nueva agenda
router.post('/crear', agendaController.createAgenda);

// Bloquear intervalos en una agenda
router.post('/bloquear', agendaController.bloquearAgenda);

// Obtener horarios disponibles para un médico en una fecha dada
router.get('/horarios-disponibles', agendaController.getAvailableTimes);

// Mostrar calendario con las agendas
router.get('/calendario', agendaController.mostrarCalendarioAgendas);

module.exports = router;
