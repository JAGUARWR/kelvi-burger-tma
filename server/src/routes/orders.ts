import { Router } from 'express';
import { telegramAuth, telegramAuthWithUser } from '../middleware/telegramAuth.js';
import { createOrder, getUserOrders, completeOrder, updateOrderStatus } from '../services/orderService.js';
import type { Request } from 'express';
import type { CreateOrderBody, OrderStatus } from '../types.js';

const router = Router();

const VALID_STATUSES: OrderStatus[] = ['new', 'cooking', 'ready', 'completed', 'cancelled'];

// POST /api/orders — создание заказа
router.post('/', telegramAuthWithUser, async (req: Request, res) => {
  const body = req.body as CreateOrderBody;

  if (!body.items?.length) {
    res.status(400).json({ error: 'Cart is empty' });
    return;
  }

  if (!['takeaway', 'dine_in'].includes(body.orderType)) {
    res.status(400).json({ error: 'Invalid orderType' });
    return;
  }

  const user = (req as any).user;

  try {
    const order = await createOrder(user, body);
    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders/my — заказы текущего пользователя
router.get('/my', telegramAuthWithUser, async (req: Request, res) => {
  const user = (req as any).user;

  try {
    const orders = await getUserOrders(user.id);
    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PATCH /api/orders/:id/status — смена статуса (с начислением бонусов при completed)
router.patch('/:id/status', telegramAuth, async (req: Request, res) => {
  const orderId = Number(req.params.id);
  if (Number.isNaN(orderId)) {
    res.status(400).json({ error: 'Invalid order id' });
    return;
  }

  const { status } = req.body as { status: OrderStatus };
  if (!status || !VALID_STATUSES.includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  try {
    if (status === 'completed') {
      const { order, newBalance } = await completeOrder(orderId);
      res.json({
        id: order.id,
        status: order.status,
        bonusEarned: order.bonusEarned,
        newBalance,
      });
    } else {
      const order = await updateOrderStatus(orderId, status);
      res.json({ id: order.id, status: order.status });
    }
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
