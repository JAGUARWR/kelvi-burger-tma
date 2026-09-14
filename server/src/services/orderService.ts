import { prisma } from '../lib/prisma.js';
import { notifyCooks } from '../bot/index.js';
import type { CreateOrderBody, OrderItemPayload, OrderStatus, DbUser } from '../types.js';

export async function createOrder(user: DbUser, body: CreateOrderBody) {
  const items: OrderItemPayload[] = body.items;
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const requestedBonus = body.bonusToUse ?? 0;

  const { order, effectiveBonus, bonusEarned } = await prisma.$transaction(async (tx) => {
    const currentUser = await tx.user.findUniqueOrThrow({ where: { id: user.id } });

    const maxByPercent = Math.floor(totalPrice * 0.5);
    const effective = Math.min(requestedBonus, currentUser.bonusBalance, maxByPercent);
    const paidAmount = totalPrice - effective;
    const earned = Math.round(paidAmount * 0.05);

    const order = await tx.order.create({
      data: {
        userId: user.id,
        items: JSON.stringify(items),
        totalPrice,
        bonusUsed: effective,
        bonusEarned: earned,
        orderType: body.orderType,
        status: 'new',
      },
    });

    if (effective > 0) {
      await tx.user.update({
        where: { id: user.id },
        data: { bonusBalance: { decrement: effective } },
      });
    }

    return { order, effectiveBonus: effective, bonusEarned: earned };
  });

  const cookMessageId = await notifyCooks(
    order.id,
    items,
    totalPrice,
    user.username ?? undefined,
  );
  if (cookMessageId) {
    await prisma.order.update({
      where: { id: order.id },
      data: { cookMessageId },
    });
  }

  return {
    id: order.id,
    items,
    totalPrice,
    bonusUsed: effectiveBonus,
    bonusEarned,
    orderType: order.orderType,
    status: order.status,
    createdAt: order.createdAt,
  };
}

export async function getUserOrders(userId: number) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map((o) => ({
    id: o.id,
    items: JSON.parse(o.items) as OrderItemPayload[],
    totalPrice: o.totalPrice,
    bonusUsed: o.bonusUsed,
    bonusEarned: o.bonusEarned,
    orderType: o.orderType,
    status: o.status as OrderStatus,
    createdAt: o.createdAt,
  }));
}

export async function completeOrder(orderId: number) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: { status: 'completed' },
    });

    let newBalance = 0;
    if (order.bonusEarned > 0) {
      const user = await tx.user.update({
        where: { id: order.userId },
        data: { bonusBalance: { increment: order.bonusEarned } },
      });
      newBalance = user.bonusBalance;
    }

    return { order, newBalance };
  });
}

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}
