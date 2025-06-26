const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/', pacienteController.getAll);
router.get('/agregar', pacienteController.renderAgregarPaciente);
router.get('/buscar', pacienteController.buscarPorDni); // ✅ nueva ruta AJAX
router.get('/:id', pacienteController.getById);
router.post('/', pacienteController.create);
router.put('/:id', pacienteController.update);
router.delete('/:id', pacienteController.delete);

module.exports = router;
