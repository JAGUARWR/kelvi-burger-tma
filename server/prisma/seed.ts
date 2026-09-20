import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  // Burgers
  { id: 'leshiy', name: 'Леший', category: 'burgers' },
  { id: 'lesnye-yagody', name: 'Лесные ягоды', category: 'burgers' },
  { id: 'syrny-monstr', name: 'Сырный монстр', category: 'burgers' },
  { id: 'ostry-bum', name: 'Острый бум', category: 'burgers' },
  { id: 'amerikanets', name: 'Американец', category: 'burgers' },
  { id: 'smoki', name: 'Смоки', category: 'burgers' },
  // Snacks
  { id: 'kamamber', name: 'Камамбер', category: 'snacks' },
  { id: 'stripsy', name: 'Стрипсы', category: 'snacks' },
  { id: 'batat', name: 'Батат', category: 'snacks' },
  { id: 'doli', name: 'Дольки', category: 'snacks' },
  { id: 'lukovye-kolca', name: 'Луковые кольца', category: 'snacks' },
  { id: 'frishka', name: 'Фришка', category: 'snacks' },
  // Sauces
  { id: 'cheese-sauce', name: 'Сырный соус', category: 'sauces' },
  { id: 'spicy-sauce', name: 'Пикантный соус', category: 'sauces' },
  { id: 'hot-sauce', name: 'Острый соус', category: 'sauces' },
  { id: 'classic-sauce', name: 'Классический соус', category: 'sauces' },
  { id: 'cranberry-sauce', name: 'Брусничный соус', category: 'sauces' },
  { id: 'tomato-sauce', name: 'Томатный соус', category: 'sauces' },
  // Drinks (canUseBonuses: false)
  { id: 'bonaqua', name: 'BonAqua (газ/негаз)', category: 'drinks', canUseBonuses: false, image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=500&q=80' },
  { id: 'evervess', name: 'Evervess', category: 'drinks', canUseBonuses: false, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80' },
  { id: 'mirinda', name: 'Mirinda', category: 'drinks', canUseBonuses: false, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=500&q=80' },
  { id: 'j7-orange', name: 'Сок J7 Апельсин', category: 'drinks', canUseBonuses: false, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80' },
  { id: 'j7-apple', name: 'Сок J7 Яблоко', category: 'drinks', canUseBonuses: false, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80' },
  { id: 'adrenaline', name: 'Adrenaline Rush', category: 'drinks', canUseBonuses: false, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80' },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: { name: p.name, category: p.category, canUseBonuses: p.canUseBonuses ?? true, ...(p.image ? { image: p.image } : {}) },
      create: { ...p, canUseBonuses: p.canUseBonuses ?? true },
    });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
