const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

exports.loginForm = (req, res) => {
  res.render('login');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).send('Email o contraseña incorrectos');
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).send('Email o contraseña incorrectos');
    }

    req.session.usuario = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    };

    res.redirect('/');
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).send('Error del servidor');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
