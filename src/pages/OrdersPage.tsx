import { ClipboardList } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { useOrderStore } from '../store/orderStore';

interface OrdersPageProps {
  onNavigateHome?: () => void;
}

const statusLabels = {
  pending: 'Ожидает',
  preparing: 'Готовится',
  ready: 'Готов',
};

const statusBadgeStyles: Record<string, { background: string; color: string }> = {
  pending: { background: 'rgba(255, 179, 0, 0.15)', color: '#FFB300' },
  preparing: { background: 'rgba(66, 133, 244, 0.15)', color: '#6EA8FE' },
  ready: { background: 'rgba(52, 211, 153, 0.15)', color: '#34D399' },
};

export function OrdersPage({ onNavigateHome }: OrdersPageProps) {
  const { orders } = useOrderStore();

  if (orders.length === 0) {
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
            <ClipboardList style={{ width: 36, height: 36, color: '#FF6B00' }} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>
            Нет заказов
          </p>
          <p style={{ fontSize: 13, color: '#8A8A8E', marginBottom: 20 }}>
            Ваши заказы появятся здесь
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
    <div className="pb-[70px] animate-fade-slide-in flex flex-col">
      <Header />
      <div className="pt-5 flex flex-col">
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              background: '#1C1C1E',
              borderRadius: 18,
              padding: 14,
              margin: '0 16px 12px',
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
              <time style={{ fontSize: 12, color: '#8A8A8E' }}>
                {order.createdAt}
              </time>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '3px 8px',
                  borderRadius: 8,
                  ...statusBadgeStyles[order.status],
                }}
              >
                {statusLabels[order.status]}
              </span>
            </div>

            <div className="flex flex-col" style={{ gap: 8, marginBottom: 10 }}>
              {order.items.map(({ item, quantity }, idx) => (
                <div key={idx} className="flex items-center" style={{ gap: 10 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="shrink-0 object-cover"
                    style={{ width: 40, height: 40, borderRadius: 10 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span style={{ fontSize: 14, color: '#FFFFFF' }}>
                    {item.name} &times;&nbsp;{quantity}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="flex items-center justify-between"
              style={{ paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span style={{ fontSize: 13, color: '#8A8A8E' }}>Сумма заказа</span>
              <span className="tabular-nums" style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
                {order.total}&nbsp;₽
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
