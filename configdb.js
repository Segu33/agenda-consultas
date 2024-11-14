const { Sequelize } = require('sequelize');

// Crear instancia de Sequelize
const sequelize = new Sequelize('agenda_consultorios', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

module.exports = sequelize;
