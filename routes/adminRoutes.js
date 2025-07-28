const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Ruta para generar turnos de una agenda
router.post('/generar-turnos', adminController.generarTurnosDesdeAgenda);

module.exports = router;
