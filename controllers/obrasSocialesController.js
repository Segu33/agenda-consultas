const ObraSocial = require('../models/ObraSocial');

exports.listarObrasSociales = async (req, res) => {
  try {
    const obras = await ObraSocial.findAll({ order: [['nombre', 'ASC']] });

    const columnas = [[], [], []];
    obras.forEach((obra, i) => {
      columnas[i % 3].push(obra.nombre);
    });

    res.render('obras-sociales', { columnas });
  } catch (error) {
    console.error('Error al cargar obras sociales:', error);
    res.status(500).send('Error interno del servidor');
  }
};
