import { useState, useMemo } from 'react';
import { Minus, Plus, Trash2, ShoppingCart, Clock, Flame } from 'lucide-react';
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
  const subtotal = getTotal();
  const bonusBalance = profile?.bonus_balance ?? profile?.bonusBalance ?? 200;

  const hasDrinks = items.some((i) => i.item.category === 'drinks');
  const onlyDrinks = items.every((i) => i.item.category === 'drinks');
  const bonusEligibleTotal = items
    .filter((i) => i.item.category !== 'drinks')
    .reduce((acc, i) => acc + i.item.price * i.quantity, 0);
  const maxBonusUse = Math.min(bonusBalance, Math.floor(bonusEligibleTotal / 2));
  const bonusDiscount = useBonuses && maxBonusUse > 0 ? maxBonusUse : 0;
  const finalTotal = subtotal - bonusDiscount;

  const handleOrder = async () => {
    if (submitting) return;
    const pt = pickupMode === 'asap' ? 'asap' : selectedTime;
    const ok = await addOrder(items, 'dine_in', bonusDiscount, pt);
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
      <div className="animate-fade-slide-in" style={{ width: '100%', minHeight: '100vh', padding: '16px 16px 120px' }}>
        <Header />
        <div
          className="flex flex-col items-center justify-center text-center"
          style={{ minHeight: 'calc(100vh - 200px)', paddingTop: 60 }}
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
      <div className="animate-fade-slide-in" style={{ width: '100%', minHeight: '100vh', padding: '16px 16px 120px' }}>
        <Header />
        <div
          className="flex flex-col items-center justify-center text-center"
          style={{ minHeight: 'calc(100vh - 200px)' }}
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
    <div
      className="animate-fade-slide-in"
      style={{
        width: '100%',
        minHeight: '100vh',
        padding: '16px 16px 120px',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <Header />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
        {/* Block 1: Cart items */}
        {items.map(({ item, quantity }) => (
          <div
            key={item.id}
            style={{
              background: '#1C1C1E',
              borderRadius: 18,
              padding: 14,
              border: '1px solid rgba(255,255,255,0.08)',
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
                  className="flex items-center justify-center active:scale-90 transition-transform"
                  style={{ width: 28, height: 28, borderRadius: '50%', background: '#2C2C2E' }}
                >
                  <Minus style={{ width: 14, height: 14, color: '#FFFFFF' }} strokeWidth={2} aria-hidden="true" />
                </button>
                <span
                  className="tabular-nums"
                  style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', minWidth: 20, textAlign: 'center' }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                  className="flex items-center justify-center active:scale-90 transition-transform"
                  style={{ width: 28, height: 28, borderRadius: '50%', background: '#2C2C2E' }}
                >
                  <Plus style={{ width: 14, height: 14, color: '#FFFFFF' }} strokeWidth={2} aria-hidden="true" />
                </button>
                <button
                  onClick={() => {
                    removeItem(item.id);
                    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
                  }}
                  className="flex items-center justify-center active:scale-90 transition-transform"
                  style={{ width: 28, height: 28, borderRadius: '50%', background: 'transparent' }}
                >
                  <Trash2 style={{ width: 16, height: 16, color: '#636366' }} strokeWidth={1.8} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Block 2: Pickup time */}
        <div
          style={{
            background: '#1C1C1E',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 14,
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

          {pickupMode === 'scheduled' ? (
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
          ) : (
            <p style={{ fontSize: 12, color: '#8A8A8E', margin: 0 }}>~20–30 минут</p>
          )}
        </div>

        {/* Block 3: Bonus toggle */}
        <div
          style={{
            background: '#1C1C1E',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 14,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: 10 }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(255, 107, 0, 0.12)',
                }}
              >
                <Flame style={{ width: 16, height: 16, color: '#FF6B00' }} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', display: 'block' }}>
                  Списать баллы
                </span>
                <span style={{ fontSize: 11, color: '#8A8A8E', display: 'block', marginTop: 1 }}>
                  {onlyDrinks
                    ? 'В заказе только напитки — списание бонусов недоступно'
                    : `Доступно: ${bonusBalance} Б (макс. 50% чека)`}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                if (onlyDrinks) return;
                setUseBonuses(!useBonuses);
                window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
              }}
              disabled={onlyDrinks}
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                border: 'none',
                cursor: onlyDrinks ? 'not-allowed' : 'pointer',
                background: onlyDrinks ? '#2C2C2E' : useBonuses ? '#FF6B00' : '#2C2C2E',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
                opacity: onlyDrinks ? 0.5 : 1,
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
                  left: onlyDrinks ? 3 : useBonuses ? 23 : 3,
                  transition: 'left 0.2s',
                }}
              />
            </button>
          </div>
          {hasDrinks && !onlyDrinks && (
            <p style={{ fontSize: 11, color: '#6B6B70', marginTop: 8, lineHeight: 1.4 }}>
              *Оплата бонусами не распространяется на категорию напитков
            </p>
          )}
          {useBonuses && maxBonusUse > 0 && (
            <div
              style={{
                marginTop: 10,
                paddingTop: 10,
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 13, color: '#FF6B00' }}>Скидка баллами:</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#FF6B00' }}>
                  −{bonusDiscount} ₽
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Block 4: Summary & checkout */}
        <div
          style={{
            background: '#1C1C1E',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 16,
          }}
        >
          {error && !submitting && (
            <div
              onClick={clearError}
              style={{
                background: 'rgba(239, 83, 80, 0.1)',
                border: '1px solid rgba(239, 83, 80, 0.2)',
                borderRadius: 10,
                padding: '8px 12px',
                marginBottom: 12,
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 12, color: '#EF5350' }}>
                Не удалось отправить заказ. Нажмите, чтобы скрыть.
              </span>
            </div>
          )}

          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: '#8A8A8E' }}>Сумма заказа:</span>
            <span className="tabular-nums" style={{ fontSize: 15, fontWeight: 500, color: '#FFFFFF' }}>
              {subtotal}&nbsp;₽
            </span>
          </div>

          {bonusDiscount > 0 && (
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: '#FF6B00' }}>Скидка баллами:</span>
              <span className="tabular-nums" style={{ fontSize: 15, fontWeight: 500, color: '#FF6B00' }}>
                −{bonusDiscount}&nbsp;₽
              </span>
            </div>
          )}

          <div
            className="flex items-center justify-between"
            style={{
              paddingTop: 12,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              marginBottom: 14,
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
            className="active:scale-[0.98] transition-transform"
            style={{
              width: '100%',
              background: (submitting || (pickupMode === 'scheduled' && !selectedTime)) ? '#8D4004' : '#FF6B00',
              color: '#FFFFFF',
              height: 50,
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
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
            className="active:scale-[0.98] transition-all"
            style={{
              display: 'block',
              width: '100%',
              fontSize: 12,
              color: confirmClear ? '#E53935' : '#8A8A8E',
              textAlign: 'center',
              marginTop: 12,
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
        @keyframes spin { to { transform: rotate(360deg); } }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
