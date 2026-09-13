import { Router } from 'express';
import { telegramAuth } from '../middleware/telegramAuth.js';
import { createOrder, getUserOrders } from '../services/orderService.js';
import type { Request } from 'express';
import type { CreateOrderBody } from '../types.js';

const router = Router();

// POST /api/orders — создание заказа (авторизация через Telegram initData)
router.post('/', telegramAuth, async (req: Request, res) => {
  const body = req.body as CreateOrderBody;

  if (!body.items?.length) {
    res.status(400).json({ error: 'Cart is empty' });
    return;
  }

  if (!['takeaway', 'dine_in'].includes(body.orderType)) {
    res.status(400).json({ error: 'Invalid orderType' });
    return;
  }

  const user = (req as any).telegramUser;

  try {
    const order = await createOrder(user.id, user.username, user.first_name, body);
    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders/user/:userId — список заказов пользователя
router.get('/user/:userId', async (req: Request, res) => {
  const userId = Number(req.params.userId);
  if (Number.isNaN(userId)) {
    res.status(400).json({ error: 'Invalid userId' });
    return;
  }

  try {
    const orders = await getUserOrders(userId);
    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
