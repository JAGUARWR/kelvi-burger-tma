import { useState, useMemo } from 'react';
import { Minus, Plus, Trash2, ShoppingCart, Clock } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { useUserStore } from '../store/userStore';

interface CartPageProps {
  onNavigateHome?: () => void;
}

type PickupMode = 'asap' | 'scheduled';

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 10; h < 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      const now = new Date();
      const slotDate = new Date(now);
      slotDate.setHours(h, m, 0, 0);
      if (slotDate > now) {
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
  }
  return slots;
}

export function CartPage({ onNavigateHome }: CartPageProps) {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const { addOrder, submitting, error, clearError } = useOrderStore();
  const { profile } = useUserStore();

  const [confirmClear, setConfirmClear] = useState(false);
  const [pickupMode, setPickupMode] = useState<PickupMode>('asap');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [useBonuses, setUseBonuses] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const total = getTotal();
  const bonusBalance = profile?.bonus_balance ?? profile?.bonusBalance ?? 0;
  const maxBonusUse = Math.min(bonusBalance, Math.floor(total / 2));
  const bonusDiscount = useBonuses ? maxBonusUse : 0;
  const finalTotal = total - bonusDiscount;

  const handleOrder = async () => {
    if (submitting) return;
    const ok = await addOrder(items, 'dine_in', bonusDiscount);
    if (ok) {
      clearCart();
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
      setShowSuccess(true);
      setUseBonuses(false);
    } else {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
    }
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

  if (showSuccess) {
    const displayTime = pickupMode === 'asap' ? '20–30 минут' : selectedTime;
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
              background: 'rgba(76, 175, 80, 0.15)',
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 40 }}>🔥</span>
          </div>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>
            Заказ оформлен!
          </p>
          <p style={{ fontSize: 15, color: '#8A8A8E', marginBottom: 6, lineHeight: 1.5 }}>
            Передали на кухню. Готовим ко времени
          </p>
          <p style={{ fontSize: 17, fontWeight: 600, color: '#FF6B00', marginBottom: 24 }}>
            {displayTime}
          </p>
          {bonusDiscount > 0 && (
            <p style={{ fontSize: 13, color: '#8A8A8E', marginBottom: 20 }}>
              Списано {bonusDiscount} бонусов
            </p>
          )}
          <button
            onClick={() => {
              setShowSuccess(false);
              onNavigateHome?.();
            }}
            className="active:scale-[0.97] transition-transform"
            style={{
              background: '#E65100',
              color: '#FFFFFF',
              borderRadius: 14,
              padding: '12px 32px',
              fontSize: 15,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Вернуться в меню
          </button>
        </div>
      </div>
    );
  }

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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 80px)', overflow: 'hidden', background: 'transparent' }}>
      <Header />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', paddingBottom: 280 }}>
        {items.map(({ item, quantity }) => (
          <div
            key={item.id}
            style={{
              background: '#1C1C1E',
              borderRadius: 18,
              padding: 14,
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: 12,
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

        {/* Pickup time */}
        <div
          style={{
            background: '#1C1C1E',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 14,
            marginBottom: 12,
          }}
        >
          <div className="flex items-center" style={{ gap: 8, marginBottom: 12 }}>
            <Clock style={{ width: 18, height: 18, color: '#FF6B00' }} strokeWidth={1.8} aria-hidden="true" />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Время самовывоза</span>
          </div>

          <div
            style={{
              display: 'flex',
              background: '#2C2C2E',
              borderRadius: 10,
              padding: 3,
              marginBottom: pickupMode === 'scheduled' ? 12 : 0,
            }}
          >
            <button
              onClick={() => { setPickupMode('asap'); setSelectedTime(''); }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                background: pickupMode === 'asap' ? '#FF6B00' : 'transparent',
                color: pickupMode === 'asap' ? '#FFFFFF' : '#8A8A8E',
                transition: 'all 0.2s',
              }}
            >
              Как можно скорее
            </button>
            <button
              onClick={() => setPickupMode('scheduled')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                background: pickupMode === 'scheduled' ? '#FF6B00' : 'transparent',
                color: pickupMode === 'scheduled' ? '#FFFFFF' : '#8A8A8E',
                transition: 'all 0.2s',
              }}
            >
              Ко времени
            </button>
          </div>

          {pickupMode === 'scheduled' && (
            <div
              className="flex"
              style={{
                gap: 8,
                overflowX: 'auto',
                paddingBottom: 4,
                scrollbarWidth: 'none',
              }}
            >
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => {
                    setSelectedTime(slot);
                    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged();
                  }}
                  style={{
                    flexShrink: 0,
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedTime === slot ? 'rgba(255, 107, 0, 0.2)' : '#2C2C2E',
                    color: selectedTime === slot ? '#FF6B00' : '#8A8A8E',
                    transition: 'all 0.15s',
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}

          {pickupMode === 'asap' && (
            <p style={{ fontSize: 12, color: '#8A8A8E', margin: 0 }}>
              ~20–30 минут
            </p>
          )}
        </div>

        {/* Bonus toggle */}
        {bonusBalance > 0 && (
          <div
            style={{
              background: '#1C1C1E',
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.08)',
              padding: 14,
              marginBottom: 12,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>
                  Списать бонусы
                </span>
                <p style={{ fontSize: 12, color: '#8A8A8E', marginTop: 2, margin: 0 }}>
                  Ваш баланс: {bonusBalance} Б · до 50% чека
                </p>
              </div>
              <button
                onClick={() => {
                  setUseBonuses(!useBonuses);
                  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
                }}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  border: 'none',
                  cursor: 'pointer',
                  background: useBonuses ? '#FF6B00' : '#2C2C2E',
                  position: 'relative',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    position: 'absolute',
                    top: 3,
                    left: useBonuses ? 23 : 3,
                    transition: 'left 0.2s',
                  }}
                />
              </button>
            </div>
            {useBonuses && maxBonusUse > 0 && (
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 13, color: '#4CAF50' }}>
                    Скидка баллами:
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#4CAF50' }}>
                    −{bonusDiscount} ₽
                  </span>
                </div>
                <p style={{ fontSize: 11, color: '#8A8A8E', marginTop: 4, margin: 0 }}>
                  Списываем {maxBonusUse} Б из {bonusBalance}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom summary */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 16px 16px',
          background: 'linear-gradient(to top, #0D0D0F 70%, transparent)',
          paddingTop: 24,
        }}
      >
        <div
          style={{
            background: '#1C1C1E',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 20,
            padding: '14px 16px',
          }}
        >
          {error && (
            <p onClick={clearError} style={{ fontSize: 12, color: '#EF5350', marginBottom: 8, cursor: 'pointer' }}>
              {error}
            </p>
          )}

          <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 14, color: '#8A8A8E' }}>Сумма заказа:</span>
            <span className="tabular-nums" style={{ fontSize: 15, fontWeight: 500, color: '#FFFFFF' }}>
              {total}&nbsp;₽
            </span>
          </div>

          {bonusDiscount > 0 && (
            <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 14, color: '#4CAF50' }}>Бонусы:</span>
              <span className="tabular-nums" style={{ fontSize: 15, fontWeight: 500, color: '#4CAF50' }}>
                −{bonusDiscount}&nbsp;₽
              </span>
            </div>
          )}

          <div
            className="flex items-center justify-between"
            style={{
              marginBottom: 12,
              paddingTop: 8,
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span style={{ fontSize: 15, color: '#8A8A8E' }}>Итого:</span>
            <span className="tabular-nums" style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>
              {finalTotal}&nbsp;₽
            </span>
          </div>

          <button
            onClick={handleOrder}
            disabled={submitting || (pickupMode === 'scheduled' && !selectedTime)}
            className="active:scale-[0.98] transition-transform focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
            style={{
              width: '100%',
              background: (submitting || (pickupMode === 'scheduled' && !selectedTime)) ? '#8D4004' : '#E65100',
              color: '#FFFFFF',
              height: 48,
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 600,
              border: 'none',
              cursor: (submitting || (pickupMode === 'scheduled' && !selectedTime)) ? 'not-allowed' : 'pointer',
              opacity: (submitting || (pickupMode === 'scheduled' && !selectedTime)) ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {submitting ? (
              <>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#FFFFFF',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                Оформляем...
              </>
            ) : (
              'Оформить заказ'
            )}
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
              marginTop: 8,
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

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
