const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');


router.get('/', medicoController.getAll);// Obtener todos los médicos

router.get('/add', (req, res) => res.render('medicos/add'));// Renderizar el formulario para agregar médicos

router.post('/create', medicoController.create);// Crear un nuevo médico

router.get('/edit/:id', medicoController.showEditForm);// Mostrar formulario de edición de un médico

router.post('/update/:id', medicoController.update);// Actualizar un médico (mediante POST para el formulario HTML)

router.post('/delete/:id', medicoController.delete);// Eliminar un médico (mediante POST para el formulario HTML)

router.post('/:id/asignar-especialidad', medicoController.asignarEspecialidad);// Asignar especialidad a un médico

router.post('/:id/eliminar-especialidad', medicoController.eliminarEspecialidad);// Eliminar especialidad de un médico

module.exports = router;
