import { Router } from 'express';
import { telegramAuthWithUser } from '../middleware/telegramAuth.js';
import { createOrder, getUserOrders, completeOrder, updateOrderStatus } from '../services/orderService.js';
import { createOrderSchema, updateStatusSchema } from '../validators/schemas.js';
import { prisma } from '../lib/prisma.js';
import type { Request } from 'express';

const router = Router();

router.post('/', telegramAuthWithUser, async (req: Request, res, next) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }

  const user = (req as any).user;

  try {
    const order = await createOrder(user, parsed.data);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get('/my', telegramAuthWithUser, async (req: Request, res, next) => {
  const user = (req as any).user;

  try {
    const orders = await getUserOrders(user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', telegramAuthWithUser, async (req: Request, res, next) => {
  const orderId = Number(req.params.id);
  if (Number.isNaN(orderId)) {
    res.status(400).json({ error: 'Invalid order id' });
    return;
  }

  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }

  const user = (req as any).user;

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.userId !== user.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    if (parsed.data.status === 'completed') {
      const { order: updated, newBalance } = await completeOrder(orderId);
      res.json({
        id: updated.id,
        status: updated.status,
        bonusEarned: updated.bonusEarned,
        newBalance,
      });
    } else {
      const updated = await updateOrderStatus(orderId, parsed.data.status);
      res.json({ id: updated.id, status: updated.status });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
