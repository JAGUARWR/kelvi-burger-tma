import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { MenuItem } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  item: MenuItem;
  isAvailable?: boolean;
}

interface BadgeStyle {
  background: string;
  border: string;
  color: string;
}

function getBadgeStyle(badge: string): BadgeStyle {
  const styles: Record<string, BadgeStyle> = {
    'Хит': {
      background: 'rgba(255, 107, 0, 0.22)',
      border: '1px solid rgba(255, 107, 0, 0.5)',
      color: '#FF944D',
    },
    'Новинка': {
      background: 'rgba(0, 200, 115, 0.22)',
      border: '1px solid rgba(0, 200, 115, 0.5)',
      color: '#2EE59D',
    },
    'Острый': {
      background: 'rgba(255, 59, 48, 0.22)',
      border: '1px solid rgba(255, 59, 48, 0.5)',
      color: '#FF6961',
    },
  };

  return styles[badge] || {
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    color: '#E5E5EA',
  };
}

const categoryEmoji: Record<string, string> = {
  burgers: '🍔',
  snacks: '',
  sauces: '🥫',
  drinks: '',
};

export function ProductCard({ item, isAvailable = true }: ProductCardProps) {
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
        opacity: isAvailable ? 1 : 0.55,
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
            className={`w-full h-full ${item.category === 'drinks' ? 'object-contain p-2' : 'object-cover'} transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            style={{ filter: isAvailable ? 'none' : 'grayscale(80%)' }}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}
        {/* Закончилось */}
        {!isAvailable && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              zIndex: 3,
            }}
          >
            <span
              style={{
                background: 'rgba(255, 59, 48, 0.25)',
                border: '1px solid rgba(255, 59, 48, 0.6)',
                color: '#FF6961',
                borderRadius: 12,
                padding: '4px 8px',
                fontWeight: 700,
                fontSize: 11,
                lineHeight: 1,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              Закончилось
            </span>
          </div>
        )}
        {/* Бейдж */}
        {item.badge && (() => {
          const s = getBadgeStyle(item.badge);
          return (
            <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }} aria-hidden="true">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: 1,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
                  background: s.background,
                  border: s.border,
                  color: s.color,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'currentColor',
                    boxShadow: '0 0 6px currentColor',
                    flexShrink: 0,
                  }}
                />
                {item.badge}
              </span>
            </div>
          );
        })()}
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

          {!isAvailable ? (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: '#2C2C2E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} style={{ color: '#4A4A4E' }} aria-hidden="true" />
            </div>
          ) : cartItem ? (
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
