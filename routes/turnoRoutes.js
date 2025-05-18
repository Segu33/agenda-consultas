// turnoRoutes.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

// Obtener todos los turnos
router.get('/', turnoController.getAll);

// Obtener un turno por ID
router.get('/:id', turnoController.getById);

// Obtener turnos disponibles según médico y fecha
router.get('/disponibles', turnoController.getAvailable);

// Crear un nuevo turno con validación
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

// Confirmar turno desde programación rápida
router.post('/confirmar', turnoController.confirmarTurno);

// Crear sobreturno (debes implementar la función en el controlador)
router.post('/sobreturno', turnoController.crearSobreturno);

// Actualizar un turno
router.put('/:id', turnoController.update);

// Eliminar un turno
router.delete('/:id', turnoController.delete);

module.exports = router;
