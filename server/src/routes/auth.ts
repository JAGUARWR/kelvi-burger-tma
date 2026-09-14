import { Router } from 'express';
import { telegramAuthWithUser } from '../middleware/telegramAuth.js';

const router = Router();

router.get('/me', telegramAuthWithUser, (req, res) => {
  const user = (req as any).user;
  res.json({
    id: user.id,
    telegram_id: Number(user.telegramId),
    first_name: user.firstName,
    username: user.username,
    phone: user.phone,
    address: user.address,
    bonus_balance: user.bonusBalance,
  });
});

export default router;
