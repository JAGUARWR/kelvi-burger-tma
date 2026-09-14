import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';

const BOT_TOKEN = process.env.BOT_TOKEN!;

interface TelegramWebAppUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export function validateInitData(initData: string): TelegramWebAppUser | null {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;

  params.delete('hash');

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

export async function telegramAuthWithUser(req: Request, res: Response, next: NextFunction) {
  const initData = req.headers['x-telegram-init-data'] as string | undefined;
  if (!initData) {
    res.status(401).json({ error: 'Missing x-telegram-init-data header' });
    return;
  }

  const tgUser = validateInitData(initData);
  if (!tgUser) {
    res.status(403).json({ error: 'Invalid initData signature' });
    return;
  }

  try {
    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(tgUser.id) },
      update: {
        firstName: tgUser.first_name ?? undefined,
        username: tgUser.username ?? undefined,
      },
      create: {
        telegramId: BigInt(tgUser.id),
        firstName: tgUser.first_name ?? null,
        username: tgUser.username ?? null,
      },
    });

    (req as any).user = user;
    next();
  } catch (err) {
    console.error('Auth upsert error:', err);
    res.status(500).json({ error: 'Auth failed' });
  }
}
