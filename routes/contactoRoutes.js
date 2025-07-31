const express = require('express');
const router = express.Router();

// Controlador
const contactoController = require('../controllers/contactoController');


router.get('/contacto', contactoController.formularioContacto);

router.post('/contacto', contactoController.enviarMensaje);

router.post('/', contactoController.enviarMensaje);

module.exports = router;
