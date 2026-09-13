import { useState } from 'react';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { useCartStore } from './store/cartStore';
import { useTelegram } from './hooks/useTelegram';

type Tab = 'home' | 'cart' | 'orders' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { getItemCount } = useCartStore();
  useTelegram(activeTab, setActiveTab);

  const goHome = () => setActiveTab('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'cart':
        return <CartPage onNavigateHome={goHome} />;
      case 'orders':
        return <OrdersPage onNavigateHome={goHome} />;
      case 'profile':
        return <ProfilePage />;
    }
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Перейти к содержимому
      </a>
      <main id="main-content" className="flex-1">
        {renderPage()}
      </main>
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={getItemCount()}
      />
    </div>
  );
}

export default App;
