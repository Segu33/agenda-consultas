const Especialidad = require('../models/Especialidad');

exports.listarEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll({ order: [['nombre', 'ASC']] });

    const total = especialidades.length;
    const tercio = Math.ceil(total / 3);

    const grupo1 = especialidades.slice(0, tercio).map(e => e.nombre);
    const grupo2 = especialidades.slice(tercio, 2 * tercio).map(e => e.nombre);
    const grupo3 = especialidades.slice(2 * tercio).map(e => e.nombre);

    res.render('especialidades', {
      title: 'Especialidades',
      grupo1,
      grupo2,
      grupo3
    });
  } catch (err) {
    console.error('Error al cargar especialidades:', err);
    res.status(500).send('Error interno');
  }
};
