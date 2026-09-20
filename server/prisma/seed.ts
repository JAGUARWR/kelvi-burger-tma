import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  // Burgers
  { id: 'leshiy', name: 'Леший' },
  { id: 'lesnye-yagody', name: 'Лесные ягоды' },
  { id: 'syrny-monstr', name: 'Сырный монстр' },
  { id: 'ostry-bum', name: 'Острый бум' },
  { id: 'amerikanets', name: 'Американец' },
  { id: 'smoki', name: 'Смоки' },
  // Snacks
  { id: 'kamamber', name: 'Камамбер' },
  { id: 'stripsy', name: 'Стрипсы' },
  { id: 'batat', name: 'Батат' },
  { id: 'doli', name: 'Дольки' },
  { id: 'lukovye-kolca', name: 'Луковые кольца' },
  { id: 'frishka', name: 'Фришка' },
  // Sauces
  { id: 'cheese-sauce', name: 'Сырный соус' },
  { id: 'spicy-sauce', name: 'Пикантный соус' },
  { id: 'hot-sauce', name: 'Острый соус' },
  { id: 'classic-sauce', name: 'Классический соус' },
  { id: 'cranberry-sauce', name: 'Брусничный соус' },
  { id: 'tomato-sauce', name: 'Томатный соус' },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: { name: p.name },
      create: p,
    });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
