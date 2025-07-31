const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { verificarAdmin } = require('../middlewares/roles');


router.use(verificarAdmin);


router.get('/', pacienteController.getAll);
router.get('/agregar', pacienteController.renderAgregarPaciente);
router.get('/buscar', verificarAdmin, pacienteController.buscarPorDni);
router.get('/editar/:id', pacienteController.renderEditarPaciente);
router.get('/:id', pacienteController.getById);
router.post('/', pacienteController.create);
router.put('/:id', pacienteController.update);
router.post('/eliminar/:id', pacienteController.delete);
router.get('/eliminar/:id', pacienteController.delete);

module.exports = router;