// controllers/agendaController.js
const Agenda = require('../models/Agenda');
const AgendaCerrada = require('../models/AgendaCerrada'); // Usa AgendaCerrada en lugar de BloqueoAgenda

// Crear una nueva agenda
exports.createAgenda = async (req, res) => {
    const { id_medico, nombre, duracion_turno, dias, hora_inicio, hora_fin } = req.body;

    try {
        const newAgenda = await Agenda.create({
            id_medico,
            nombre,
            duracion_turno,
            dias,
            hora_inicio,
            hora_fin
        });
        res.status(201).json(newAgenda);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la agenda' });
    }
};

// Bloquear horarios en una agenda (ahora usando AgendaCerrada)
exports.bloquearAgenda = async (req, res) => {
    const { id_agenda, fecha_inicio, fecha_fin, motivo } = req.body;

    try {
        const bloqueo = await AgendaCerrada.create({
            id_agenda,
            fecha_inicio,
            fecha_fin,
            motivo
        });
        res.status(201).json(bloqueo);
    } catch (error) {
        res.status(500).json({ error: 'Error al bloquear la agenda' });
    }
};

// Obtener horarios disponibles (excluye horarios bloqueados en AgendaCerrada)
exports.getAvailableTimes = async (req, res) => {
    const { medico_id, fecha } = req.query;

    try {
        // Busca la agenda correspondiente al médico
        const agenda = await Agenda.findOne({ where: { id_medico: medico_id } });
        if (!agenda) {
            return res.status(404).json({ error: 'No se encontró la agenda del médico' });
        }

        // Aquí puedes agregar la lógica para calcular los horarios disponibles, excluyendo las fechas bloqueadas en AgendaCerrada
        // Por ahora, retorna un ejemplo estático
        const horariosEjemplo = [
            { id_turno: 1, hora: '08:00' },
            { id_turno: 2, hora: '08:30' },
            { id_turno: 3, hora: '09:00' }
        ];

        res.json(horariosEjemplo);
    } catch (error) {
        console.error('Error al obtener horarios disponibles:', error);
        res.status(500).json({ error: 'Error al obtener horarios disponibles' });
    }
};
