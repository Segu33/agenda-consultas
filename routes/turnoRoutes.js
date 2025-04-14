// turnoRoutes.js
const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

router.get('/', turnoController.getAll);
router.get('/:id', turnoController.getById);
router.post('/', turnoController.create);
router.put('/:id', turnoController.update);
router.delete('/:id', turnoController.delete);

// Ruta para obtener turnos disponibles según médico y fecha
router.get('/disponibles', turnoController.getAvailable);

module.exports = router;
// Ruta para confirmar turno desde programación rápida
router.post('/confirmar', turnoController.confirmarTurno);
