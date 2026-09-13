import { prisma } from '../lib/prisma.js';
import { notifyCooks } from '../bot/index.js';
import type { CreateOrderBody, OrderItemPayload, OrderStatus } from '../types.js';

export async function createOrder(
  userId: number,
  username: string | undefined,
  firstName: string | undefined,
  body: CreateOrderBody,
) {
  const items: OrderItemPayload[] = body.items;
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: BigInt(userId),
      username: username ?? null,
      firstName: firstName ?? null,
      items: JSON.stringify(items),
      totalPrice,
      orderType: body.orderType,
      status: 'new',
    },
  });

  // Отправляем карточку в чат поваров (асинхронно, не блокируем ответ)
  const cookMessageId = await notifyCooks(order.id, items, totalPrice, username);
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
    orderType: order.orderType,
    status: order.status,
    createdAt: order.createdAt,
  };
}

export async function getUserOrders(userId: number) {
  const orders = await prisma.order.findMany({
    where: { userId: BigInt(userId) },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map((o) => ({
    id: o.id,
    items: JSON.parse(o.items) as OrderItemPayload[],
    totalPrice: o.totalPrice,
    orderType: o.orderType,
    status: o.status as OrderStatus,
    createdAt: o.createdAt,
  }));
}

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}
