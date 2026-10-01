import express from 'express';
import rateLimit from 'express-rate-limit';
import { startBot } from './bot/index.js';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const allowedOrigins = [
  'https://kelviburger.ru',
  'https://www.kelviburger.ru',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.set('trust proxy', true);

app.use(express.json({ limit: '100kb' }));

app.use((req, res, next) => {
  const origin = req.headers.origin;

  const isAllowed = origin && (
    allowedOrigins.includes(origin) ||
    origin.endsWith('.vercel.app')
  );

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-telegram-init-data');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, try again later' },
  validate: false,
});

app.use('/api/', apiLimiter);

app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(notFoundHandler);
app.use(errorHandler);

async function main() {
  if (!process.env.BOT_TOKEN) {
    throw new Error('BOT_TOKEN is not set in environment');
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  await startBot();
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
