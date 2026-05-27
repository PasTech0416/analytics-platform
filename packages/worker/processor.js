const { Worker } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null
});
const worker = new Worker('analytics-events', async job => {
  const { event, url, timestamp, metadata } = job.data;
  
  console.log(`[Worker] Elaborazione evento asincrono: "${event}" associato a URL: ${url}`);
}, { connection });

worker.on('completed', job => console.log(`Job ${job.id} completato con successo.`));
worker.on('failed', (job, err) => console.error(`Job ${job.id} fallito: ${err.message}`));
