const express = require('express');
const router = express.Router();
const obrasController = require('../controllers/obrasSocialesController');

router.get('/obras-sociales', obrasController.listarObrasSociales);

module.exports = router;
