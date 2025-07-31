const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');
const Especialidad = require('../models/Especialidad');
const { verificarAdmin } = require('../middlewares/roles');

// ✅ Proteger todas las rutas
router.use(verificarAdmin);

// Lista de médicos
router.get('/', medicoController.getAll);

// Formulario para agregar médico con especialidades
router.get('/add', async (req, res) => {
  const especialidades = await Especialidad.findAll();
  res.render('medicos/add', { especialidades });
});


router.post('/create', medicoController.create);

router.get('/edit/:id', medicoController.showEditForm); 

router.post('/update/:id', medicoController.update);

router.post('/delete/:id', medicoController.delete);

router.post('/:id/asignar-especialidad', medicoController.asignarEspecialidad);

router.post('/:id/eliminar-especialidad', medicoController.eliminarEspecialidad);

router.get('/:id/especialidades', medicoController.obtenerEspecialidades);

module.exports = router;
