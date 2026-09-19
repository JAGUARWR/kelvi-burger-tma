import { Plus, Minus } from 'lucide-react';
import type { MenuItem } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface SauceCardProps {
  item: MenuItem;
}

export function SauceCard({ item }: SauceCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.item.id === item.id);

  return (
    <div
      className="flex flex-col justify-between"
      style={{
        background: '#1C1C1E',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 14,
        minHeight: 115,
      }}
    >
      {/* Верхняя часть */}
      <div>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {item.name}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: '#8A8A8E',
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          Авторский соус &bull; 30 г
        </p>
      </div>

      {/* Нижняя строка */}
      <div
        className="flex items-center justify-between"
        style={{ marginTop: 12 }}
      >
        <span
          className="font-bold"
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.2,
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
                width: 34,
                height: 34,
                borderRadius: 10,
                background: '#2C2C2E',
              }}
            >
              <Minus className="w-4 h-4" strokeWidth={2} />
            </button>
            <span
              className="text-white font-semibold"
              style={{ fontSize: 14, minWidth: 18, textAlign: 'center' }}
            >
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
                background: 'rgba(255, 107, 0, 0.15)',
                color: '#FF6B00',
              }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
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
              background: 'rgba(255, 107, 0, 0.15)',
              color: '#FF6B00',
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
