import { Bot } from "grammy";
import * as dotenv from "dotenv";
dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is missing in .env");

const bot = new Bot(token);

// Реакция на /start
bot.command("start", async (ctx) => {
  const chatType = ctx.chat.type;
  const chatId = ctx.chat.id;

  if (chatType === "private") {
    await ctx.reply(`🍔 Привет, ${ctx.from?.first_name}! Я бот бургерной.\nТвой личный ID: ${chatId}\n\nСкоро здесь будет кнопка заказа!`);
  } else {
    await ctx.reply(`👨‍🍳 Бот подключен к группе кухни!\nID этой группы: \`${chatId}\`\nСкопируй это число в COOKS_CHAT_ID.`, { parse_mode: "Markdown" });
    console.log(`\n>>> НАЙДЕН ID ГРУППЫ КУХНИ: ${chatId} <<<\n`);
  }
});

// Реакция на любые текстовые сообщения
bot.on("message:text", async (ctx) => {
  console.log(`[Сообщение от ${ctx.chat.id}]: ${ctx.message.text}`);
});

console.log("🚀 Бот успешно запущен и слушает команды...");
bot.start();
