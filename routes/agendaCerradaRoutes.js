const express = require('express');
const router = express.Router();
const agendaCerradaController = require('../controllers/agendaCerradaController');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

// Página para gestionar agendas cerradas (listado + formulario)
router.get('/gestion', async (req, res) => {
  try {
    const { Agenda, Medico } = require('../models');
    const agendas = await Agenda.findAll({
      include: [{ model: Medico }]
    });
    const agendasCerradas = await agendaCerradaController.getAgendaCerradaFull();

    res.render('agendas/agenda-cerrada', { agendas, agendasCerradas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la gestión de agendas cerradas');
  }
});

// API RESTful
router.get('/', agendaCerradaController.getAgendaCerrada);
router.post('/', agendaCerradaController.createAgendaCerrada);
router.put('/:id', agendaCerradaController.updateAgendaCerrada);
router.delete('/:id', agendaCerradaController.deleteAgendaCerrada);

module.exports = router;
