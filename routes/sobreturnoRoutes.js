const express = require('express');
const router = express.Router();
const sobreturnoController = require('../controllers/sobreturnoController');

router.get('/', sobreturnoController.getAll);
router.get('/:id', sobreturnoController.getById);
router.post('/', sobreturnoController.create);
router.put('/:id', sobreturnoController.update);
router.delete('/:id', sobreturnoController.delete);

module.exports = router;
