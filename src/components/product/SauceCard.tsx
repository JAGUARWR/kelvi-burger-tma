import { Plus, Minus } from 'lucide-react';
import type { MenuItem } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface SauceCardProps {
  item: MenuItem;
}

const sauceColors: Record<string, string> = {
  'Сырный соус': '#FFB800',
  'Пикантный соус': '#FF6B00',
  'Острый соус': '#FF3B30',
  'Брусничный соус': '#AF52DE',
  'Томатный соус': '#E03E3E',
  'Классический соус': '#8E8E93',
};

export function SauceCard({ item }: SauceCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.item.id === item.id);
  const dotColor = sauceColors[item.name] || '#8E8E93';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#1C1C1E',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: 16,
        padding: '12px 16px',
        height: 60,
        transition: 'background 0.2s ease',
      }}
    >
      {/* Левая часть */}
      <div className="flex items-center" style={{ minWidth: 0 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: dotColor,
            boxShadow: `0 0 8px ${dotColor}`,
            flexShrink: 0,
          }}
        />
        <div className="flex items-baseline" style={{ marginLeft: 12, minWidth: 0 }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.name}
          </span>
          <span
            style={{
              fontSize: 12,
              color: '#8A8A8E',
              marginLeft: 8,
              fontWeight: 400,
              flexShrink: 0,
            }}
          >
            30 г
          </span>
        </div>
      </div>

      {/* Правая часть */}
      <div className="flex items-center" style={{ gap: 12, flexShrink: 0 }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          {item.price} ₽
        </span>

        {cartItem ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
              aria-label={`Уменьшить количество ${item.name}`}
              className="flex items-center justify-center active:scale-90 transition-transform"
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: '#2C2C2E',
                border: 'none',
              }}
            >
              <Minus className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            <span
              className="text-white font-semibold"
              style={{ fontSize: 13, minWidth: 16, textAlign: 'center' }}
            >
              {cartItem.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
              aria-label={`Увеличить количество ${item.name}`}
              className="flex items-center justify-center active:scale-90 transition-transform"
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: 'rgba(255, 107, 0, 0.15)',
                color: '#FF6B00',
                border: 'none',
              }}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
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
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'rgba(255, 107, 0, 0.15)',
              color: '#FF6B00',
              border: 'none',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
