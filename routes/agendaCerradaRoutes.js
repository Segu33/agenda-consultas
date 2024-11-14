const express = require('express');
const router = express.Router();
const agendaCerradaController = require('../controllers/agendaCerradaController');

// Ruta para ver la agenda cerrada
router.get('/', agendaCerradaController.getAgendaCerrada);

module.exports = router;
