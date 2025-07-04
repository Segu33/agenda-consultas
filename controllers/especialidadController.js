const Especialidad = require('../models/Especialidad');

exports.listarEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll({
      order: [['nombre', 'ASC']],
    });

    // dividir en columnas de 10 para mostrar como en Maipumed
    const columnas = [[], [], []];
    especialidades.forEach((esp, i) => {
      columnas[i % 3].push(esp.nombre);
    });

    res.render('especialidades', { columnas });
  } catch (error) {
    console.error('Error al cargar especialidades:', error);
    res.status(500).send('Error interno del servidor');
  }
};
