import { ClipboardList } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { useOrderStore } from '../store/orderStore';

const statusLabels = {
  pending: 'Ожидает',
  preparing: 'Готовится',
  ready: 'Готов',
};

const statusColors = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  preparing: 'bg-blue-500/15 text-blue-400',
  ready: 'bg-emerald-500/15 text-emerald-400',
};

export function OrdersPage() {
  const { orders } = useOrderStore();

  if (orders.length === 0) {
    return (
      <div className="pb-[70px] animate-fade-slide-in flex flex-col">
        <Header />
        <div className="px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-card-bg flex items-center justify-center mx-auto mb-4 border border-border">
            <ClipboardList className="w-8 h-8 text-text-secondary" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="text-text-primary font-semibold text-lg mb-1">Нет заказов</p>
          <p className="text-text-secondary text-sm">
            Ваши заказы появятся здесь
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-[70px] animate-fade-slide-in flex flex-col">
      <Header />
      <div className="px-4 pt-5 flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-card-bg rounded-2xl p-4 border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <time className="text-xs text-text-secondary">
                {order.createdAt}
              </time>
              <span
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${statusColors[order.status]}`}
              >
                {statusLabels[order.status]}
              </span>
            </div>

            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {order.items.slice(0, 4).map(({ item, quantity }, idx) => (
                <div key={idx} className="relative shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg object-cover border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {quantity > 1 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {quantity}
                    </span>
                  )}
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="shrink-0 w-12 h-12 rounded-lg bg-app-bg border border-border flex items-center justify-center">
                  <span className="text-[10px] text-text-secondary font-medium">
                    +{order.items.length - 4}
                  </span>
                </div>
              )}
            </div>

            <ul className="space-y-1 mb-3">
              {order.items.map(({ item, quantity }, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-text-secondary shrink-0" aria-hidden="true" />
                  <p className="text-sm text-text-primary">
                    {item.name} &times;&nbsp;{quantity}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-text-secondary text-sm">Итого:</span>
              <span className="text-base font-bold text-text-primary tabular-nums">
                {order.total}&nbsp;₽
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
