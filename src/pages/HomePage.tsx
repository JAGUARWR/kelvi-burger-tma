import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { CategoryTabs } from '../components/product/CategoryTabs';
import { ProductCard } from '../components/product/ProductCard';
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
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 14,
          padding: '0 16px 70px 16px',
          marginTop: 20,
        }}
      >
        {filteredItems.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
