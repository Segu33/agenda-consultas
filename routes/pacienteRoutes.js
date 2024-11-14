const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/', pacienteController.getAll);// Ruta para obtener todos los pacientes

router.get('/:id', pacienteController.getById);// Ruta para obtener un paciente por ID

router.get('/agregar', pacienteController.renderAgregarPaciente);// Ruta para renderizar el formulario de agregar paciente

router.post('/', pacienteController.create);// Ruta para crear un nuevo paciente

router.put('/:id', pacienteController.update);// Ruta para actualizar un paciente

router.delete('/:id', pacienteController.delete);


module.exports = router;
