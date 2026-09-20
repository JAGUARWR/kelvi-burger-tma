import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { CategoryTabs } from '../components/product/CategoryTabs';
import { ProductCard } from '../components/product/ProductCard';
import { SauceCard } from '../components/product/SauceCard';
import { menuItems } from '../data/menu';
import type { Category } from '../types';

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('burgers');

  const filteredItems = menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="animate-fade-slide-in flex flex-col">
      <Header />
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div
        key={activeCategory}
        className="animate-fade-slide-in"
        style={
          activeCategory === 'sauces'
            ? { display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px 100px 16px', marginTop: 20 }
            : { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: '0 16px 100px 16px', marginTop: 20 }
        }
      >
        {filteredItems.map((item) =>
          item.category === 'sauces' ? (
            <SauceCard key={item.id} item={item} />
          ) : (
            <ProductCard key={item.id} item={item} />
          )
        )}
      </div>
    </div>
  );
}
