exports.enviarMensaje = (req, res) => {
  const { nombre, email, mensaje } = req.body;
  console.log('Mensaje recibido:', { nombre, email, mensaje });
  res.redirect('/contacto'); 
};
exports.formularioContacto = (req, res) => {
  res.render('contacto', { title: 'Contacto' });
};

exports.enviarMensaje = (req, res) => {
  const { nombre, email, mensaje } = req.body;
  console.log('Mensaje recibido:', { nombre, email, mensaje });
  
  res.redirect('/contacto');
};
