import { Router } from 'express';
import { telegramAuthWithUser } from '../middleware/telegramAuth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/me', telegramAuthWithUser, async (req, res) => {
  const user = (req as any).user;

  if ((user.bonusBalance === 0 || user.bonusBalance === null) && user.id) {
    const completedOrders = await prisma.order.count({
      where: { userId: user.id, status: 'completed' },
    });

    if (completedOrders === 0) {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { bonusBalance: 200 },
      });
      user.bonusBalance = updated.bonusBalance;
    }
  }

  res.json({
    user: {
      id: user.id,
      telegram_id: Number(user.telegramId),
      first_name: user.firstName,
      username: user.username,
      phone: user.phone,
      address: user.address,
      bonus_balance: user.bonusBalance,
      bonusBalance: user.bonusBalance,
    },
  });
});

export default router;
