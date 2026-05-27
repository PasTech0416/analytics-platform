require('dotenv').config();
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Configura il client Prisma
const prisma = new PrismaClient({ 
    adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })) 
});

// Avvia il worker in ascolto
const worker = new Worker('analytics-queue', async (job) => {
    await prisma.event.create({ 
        data: {
            name: job.data.name,
            url: "https://app.dev",
            browser: job.data.browser,
            os: "Windows"
        } 
    });
    console.log(`✅ Evento salvato: ${job.data.browser}`);
}, { 
    connection: new IORedis({ host: process.env.REDIS_HOST || '127.0.0.1', port: 6379, maxRetriesPerRequest: null }) 
});

console.log('👷 Worker in ascolto...');