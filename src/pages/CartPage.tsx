import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';

interface CartPageProps {
  onNavigateHome?: () => void;
}

export function CartPage({ onNavigateHome }: CartPageProps) {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleOrder = () => {
    const orderItems = items.map(({ item, quantity }) => ({ item, quantity }));
    addOrder(orderItems, getTotal());
    clearCart();
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
  };

  const handleClearClick = () => {
    if (confirmClear) {
      clearCart();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pb-[70px] animate-fade-slide-in flex flex-col">
        <Header />
        <div
          className="flex flex-col items-center justify-center text-center px-5"
          style={{ flex: 1, minHeight: 'calc(100dvh - 160px)' }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255, 107, 0, 0.12)',
              marginBottom: 16,
            }}
          >
            <ShoppingCart style={{ width: 36, height: 36, color: '#FF6B00' }} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>
            Корзина пуста
          </p>
          <p style={{ fontSize: 13, color: '#8A8A8E', marginBottom: 20 }}>
            Добавьте блюда из меню
          </p>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="active:scale-[0.97] transition-transform"
              style={{
                background: '#E65100',
                color: '#FFFFFF',
                borderRadius: 12,
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Перейти в меню
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-slide-in flex flex-col" style={{ paddingBottom: 160 }}>
      <Header />
      <div className="px-4 pt-5 flex flex-col" style={{ gap: 12 }}>
        {items.map(({ item, quantity }) => (
          <div
            key={item.id}
            style={{
              background: '#1C1C1E',
              borderRadius: 18,
              padding: 14,
            }}
          >
            <div className="flex" style={{ gap: 12 }}>
              <img
                src={item.image}
                alt={item.name}
                width={64}
                height={64}
                className="shrink-0 object-cover"
                style={{ width: 64, height: 64, borderRadius: 12 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', lineHeight: 1.3 }}>
                  {item.name}
                </h3>
                {item.weight && (
                  <span style={{ fontSize: 12, color: '#8A8A8E', marginTop: 2, display: 'block' }}>
                    {item.weight}
                  </span>
                )}
              </div>
            </div>

            <p style={{
              fontSize: 11,
              lineHeight: 1.4,
              color: '#9E9EA2',
              marginTop: 8,
              whiteSpace: 'normal',
            }}>
              {item.description}
            </p>

            <div
              className="flex items-center justify-between"
              style={{
                marginTop: 10,
                paddingTop: 8,
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }} className="tabular-nums">
                {item.price * quantity}&nbsp;₽
              </span>
              <div className="flex items-center" style={{ gap: 8 }}>
                <button
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  aria-label={`Уменьшить количество ${item.name}`}
                  className="flex items-center justify-center active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none"
                  style={{ width: 28, height: 28, borderRadius: '50%', background: '#2C2C2E' }}
                >
                  <Minus style={{ width: 14, height: 14, color: '#FFFFFF' }} strokeWidth={2} aria-hidden="true" />
                </button>
                <span
                  className="tabular-nums"
                  style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', minWidth: 20, textAlign: 'center' }}
                  aria-label={`Количество: ${quantity}`}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                  aria-label={`Увеличить количество ${item.name}`}
                  className="flex items-center justify-center active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none"
                  style={{ width: 28, height: 28, borderRadius: '50%', background: '#2C2C2E' }}
                >
                  <Plus style={{ width: 14, height: 14, color: '#FFFFFF' }} strokeWidth={2} aria-hidden="true" />
                </button>
                <button
                  onClick={() => {
                    removeItem(item.id);
                    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
                  }}
                  aria-label={`Удалить ${item.name} из корзины`}
                  className="flex items-center justify-center active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-red-400/60 focus-visible:outline-none"
                  style={{ width: 28, height: 28, borderRadius: '50%', background: 'transparent' }}
                >
                  <Trash2 style={{ width: 16, height: 16, color: '#636366' }} strokeWidth={1.8} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 65,
          left: 16,
          right: 16,
          background: 'rgba(28, 28, 30, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          padding: 14,
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.08)',
          zIndex: 40,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 15, color: '#8A8A8E' }}>Итого:</span>
          <span className="tabular-nums" style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>
            {getTotal()}&nbsp;₽
          </span>
        </div>
        <button
          onClick={handleOrder}
          className="active:scale-[0.98] transition-transform focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
          style={{
            width: '100%',
            background: '#E65100',
            color: '#FFFFFF',
            height: 44,
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Оформить заказ
        </button>
        <button
          onClick={handleClearClick}
          className="active:scale-[0.98] transition-all focus-visible:outline-none"
          style={{
            display: 'block',
            width: '100%',
            fontSize: 12,
            color: confirmClear ? '#E53935' : '#8A8A8E',
            textAlign: 'center',
            marginTop: 6,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          {confirmClear ? 'Нажмите ещё раз для подтверждения' : 'Очистить корзину'}
        </button>
      </div>
    </div>
  );
}
