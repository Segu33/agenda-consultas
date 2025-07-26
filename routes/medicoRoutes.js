const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');
const Especialidad = require('../models/Especialidad');

// Lista de médicos
router.get('/', medicoController.getAll);

// Formulario para agregar médico con especialidades
router.get('/add', async (req, res) => {
  const especialidades = await Especialidad.findAll();
  res.render('medicos/add', { especialidades });
});

// Crear nuevo médico
router.post('/create', medicoController.create);

// Mostrar formulario de edición
router.get('/edit/:id', medicoController.showEditForm);

// Actualizar médico
router.post('/update/:id', medicoController.update);

// Eliminar médico (usaremos GET para probar más fácil desde navegador)
router.post('/delete/:id', medicoController.delete);


// Asignar especialidad
router.post('/:id/asignar-especialidad', medicoController.asignarEspecialidad);

// Eliminar especialidad
router.post('/:id/eliminar-especialidad', medicoController.eliminarEspecialidad);

module.exports = router;
