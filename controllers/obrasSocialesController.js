const ObraSocial = require('../models/ObraSocial');

exports.listarObrasSociales = async (req, res) => {
  try {
    const obras = await ObraSocial.findAll({ order: [['nombre', 'ASC']] });

    const total = obras.length;
    const tercio = Math.ceil(total / 3);

    const grupo1 = obras.slice(0, tercio).map(o => o.nombre);
    const grupo2 = obras.slice(tercio, 2 * tercio).map(o => o.nombre);
    const grupo3 = obras.slice(2 * tercio).map(o => o.nombre);

    res.render('obras-sociales', {
      title: 'Obras Sociales',
      grupo1,
      grupo2,
      grupo3
    });
  } catch (err) {
    console.error('Error al cargar obras sociales:', err);
    res.status(500).send('Error al cargar obras sociales');
  }
};
