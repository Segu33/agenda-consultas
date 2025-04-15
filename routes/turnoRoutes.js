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
const { body } = require('express-validator');

router.post('/',
  [
    body('fecha').isISO8601().withMessage('Fecha inválida'),
    body('hora').matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('Hora inválida'),
    body('id_medico').isInt().withMessage('ID de médico inválido'),
    body('id_paciente').isInt().withMessage('ID de paciente inválido'),
    body('id_sucursal').isInt().withMessage('ID de sucursal inválido')
  ],
  turnoController.create
);
