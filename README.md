# 🚀 Analytics Platform Real-Time

Una piattaforma di analytics ad alte prestazioni progettata per la gestione asincrona di eventi in tempo reale. Il sistema garantisce massima scalabilità e resilienza sfruttando appieno i vantaggi di un'architettura *event-driven*.

## 🏗️ Architettura del Sistema

Il progetto separa nettamente la logica di ricezione dei dati da quella di elaborazione e persistenza. Questo approccio previene i colli di bottiglia e garantisce un'esperienza utente fluida e reattiva anche sotto carichi elevati.

### Stack Tecnologico
* **Backend:** Node.js, Express.js
* **Message Broker:** BullMQ & Redis (gestione code asincrone e isolamento dei processi)
* **Database:** PostgreSQL con Prisma ORM
* **Real-time:** Socket.io (comunicazione bidirezionale via WebSocket)
* **Frontend:** Tailwind CSS, Chart.js

---

## ⚙️ Workflow Tecnico

1. **Ingestion Layer:** Il server API riceve l'evento in ingresso e lo inserisce immediatamente nella coda gestita da Redis, rispondendo subito al client senza bloccare il flusso principale.
2. **Processing Layer:** Un worker dedicato e isolato preleva il job dalla coda in background, esegue le logiche necessarie e salva i dati nel database PostgreSQL tramite Prisma.
3. **Visualization Layer:** All'avvenuta elaborazione, la dashboard viene aggiornata istantaneamente tramite Socket.io, mostrando i nuovi dati in tempo reale senza richiedere il ricaricamento della pagina.

---

## 🚀 Guida all'avvio

### Prerequisiti

Assicurati di avere installati sulla tua macchina locale:
* [Node.js](https://nodejs.org/) (versione LTS consigliata)
* [Redis](https://redis.io/) (attivo e funzionante sulla porta di default `6379`)
* Un'istanza attiva di [PostgreSQL](https://www.postgresql.org/)

# Clona il repository (Sostituisci "tuo-utente" con il tuo username GitHub)
git clone [https://github.com/tuo-utente/analytics-platform.git](https://github.com/tuo-utente/analytics-platform.git)

# Entra nella directory del progetto
cd analytics-platform

# Installa le dipendenze
npm install

# Genera il client Prisma per l'ORM
npx prisma generate

Esecuzione
Per mettere in funzione l'intera piattaforma, avvia il server API e il worker di elaborazione in due terminali separati:

Terminale 1: Server API (Ingestion & Web Sockets)
node packages/backend/server.js

Terminale 2: Processore di Background (Worker delle Code)
node packages/worker/processor.js

📈 Dashboard & Visualizzazione
L'interfaccia utente offre una vista immediata e centralizzata sul flusso degli eventi. Grazie all'integrazione con Chart.js, i grafici dinamici reagiscono istantaneamente all'arrivo di ogni singolo pacchetto dati, permettendo un monitoraggio live accurato delle metriche di sistema.
