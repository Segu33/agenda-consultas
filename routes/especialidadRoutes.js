const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/especialidadController');

router.get('/especialidades', especialidadController.listarEspecialidades);

module.exports = router;
