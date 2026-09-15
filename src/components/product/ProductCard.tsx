import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { MenuItem } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  item: MenuItem;
}

const badgeColors: Record<string, string> = {
  'Хит': 'bg-accent',
  'Острый': 'bg-red-500',
  'Новинка': 'bg-emerald-500',
};

const categoryEmoji: Record<string, string> = {
  burgers: '🍔',
  snacks: '',
  sauces: '🥫',
  drinks: '',
};

export function ProductCard({ item }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.item.id === item.id);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        borderRadius: 20,
        background: '#1C1C1E',
      }}
    >
      {/* Изображение */}
      <div className="relative" style={{ height: 140 }}>
        {!imgLoaded && !imgError && (
          <div className="skeleton w-full h-full" />
        )}
        {imgError ? (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.03)', fontSize: 36 }}
            role="img"
            aria-label={item.name}
          >
            {categoryEmoji[item.category] || '🍽️'}
          </div>
        ) : (
          <img
            src={item.image}
            alt={item.name}
            width={400}
            height={300}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}
        {/* Бейдж */}
        {item.badge && (
          <div className="absolute top-2 left-2" aria-hidden="true">
            <span
              className={`${badgeColors[item.badge] || 'bg-accent'} text-white text-[10px] font-bold px-2 py-0.5 rounded-md`}
            >
              {item.badge}
            </span>
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="flex flex-col flex-1" style={{ padding: 12 }}>
        <h3 className="font-semibold text-white" style={{ fontSize: 15, marginBottom: 2, lineHeight: 1.25 }}>
          {item.name}
        </h3>
        <p
          style={{
            fontSize: 11,
            color: '#8A8A8E',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: 0,
          }}
        >
          {item.description}
        </p>

        {/* Нижний ряд */}
        <div className="flex items-center justify-between" style={{ marginTop: 10 }}>
          <div className="flex flex-col">
            <span className="font-bold text-white" style={{ fontSize: 16, lineHeight: 1.2 }}>
              {item.price} ₽
            </span>
            {item.weight && (
              <span style={{ fontSize: 10, color: '#6B6B70', lineHeight: 1.2 }}>
                {item.weight}
              </span>
            )}
          </div>

          {cartItem ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                aria-label={`Уменьшить количество ${item.name}`}
                className="flex items-center justify-center text-text-secondary active:scale-90 transition-transform"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: '#2C2C2E',
                }}
              >
                <Minus className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              </button>
              <span className="text-white font-semibold" style={{ fontSize: 14, minWidth: 18, textAlign: 'center' }}>
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                aria-label={`Увеличить количество ${item.name}`}
                className="flex items-center justify-center active:scale-90 transition-transform"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'rgba(255,107,0,0.15)',
                  color: '#FF6B00',
                }}
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                addItem(item);
                window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
              }}
              aria-label={`Добавить ${item.name} в корзину`}
              className="flex items-center justify-center active:scale-90 transition-transform"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'rgba(255,107,0,0.15)',
                color: '#FF6B00',
              }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
