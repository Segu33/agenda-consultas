// controllers/horarioController.js
exports.vistaHorarios = (req, res) => {
  const horarios = [
    {
      titulo: 'Horarios Guardia Clínica Médica',
      detalle: `Lunes a Sábados: 8h a 22h<br>Domingos y feriados: 10h a 22h<br><strong>Por orden de llegada (sin turno)</strong>`
    },
    {
      titulo: 'Horarios Enfermería',
      detalle: `Lunes a Sábados: 8h a 22h<br>Domingos y feriados: 10h a 22h<br><strong>Por orden de llegada (sin turno)</strong>`
    },
    {
      titulo: 'Horarios Laboratorio',
      detalle: `<strong>Extracciones de sangre</strong><br>Lunes a Viernes: 7h a 10h<br>Sábados: 8h a 10h<br><strong>Por orden de llegada (sin turno)</strong>`
    },
    {
      titulo: 'Horarios Mamografía y Radiología',
      detalle: `Lunes a Viernes: 8h a 20h<br><strong>Por orden de llegada (sin turno)</strong>`
    }
  ];

  res.render('horarios', { title: 'Horarios', horarios });
};

