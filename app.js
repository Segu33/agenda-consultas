require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./configdb');


// Configurar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


// Middleware para parsear JSON y datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de cada módulo
const medicoRoutes = require('./routes/medicoRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const turnoRoutes = require('./routes/turnoRoutes');
const sobreturnoRoutes = require('./routes/sobreturnoRoutes');
const agendaCerradaRoutes = require('./routes/agendaCerradaRoutes');

// Ruta de inicio que prueba la conexión a la base de datos
app.get('/', async (req, res) => {
    try {
        await sequelize.authenticate(); // Prueba la conexión
        res.render('index', { title: 'Agenda de Consultas Médicas', mensaje: 'Conexión exitosa a la base de datos' });
    } catch (error) {
        console.error('Error en la conexión:', error);
        res.render('index', { title: 'Agenda de Consultas Médicas', mensaje: 'Error al conectar a la base de datos' });
    }
});

// Configuración de las rutas
app.use('/medicos', medicoRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/turnos', turnoRoutes);
app.use('/sobreturnos', sobreturnoRoutes);
app.use('/agenda-cerrada', agendaCerradaRoutes);

// Escuchar en el puerto 3000 o el definido en .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = app;
