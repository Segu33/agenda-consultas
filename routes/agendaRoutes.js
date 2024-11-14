// routes/agendaRoutes.js
const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

router.post('/crear', agendaController.createAgenda);
router.post('/bloquear', agendaController.bloquearAgenda); // Usa el controlador de bloqueo
router.get('/horarios-disponibles', agendaController.getAvailableTimes);

module.exports = router;
