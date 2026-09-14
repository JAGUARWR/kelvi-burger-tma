import express from 'express';
import { startBot } from './bot/index.js';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-telegram-init-data');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function main() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  await startBot();
}

main().catch(console.error);
