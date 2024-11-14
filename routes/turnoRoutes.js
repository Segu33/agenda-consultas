const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

router.get('/', turnoController.getAll);
router.get('/:id', turnoController.getById);
router.post('/', turnoController.create);
router.put('/:id', turnoController.update);
router.delete('/:id', turnoController.delete);

module.exports = router;
