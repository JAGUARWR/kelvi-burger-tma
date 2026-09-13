import { User, Phone, MapPin, Settings, ChevronRight } from 'lucide-react';
import { Header } from '../components/layout/Header';

const profileMenuItems = [
  { icon: Phone, label: '+7 (999) 123-45-67', subtitle: 'Телефон' },
  { icon: MapPin, label: 'ул. Примерная, 123', subtitle: 'Адрес доставки' },
  { icon: Settings, label: 'Настройки', subtitle: '' },
];

export function ProfilePage() {
  return (
    <div className="pb-[70px] animate-fade-slide-in flex flex-col">
      <Header />
      <div className="px-4 pt-5 flex flex-col gap-5">
        <div className="bg-card-bg rounded-2xl p-6 border border-border text-center">
          <div className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-3">
            <User className="w-9 h-9 text-accent" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-0.5">Гость</h2>
          <p className="text-sm text-text-secondary">Добро пожаловать в КЭЛВИ</p>
        </div>

        <div className="space-y-2">
          {profileMenuItems.map(({ icon: Icon, label, subtitle }) => (
            <button
              key={label}
              onClick={() => window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')}
              className="w-full bg-card-bg rounded-2xl px-4 py-3.5 border border-border flex items-center gap-3 active:scale-[0.98] transition-transform min-h-[56px] focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0" aria-hidden="true">
                <Icon className="w-5 h-5 text-accent" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <span className="text-sm font-medium text-text-primary block">{label}</span>
                {subtitle && (
                  <span className="text-[11px] text-text-secondary">{subtitle}</span>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" strokeWidth={1.8} aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-text-secondary">
            Самовывоз из ресторана КЭЛВИ
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Ежедневно с 10:00 до 22:00
          </p>
        </div>
      </div>
    </div>
  );
}
