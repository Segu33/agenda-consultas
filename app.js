require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./configdb');
const Medico = require('./models/Medico');
const Paciente = require('./models/Paciente');

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON y datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


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

// Ruta para renderizar la pantalla de agendamiento de turnos
app.get('/agendar-turno', async (req, res) => {
    try {
        const medicos = await Medico.findAll(); // Consulta para obtener médicos
        const pacientes = await Paciente.findAll(); // Consulta para obtener pacientes

        res.render('turnos/agendar-turno', { medicos, pacientes });
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Configuración de las rutas de cada módulo
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
