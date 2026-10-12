import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

/**
 * Webhook endpoint for acquiring payment notifications.
 * The bank sends POST requests here when payment status changes.
 * TODO: Add signature verification when integrating a specific acquiring provider.
 */
router.post('/webhook', async (req, res) => {
  const { paymentId, status, orderId } = req.body;

  if (!paymentId || !status) {
    res.status(400).json({ error: 'Missing required fields: paymentId, status' });
    return;
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { paymentId },
          ...(orderId ? [{ id: Number(orderId) }] : []),
        ],
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    let paymentStatus: string;
    switch (status) {
      case 'paid':
      case 'success':
      case 'confirmed':
        paymentStatus = 'paid';
        break;
      case 'refunded':
      case 'reversed':
        paymentStatus = 'refunded';
        break;
      case 'cancelled':
      case 'rejected':
        paymentStatus = 'pending';
        break;
      default:
        paymentStatus = status;
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus, paymentId },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Payment webhook error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
