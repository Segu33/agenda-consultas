// routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

// Mostrar formulario público para solicitar turno
router.get('/solicitar-turno', turnoController.mostrarFormularioPublico);

// Procesar formulario y guardar turno
router.post('/solicitar-turno', turnoController.guardarTurnoPublico);

module.exports = router;
