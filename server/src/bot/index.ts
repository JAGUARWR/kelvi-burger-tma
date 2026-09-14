import { Bot, InlineKeyboard } from 'grammy';
import type { OrderItemPayload } from '../types.js';
import { prisma } from '../lib/prisma.js';
import { completeOrder } from '../services/orderService.js';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const COOKS_CHAT_ID = process.env.COOKS_CHAT_ID!;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://example.com';

export const bot = new Bot(BOT_TOKEN);

bot.command('start', async (ctx) => {
  await ctx.reply('Добро пожаловать в КЭЛВИ! 🍔', {
    reply_markup: {
      keyboard: [
        [{ text: '🍔 Открыть меню', web_app: { url: WEBAPP_URL } }],
      ],
      resize_keyboard: true,
    },
  });
});

function formatCookCard(orderId: number, items: OrderItemPayload[], total: number, username?: string): string {
  const lines = items.map(
    (i) => `  • ${i.name}${i.weight ? ` (${i.weight})` : ''} × ${i.quantity} — ${i.price * i.quantity} ₽`
  );
  return [
    `🔥 Новый заказ #${orderId}`,
    ...lines,
    `Итого: ${total} ₽`,
    username ? `Клиент: @${username}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function notifyCooks(
  orderId: number,
  items: OrderItemPayload[],
  total: number,
  username?: string,
): Promise<number | null> {
  const text = formatCookCard(orderId, items, total, username);
  const keyboard = new InlineKeyboard()
    .text('✅ Принять заказ', `accept_order_${orderId}`)
    .text('❌ Отклонить', `reject_order_${orderId}`);

  try {
    const msg = await bot.api.sendMessage(COOKS_CHAT_ID, text, {
      reply_markup: keyboard,
    });
    return msg.message_id;
  } catch (err) {
    console.error('Failed to notify cooks:', err);
    return null;
  }
}

async function updateCookMessage(
  messageId: number,
  orderId: number,
  status: string,
  items: OrderItemPayload[],
  total: number,
  username?: string,
  cookUsername?: string,
) {
  const emoji: Record<string, string> = {
    cooking: '👨‍🍳',
    ready: '✅',
    completed: '📦',
    cancelled: '❌',
  };
  const label: Record<string, string> = {
    cooking: 'Принят поваром',
    ready: 'Готов к выдаче',
    completed: 'Выдан',
    cancelled: 'Отклонён',
  };

  const base = formatCookCard(orderId, items, total, username);
  const cookLine = cookUsername ? `\nПовар: @${cookUsername}` : '';
  const text = `${emoji[status] || ''} Заказ #${orderId} — ${label[status] || status}${cookLine}\n\n${base}`;

  const keyboard = new InlineKeyboard();
  if (status === 'cooking') {
    keyboard.text('✅ Готов к выдаче', `ready_order_${orderId}`);
  } else if (status === 'ready') {
    keyboard.text('📦 Выдан', `completed_order_${orderId}`);
  }

  try {
    await bot.api.editMessageText(COOKS_CHAT_ID, messageId, text, {
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error('Failed to update cook message:', err);
  }
}

async function getOrderWithUser(orderId: number) {
  return prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { user: true },
  });
}

bot.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery.data;
  const cookUsername = ctx.from.username || String(ctx.from.id);

  const acceptMatch = data.match(/^accept_order_(\d+)$/);
  if (acceptMatch) {
    const orderId = Number(acceptMatch[1]);
    const order = await getOrderWithUser(orderId);

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'cooking' },
    });

    const items: OrderItemPayload[] = JSON.parse(order.items);
    if (order.cookMessageId) {
      await updateCookMessage(order.cookMessageId, orderId, 'cooking', items, order.totalPrice, order.user.username ?? undefined, cookUsername);
    }

    try {
      await bot.api.sendMessage(Number(order.user.telegramId), `👨‍🍳 Ваш заказ #${orderId} готовится!`);
    } catch (err) {
      console.error('Failed to notify client:', err);
    }

    await ctx.answerCallbackQuery({ text: `Заказ #${orderId} принят` });
    return;
  }

  const rejectMatch = data.match(/^reject_order_(\d+)$/);
  if (rejectMatch) {
    const orderId = Number(rejectMatch[1]);
    const order = await getOrderWithUser(orderId);

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
    });

    const items: OrderItemPayload[] = JSON.parse(order.items);
    if (order.cookMessageId) {
      await updateCookMessage(order.cookMessageId, orderId, 'cancelled', items, order.totalPrice, order.user.username ?? undefined, cookUsername);
    }

    try {
      await bot.api.sendMessage(Number(order.user.telegramId), `❌ К сожалению, заказ #${orderId} отклонён.`);
    } catch (err) {
      console.error('Failed to notify client:', err);
    }

    await ctx.answerCallbackQuery({ text: `Заказ #${orderId} отклонён` });
    return;
  }

  const readyMatch = data.match(/^ready_order_(\d+)$/);
  if (readyMatch) {
    const orderId = Number(readyMatch[1]);
    const order = await getOrderWithUser(orderId);

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'ready' },
    });

    const items: OrderItemPayload[] = JSON.parse(order.items);
    if (order.cookMessageId) {
      await updateCookMessage(order.cookMessageId, orderId, 'ready', items, order.totalPrice, order.user.username ?? undefined);
    }

    try {
      await bot.api.sendMessage(Number(order.user.telegramId), `✅ Ваш заказ #${orderId} готов к выдаче! Подойдите к стойке.`);
    } catch (err) {
      console.error('Failed to notify client:', err);
    }

    await ctx.answerCallbackQuery({ text: `Заказ #${orderId} готов!` });
    return;
  }

  const completedMatch = data.match(/^completed_order_(\d+)$/);
  if (completedMatch) {
    const orderId = Number(completedMatch[1]);
    const orderWithUser = await getOrderWithUser(orderId);

    const { order, newBalance } = await completeOrder(orderId);

    const items: OrderItemPayload[] = JSON.parse(order.items);
    if (order.cookMessageId) {
      await updateCookMessage(order.cookMessageId, orderId, 'completed', items, order.totalPrice, orderWithUser.user.username ?? undefined);
    }

    if (order.bonusEarned > 0) {
      try {
        await bot.api.sendMessage(
          Number(orderWithUser.user.telegramId),
          `🎉 Заказ #${orderId} выполнен! Вам начислено ${order.bonusEarned} баллов КЭЛВИ. Ваш баланс: ${newBalance} Б`,
        );
      } catch (err) {
        console.error('Failed to notify client about bonus:', err);
      }
    }

    await ctx.answerCallbackQuery({ text: `Заказ #${orderId} выдан` });
    return;
  }

  await ctx.answerCallbackQuery();
});

export async function startBot() {
  bot.start();
  console.log('Bot started');
}
