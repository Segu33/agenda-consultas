// middlewares/roles.js

const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.session.usuario) {
      return res.redirect('/login');
    }

    if (!rolesPermitidos.includes(req.session.usuario.rol)) {
      return res.status(403).send('Acceso denegado');
    }

    next();
  };
};

// Middleware específicos según roles
const verificarAdmin = verificarRol(['admin']);
const verificarUsuario = verificarRol(['admin', 'usuario']); // o el rol que uses

module.exports = {
  verificarRol,
  verificarAdmin,
  verificarUsuario,
};
