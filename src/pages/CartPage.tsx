import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';

export function CartPage() {
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
        <div className="px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-card-bg flex items-center justify-center mx-auto mb-4 border border-border">
            <span className="text-3xl" role="img" aria-label="Корзина"></span>
          </div>
          <p className="text-text-primary font-semibold text-lg mb-1">Корзина пуста</p>
          <p className="text-text-secondary text-sm">
            Добавьте блюда из меню
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-[70px] animate-fade-slide-in flex flex-col">
      <Header />
      <div className="px-4 pt-5 flex flex-col gap-5">
        {items.map(({ item, quantity }) => (
          <div
            key={item.id}
            className="bg-card-bg rounded-2xl p-3 border border-border flex gap-3"
          >
            <img
              src={item.image}
              alt={item.name}
              width={76}
              height={76}
              className="w-[76px] h-[76px] object-cover rounded-xl shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="flex-1 min-w-0 py-0.5">
              <h3 className="text-sm font-semibold text-text-primary mb-0.5">
                {item.name}
              </h3>
              <p className="text-[11px] text-text-secondary mb-2.5 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-text-primary tabular-nums">
                  {item.price * quantity}&nbsp;₽
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    aria-label={`Уменьшить количество ${item.name}`}
                    className="w-8 h-8 rounded-full bg-app-bg border border-border flex items-center justify-center text-text-secondary active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none"
                  >
                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <span className="text-sm font-semibold text-text-primary min-w-[20px] text-center tabular-nums" aria-label={`Количество: ${quantity}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    aria-label={`Увеличить количество ${item.name}`}
                    className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
                    }}
                    aria-label={`Удалить ${item.name} из корзины`}
                    className="w-8 h-8 rounded-full bg-app-bg border border-border flex items-center justify-center text-red-400 ml-1 active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-red-400/60 focus-visible:outline-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-card-bg rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-secondary text-sm">Итого:</span>
            <span className="text-xl font-bold text-text-primary tabular-nums">
              {getTotal()}&nbsp;₽
            </span>
          </div>
          <button
            onClick={handleOrder}
            className="w-full bg-accent text-white font-semibold py-3.5 rounded-xl active:scale-[0.98] transition-transform focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
          >
            Оформить заказ
          </button>
          <button
            onClick={handleClearClick}
            className={`w-full text-sm mt-2 py-2.5 active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none rounded-xl ${
              confirmClear ? 'text-red-400 font-medium' : 'text-text-secondary'
            }`}
          >
            {confirmClear ? 'Нажмите ещё раз для подтверждения' : 'Очистить корзину'}
          </button>
        </div>
      </div>
    </div>
  );
}
