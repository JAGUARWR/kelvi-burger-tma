import { Bot, InlineKeyboard } from 'grammy';
import type { OrderItemPayload } from '../types.js';
import { prisma } from '../lib/prisma.js';
import { completeOrder } from '../services/orderService.js';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const COOKS_CHAT_ID = process.env.COOKS_CHAT_ID!;
const TELEGRAM_API_ROOT = process.env.TELEGRAM_API_ROOT || 'https://api.telegram.org';

export const bot = new Bot(BOT_TOKEN, {
  client: { apiRoot: TELEGRAM_API_ROOT },
});

const KITCHEN_CHAT_ID = process.env.COOKS_CHAT_ID || process.env.KITCHEN_CHAT_ID;

function isKitchenChat(chatId: number): boolean {
  return KITCHEN_CHAT_ID ? chatId.toString() === KITCHEN_CHAT_ID.toString() : false;
}

// --- Stop-list interactive menu ---

const categoryNames: Record<string, string> = {
  burgers: '🍔 Бургеры',
  snacks: '🍟 Закуски',
  sauces: '🥣 Соусы',
  drinks: '🥤 Напитки',
};

async function renderStopMenu(ctx: any) {
  const keyboard = new InlineKeyboard()
    .text('🍔 Бургеры', 'sl:cat:burgers').text('🍟 Закуски', 'sl:cat:snacks').row()
    .text('🥣 Соусы', 'sl:cat:sauces').text('🥤 Напитки', 'sl:cat:drinks').row()
    .text('📋 Текущий стоп-лист', 'sl:stoplist').row()
    .text('❌ Закрыть', 'sl:close');

  const method = ctx.editMessageText ? 'editMessageText' : 'reply';
  try {
    await ctx[method](
      'Управление стоп-листом кухни КЭЛВИ. Выберите категорию:',
      { reply_markup: keyboard },
    );
  } catch {
    await ctx.reply(
      'Управление стоп-листом кухни КЭЛВИ. Выберите категорию:',
      { reply_markup: keyboard },
    );
  }
}

async function renderCategory(ctx: any, categoryId: string) {
  const products = await prisma.product.findMany({
    where: { category: categoryId },
    orderBy: { name: 'asc' },
  });

  const catLabel = categoryNames[categoryId] || categoryId;
  const keyboard = new InlineKeyboard();

  for (const p of products) {
    const icon = p.isAvailable ? '🟢' : '🔴';
    const suffix = p.isAvailable ? '' : ' (СТОП)';
    keyboard.text(`${icon} ${p.name}${suffix}`, `sl:toggle:${p.id}`).row();
  }

  keyboard.text('⬅️ Назад к категориям', 'sl:menu');

  try {
    await ctx.editMessageText(
      `Категория: ${catLabel}. Нажмите на блюдо, чтобы изменить его статус:`,
      { reply_markup: keyboard },
    );
  } catch {
    await ctx.reply(
      `Категория: ${catLabel}. Нажмите на блюдо, чтобы изменить его статус:`,
      { reply_markup: keyboard },
    );
  }
}

async function renderStopList(ctx: any) {
  const stopped = await prisma.product.findMany({
    where: { isAvailable: false },
    orderBy: { name: 'asc' },
  });

  const keyboard = new InlineKeyboard().text('⬅️ Назад', 'sl:menu');

  if (stopped.length === 0) {
    try {
      await ctx.editMessageText('✅ Все позиции доступны!', { reply_markup: keyboard });
    } catch {
      await ctx.reply('✅ Все позиции доступны!', { reply_markup: keyboard });
    }
    return;
  }

  const lines = stopped.map((p, i) => `  ${i + 1}. 🔴 ${p.name}`);
  try {
    await ctx.editMessageText(`⛔ Текущий стоп-лист:\n\n${lines.join('\n')}`, { reply_markup: keyboard });
  } catch {
    await ctx.reply(`⛔ Текущий стоп-лист:\n\n${lines.join('\n')}`, { reply_markup: keyboard });
  }
}

bot.command('stop', async (ctx) => {
  if (!ctx.chat || !isKitchenChat(ctx.chat.id)) return;
  await renderStopMenu(ctx);
});

bot.command('menu', async (ctx) => {
  if (!ctx.chat || !isKitchenChat(ctx.chat.id)) return;
  await renderStopMenu(ctx);
});

bot.command('start', async (ctx) => {
  if (!ctx.from) return;

  const tgId = BigInt(ctx.from.id);
  const firstName = ctx.from.first_name ?? 'друг';

  const existing = await prisma.user.findUnique({ where: { telegramId: tgId } });

  if (!existing) {
    await prisma.user.create({
      data: {
        telegramId: tgId,
        firstName: ctx.from.first_name ?? null,
        username: ctx.from.username ?? null,
        bonusBalance: 200,
      },
    });

    await ctx.reply(
      `Привет, ${firstName}! 🔥\n` +
      `Добро пожаловать в бургерную КЭЛВИ — настоящий жар улиц!\n\n` +
      `🎁 Вам начислено 200 приветственных бонусов (1 Б = 1 ₽)!\n` +
      `Вы можете оплатить ими до 50% вашего первого заказа.`,
    );
    return;
  }

  await ctx.reply(
    `С возвращением в КЭЛВИ, ${firstName}! Рады видеть вас снова.\n` +
    `На вашем балансе: ${existing.bonusBalance} Б.`,
  );
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

export async function notifyUser(
  chatId: number,
  orderId: number,
  pickupTime: string,
  totalPrice: number,
  bonusUsed: number,
) {
  const timeLabel = pickupTime === 'asap' ? '20–30 минут' : pickupTime;
  const bonusLine = bonusUsed > 0 ? `\n💵 Сумма: ${totalPrice} ₽ (списано ${bonusUsed} бонусов)` : `\n💵 Сумма: ${totalPrice} ₽`;

  const text =
    `🍔 Заказ #${orderId} успешно оплачен!\n` +
    `⏰ Время готовности: ${timeLabel}\n` +
    `📍 Самовывоз: ул. Мичурина, 12\n` +
    `${bonusLine}\n\n` +
    `Мы уже начали готовить, ждем вас!`;

  try {
    await bot.api.sendMessage(chatId, text);
  } catch (err) {
    console.error('Failed to notify user:', err);
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

  // --- Stop-list interactive callbacks ---
  if (data.startsWith('sl:')) {
    if (!ctx.chat || !isKitchenChat(ctx.chat.id)) {
      await ctx.answerCallbackQuery();
      return;
    }

    if (data === 'sl:menu') {
      await renderStopMenu(ctx);
      await ctx.answerCallbackQuery();
      return;
    }

    if (data.startsWith('sl:cat:')) {
      const categoryId = data.slice(7);
      await renderCategory(ctx, categoryId);
      await ctx.answerCallbackQuery();
      return;
    }

    if (data.startsWith('sl:toggle:')) {
      const productId = data.slice(10);
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (product) {
        const newStatus = !product.isAvailable;
        await prisma.product.update({
          where: { id: productId },
          data: { isAvailable: newStatus },
        });
        const alertText = newStatus
          ? `✅ Позиция ${product.name} возвращена в меню!`
          : `⛔ Позиция ${product.name} поставлена на СТОП!`;
        await renderCategory(ctx, product.category);
        await ctx.answerCallbackQuery({ text: alertText });
      } else {
        await ctx.answerCallbackQuery({ text: 'Позиция не найдена' });
      }
      return;
    }

    if (data === 'sl:stoplist') {
      await renderStopList(ctx);
      await ctx.answerCallbackQuery();
      return;
    }

    if (data === 'sl:close') {
      try {
        await ctx.editMessageText('✅ Стоп-лист закрыт.');
      } catch { /* ignore */ }
      await ctx.answerCallbackQuery();
      return;
    }

    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery();
});

export async function startBot() {
  await bot.api.deleteWebhook({ drop_pending_updates: true });
  console.log('Webhook deleted');
  bot.start();
  console.log('Bot started');
}
