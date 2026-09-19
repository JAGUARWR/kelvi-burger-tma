import { useEffect } from 'react';
import { User, MapPin, Flame } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { useUserStore } from '../store/userStore';

function getDisplayName(): string {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (tgUser?.username) return `@${tgUser.username}`;
  if (tgUser?.first_name) return tgUser.first_name;
  if (tgUser?.id) return String(tgUser.id);
  return 'Гость';
}

export function ProfilePage() {
  const { profile, loading, loadProfile } = useUserStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const displayName = profile?.username
    ? `@${profile.username}`
    : profile?.first_name ?? getDisplayName();
  const bonusBalance = profile?.bonus_balance ?? profile?.bonusBalance ?? 200;

  return (
    <div
      className="animate-fade-slide-in flex flex-col"
      style={{
        minHeight: 'calc(100vh - 80px)',
        paddingBottom: 90,
      }}
    >
      <Header />
      <div className="pt-5 flex flex-col flex-1" style={{ paddingLeft: 16, paddingRight: 16 }}>
        {/* User card */}
        <div
          className="flex flex-col items-center text-center"
          style={{
            background: '#1C1C1E',
            borderRadius: 20,
            padding: '18px 16px',
            marginBottom: 14,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(255, 107, 0, 0.12)',
            }}
          >
            <User style={{ width: 27, height: 27, color: '#FF6B00' }} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginTop: 8, marginBottom: 2 }}>
            {loading ? '...' : displayName}
          </h2>
          <p style={{ fontSize: 12, color: '#8A8A8E', margin: 0 }}>
            Добро пожаловать в КЭЛВИ
          </p>
        </div>

        {/* Loyalty card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #252528 0%, #1c1c1e 60%, rgba(230, 81, 0, 0.25) 100%)',
            borderRadius: 20,
            border: '1px solid rgba(255, 107, 0, 0.3)',
            padding: '18px 20px',
            marginBottom: 14,
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <span style={{ fontSize: 14, color: '#A0A0A5' }}>КЭЛВИ Баллы</span>
              <span
                style={{
                  background: 'rgba(255, 107, 0, 0.2)',
                  color: '#FF6B00',
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontWeight: 500,
                }}
              >
                5% кэшбэк
              </span>
            </div>
            <Flame style={{ width: 22, height: 22, color: '#FF6B00' }} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF' }}>
            {loading ? '...' : `${bonusBalance} Б`}
          </div>
          <p style={{ fontSize: 12, color: '#8A8A8E', marginTop: 8, margin: 0, lineHeight: 1.4 }}>
            1 Б = 1 ₽ • Копите с заказов и оплачивайте до 50% чека
          </p>
        </div>

        {/* Address card */}
        <div
          style={{
            background: '#1C1C1E',
            borderRadius: 20,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '14px 16px',
          }}
        >
          <div className="flex items-center">
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(255, 107, 0, 0.12)',
              }}
              aria-hidden="true"
            >
              <MapPin style={{ width: 20, height: 20, color: '#FF6B00' }} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0" style={{ marginLeft: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#FFFFFF', display: 'block' }}>
                ул. Мичурина, 12
              </span>
              <span style={{ fontSize: 11, color: '#8A8A8E', display: 'block' }}>
                Адрес самовывоза
              </span>
            </div>
          </div>
        </div>

        {/* Info block */}
        <div
          className="text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 14,
            padding: 12,
            marginTop: 'auto',
            border: '1px dashed rgba(255, 255, 255, 0.08)',
          }}
        >
          <p style={{ fontSize: 12, color: '#8A8A8E', lineHeight: 1.4, margin: 0 }}>
            Самовывоз из ресторана КЭЛВИ
          </p>
          <p style={{ fontSize: 12, color: '#8A8A8E', lineHeight: 1.4, marginTop: 2 }}>
            Ежедневно с 10:00 до 22:00
          </p>
        </div>
      </div>
    </div>
  );
}
