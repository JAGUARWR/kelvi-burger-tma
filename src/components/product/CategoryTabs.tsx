import { Sandwich, Cookie, Soup, GlassWater } from 'lucide-react';
import { categories } from '../../data/menu';
import type { Category } from '../../types';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const categoryIcons: Record<Category, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  burgers: Sandwich,
  snacks: Cookie,
  sauces: Soup,
  drinks: GlassWater,
};

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div style={{ margin: '10px 16px 0 16px' }}>
      <div
        className="flex items-center justify-around bg-card-bg/95 backdrop-blur-xl border border-border shadow-lg shadow-black/40"
        role="tablist"
        style={{ borderRadius: 20, padding: '10px 14px' }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = categoryIcons[cat.id];
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex flex-col items-center justify-center flex-1 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none ${
                isActive ? 'text-accent' : 'text-text-secondary'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} aria-hidden="true" />
              <span className="font-medium whitespace-nowrap" style={{ fontSize: 11, marginTop: 3 }}>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
