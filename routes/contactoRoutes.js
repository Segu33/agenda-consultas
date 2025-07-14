const express = require('express');
const router = express.Router();

// Controlador
const contactoController = require('../controllers/contactoController');

// Ruta para mostrar el formulario de contacto
router.get('/contacto', contactoController.formularioContacto);

// Ruta opcional para procesar el envío (si tenés un form)
router.post('/contacto', contactoController.enviarMensaje);

router.post('/', contactoController.enviarMensaje);

module.exports = router;
