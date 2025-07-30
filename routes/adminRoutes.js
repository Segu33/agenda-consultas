const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verificarAdmin } = require('../middlewares/roles');

// Protege todas las rutas del router admin
router.use(verificarAdmin);

router.post('/generar-turnos', adminController.generarTurnosDesdeAgenda);

module.exports = router;
