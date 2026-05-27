const express = require('express');
const cors = require('cors');
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const app = express();
app.use(cors());
app.use(express.json());
const connection = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null
});
const eventQueue = new Queue('analytics-events', { connection });
app.post('/api/collect', async (req, res) => {
  const { event, url, timestamp, metadata } = req.body;
  
  try {
    await eventQueue.add('track-event', { event, url, timestamp, metadata });
    return res.status(202).json({ success: true, message: 'Evento preso in carico dalla coda' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server pronto sulla porta ${PORT}`));
