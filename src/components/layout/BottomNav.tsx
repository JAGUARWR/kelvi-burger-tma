import { Home, ShoppingCart, ClipboardList, User } from 'lucide-react';

type Tab = 'home' | 'cart' | 'orders' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  cartCount: number;
}

const tabs = [
  { id: 'home' as const, icon: Home, label: 'Меню' },
  { id: 'cart' as const, icon: ShoppingCart, label: 'Корзина' },
  { id: 'orders' as const, icon: ClipboardList, label: 'Заказы' },
  { id: 'profile' as const, icon: User, label: 'Профиль' },
];

export function BottomNav({ activeTab, onTabChange, cartCount }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ margin: '0 16px', paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      <div
        className="flex items-center justify-around bg-card-bg/95 backdrop-blur-xl border border-border shadow-lg shadow-black/40"
        style={{ borderRadius: 20, padding: '8px 12px' }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center flex-1 transition-all duration-200 active:scale-95 focus-visible:outline-none ${
                isActive ? 'text-accent' : 'text-text-secondary'
              }`}
            >
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.2 : 1.8} aria-hidden="true" />
                {tab.id === 'cart' && cartCount > 0 && (
                  <span
                    className="bg-red-500 text-white font-bold rounded-full flex items-center justify-center"
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -8,
                      width: 16,
                      height: 16,
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                    aria-label={`${cartCount} товаров в корзине`}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-medium" style={{ fontSize: 11, marginTop: 3 }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
