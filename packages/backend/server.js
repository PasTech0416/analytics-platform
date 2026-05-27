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
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1> Analytics Server /h1>
      <p>Il sistema di tracciamento è attivo sulla porta 4000.</p>
      <p>Invia i dati POST a: <code>/api/collect</code></p>
      <hr />
      <button onclick="testEvent()">Invia Clic di Test</button>
      <script>
        function testEvent() {
          fetch('/api/collect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'button_click',
              url: window.location.href,
              timestamp: Date.now(),
              metadata: { user: 'test-admin' }
            })
          }).then(res => alert('Evento inviato alla coda!'));
        }
      </script>
    </div>
  `);
});
app.post('/api/collect', async (req, res) => {
  const { event, url, timestamp, metadata } = req.body;
  
  try {
    await eventQueue.add('track-event', { event, url, timestamp, metadata });
    return res.status(202).json({ success: true, message: 'Evento in coda' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Ingestion Server pronto sulla porta ${PORT}`));
