require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session'); // ➤ Agregado para sesiones

const app = express();
const sequelize = require('./configdb');

// Modelos necesarios para inicio y agendamiento
const Medico = require('./models/Medico');
const Paciente = require('./models/Paciente');

// Rutas de módulos
const medicoRoutes = require('./routes/medicoRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const turnoRoutes = require('./routes/turnoRoutes');
const agendaCerradaRoutes = require('./routes/agendaCerradaRoutes');
const especialidadRoutes = require('./routes/especialidadRoutes.js');
const obrasSocialesRoutes = require('./routes/obrasSocialesRoutes');
const horariosRoutes = require('./routes/horariosRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const authRoutes = require('./routes/authRoutes'); // ➤ Rutas de autenticación

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON y datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ➤ Configuración de sesión
app.use(session({
    secret: 'clave-secreta-super-segura', // ⚠️ Reemplazar con un valor fuerte en producción
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true si usás HTTPS
}));

// ➤ Middleware para exponer el usuario logueado en todas las vistas
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    next();
});

// ➤ Rutas de autenticación (deben ir antes que las protegidas)
app.use(authRoutes);

// Ruta de inicio
app.get('/', async (req, res) => {
    try {
        await sequelize.authenticate(); // Prueba la conexión
        res.render('index', {
            title: 'Agenda de Consultas Médicas',
            mensaje: 'Conexión exitosa a la base de datos'
        });
    } catch (error) {
        console.error('Error en la conexión:', error);
        res.render('index', {
            title: 'Agenda de Consultas Médicas',
            mensaje: 'Error al conectar a la base de datos'
        });
    }
});

// Pantalla de agendamiento de turnos
app.get('/agendar-turno', async (req, res) => {
    try {
        const medicos = await Medico.findAll();
        const pacientes = await Paciente.findAll();

        res.render('turnos/agendar-turno', { medicos, pacientes });
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Configuración de rutas de módulos
app.use('/medicos', medicoRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/turnos', turnoRoutes);
app.use('/agenda-cerrada', agendaCerradaRoutes);
app.use('/', especialidadRoutes);
app.use('/', obrasSocialesRoutes);
app.use('/Horarios', horariosRoutes);
app.use('/', contactoRoutes);

module.exports = app;
