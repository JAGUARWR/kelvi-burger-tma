import { Bot } from 'grammy';

const bot = new Bot(process.env.BOT_TOKEN!);

console.log('Listening for messages... Send a message in the cooks group.');
console.log('Press Ctrl+C after you see the chat ID.\n');

bot.on('message', async (ctx) => {
  const chat = ctx.chat;
  console.log(`Chat found!`);
  console.log(`  Title: ${chat.type === 'private' ? 'DM' : ('title' in chat ? chat.title : 'Unknown')}`);
  console.log(`  Type:  ${chat.type}`);
  console.log(`  ID:    ${chat.id}`);
  console.log(`\nAdd this to .env:  COOKS_CHAT_ID=${chat.id}`);
});

bot.start();
