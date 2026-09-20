import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initData: string;
  initDataUnsafe: { user?: TelegramUser };
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  onEvent: (event: string, cb: () => void) => void;
  offEvent: (event: string, cb: () => void) => void;
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  sendData: (data: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

type Tab = 'home' | 'cart' | 'orders' | 'profile';

const tabOrder: Tab[] = ['home', 'cart', 'orders', 'profile'];

export function useTelegram(
  activeTab?: Tab,
  setActiveTab?: Dispatch<SetStateAction<Tab>>,
) {
  const tgRef = useRef<TelegramWebApp | null>(null);
  const [user] = useState<TelegramUser | null>(
    () => window.Telegram?.WebApp?.initDataUnsafe?.user ?? null,
  );

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation();
    tg.setHeaderColor('#0F0F12');
    tg.setBackgroundColor('#0F0F12');

    tgRef.current = tg;

    return () => {
      tgRef.current = null;
    };
  }, []);

  useEffect(() => {
    const tg = tgRef.current;
    if (!tg || !setActiveTab) return;

    const handleBack = () => {
      if (!activeTab) return;
      const idx = tabOrder.indexOf(activeTab);
      if (idx > 0) {
        setActiveTab(tabOrder[idx - 1]);
      }
    };

    tg.BackButton.show();
    tg.BackButton.onClick(handleBack);

    return () => {
      tg.BackButton.offClick(handleBack);
      tg.BackButton.hide();
    };
  }, [activeTab, setActiveTab]);

  return { tg: tgRef, user };
}
