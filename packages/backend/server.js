require('dotenv').config();
const express = require('express');
const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.static(__dirname));

// Inizializza la coda per l'evento
const analyticsQueue = new Queue('analytics-queue', { 
    connection: new IORedis({ host: process.env.REDIS_HOST || '127.0.0.1', port: 6379, maxRetriesPerRequest: null }) 
});

app.post('/api/v1/analytics/events', async (req, res) => {
    try {
        const { name, userAgent } = req.body;
        const browser = userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : 'Other';
        
        // Aggiunge il job alla coda
        await analyticsQueue.add('track-event', { name, browser });
        
        // Notifica il client in tempo reale
        io.emit('event-queued', { browser });
        
        res.status(202).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Errore interno' });
    }
});

server.listen(3000, () => console.log('🚀 Server attivo su porta 3000'));