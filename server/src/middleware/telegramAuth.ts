import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';

const BOT_TOKEN = process.env.BOT_TOKEN!;

interface TelegramWebAppUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

// Валидация initData из Telegram WebApp
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
export function validateInitData(initData: string): TelegramWebAppUser | null {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;

  // Удаляем hash из параметров для проверки
  params.delete('hash');

  // Сортируем ключи и формируем data-check-string
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest();

  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (computedHash !== hash) return null;

  const userJson = params.get('user');
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as TelegramWebAppUser;
  } catch {
    return null;
  }
}

// Middleware: извлекает и валидирует пользователя из initData в заголовке
export function telegramAuth(req: Request, res: Response, next: NextFunction) {
  const initData = req.headers['x-telegram-init-data'] as string | undefined;
  if (!initData) {
    res.status(401).json({ error: 'Missing x-telegram-init-data header' });
    return;
  }

  const user = validateInitData(initData);
  if (!user) {
    res.status(403).json({ error: 'Invalid initData signature' });
    return;
  }

  (req as any).telegramUser = user;
  next();
}
