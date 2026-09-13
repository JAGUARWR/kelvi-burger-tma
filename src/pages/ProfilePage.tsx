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
      <div className="px-4 pt-5 flex flex-col">
        <div
          className="flex flex-col items-center justify-center text-center"
          style={{
            background: '#1C1C1E',
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(255, 107, 0, 0.15)',
              border: '1.5px solid rgba(255, 107, 0, 0.4)',
            }}
          >
            <User style={{ width: 32, height: 32, color: '#FF6B00' }} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginTop: 10 }}>
            Гость
          </h2>
          <p style={{ fontSize: 12, color: '#8A8A8E', marginTop: 4 }}>
            Добро пожаловать в КЭЛВИ
          </p>
        </div>

        <div className="flex flex-col" style={{ gap: 10 }}>
          {profileMenuItems.map(({ icon: Icon, label, subtitle }) => (
            <button
              key={label}
              onClick={() => window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')}
              className="flex items-center justify-between active:scale-[0.98] transition-transform focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none"
              style={{
                background: '#1C1C1E',
                borderRadius: 16,
                padding: '12px 16px',
                minHeight: 56,
              }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(255, 107, 0, 0.12)',
                }}
                aria-hidden="true"
              >
                <Icon style={{ width: 20, height: 20, color: '#FF6B00' }} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0 text-left" style={{ marginLeft: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#FFFFFF', display: 'block' }}>
                  {label}
                </span>
                {subtitle && (
                  <span style={{ fontSize: 11, color: '#8A8A8E' }}>{subtitle}</span>
                )}
              </div>
              <ChevronRight
                style={{ width: 16, height: 16, color: '#636366', flexShrink: 0 }}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>

        <div
          className="text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 14,
            padding: 12,
            marginTop: 20,
          }}
        >
          <p style={{ fontSize: 12, color: '#8A8A8E' }}>
            Самовывоз из ресторана КЭЛВИ
          </p>
          <p style={{ fontSize: 12, color: '#8A8A8E', marginTop: 2 }}>
            Ежедневно с 10:00 до 22:00
          </p>
        </div>
      </div>
    </div>
  );
}
