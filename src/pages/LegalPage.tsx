import { ChevronLeft, CreditCard, RotateCcw, Clock, Building2, Shield } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#1C1C1E',
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.08)',
        padding: 16,
      }}
    >
      <div className="flex items-center" style={{ gap: 10, marginBottom: 12 }}>
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(255, 107, 0, 0.12)',
          }}
        >
          {icon}
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF', margin: 0 }}>{title}</h3>
      </div>
      <div style={{ fontSize: 13, color: '#C7C7CC', lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

export function LegalPage({ onBack }: LegalPageProps) {
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
      <button
        onClick={onBack}
        className="active:scale-[0.97] transition-transform flex items-center"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
          marginBottom: 16,
          gap: 6,
        }}
      >
        <ChevronLeft style={{ width: 20, height: 20, color: '#FF6B00' }} strokeWidth={2} />
        <span style={{ fontSize: 15, color: '#FF6B00', fontWeight: 500 }}>Назад</span>
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
        Юридическая информация
      </h1>
      <p style={{ fontSize: 13, color: '#8A8A8E', marginBottom: 20 }}>
        Условия оплаты, возврата и обработки персональных данных
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SectionCard
          icon={<CreditCard style={{ width: 18, height: 18, color: '#FF6B00' }} strokeWidth={1.8} />}
          title="Оплата банковской картой"
        >
          <p style={{ margin: 0, marginBottom: 8 }}>
            Оплата заказов осуществляется онлайн с использованием банковских карт платёжных систем
            <strong style={{ color: '#FFFFFF' }}> МИР, Visa, Mastercard</strong>, а также через
            <strong style={{ color: '#FFFFFF' }}> Систему быстрых платежей (СБП)</strong>.
          </p>
          <p style={{ margin: 0 }}>
            Безопасность платежей обеспечивается защищённым протоколом передачи данных SSL/TLS
            и технологией 3D-Secure. Данные банковских карт <strong style={{ color: '#FFFFFF' }}>не сохраняются</strong> в
            приложении и передаются напрямую платёжному провайдеру.
          </p>
        </SectionCard>

        <SectionCard
          icon={<Clock style={{ width: 18, height: 18, color: '#FF6B00' }} strokeWidth={1.8} />}
          title="Условия выдачи и отмены заказа"
        >
          <p style={{ margin: 0, marginBottom: 8 }}>
            Заказ выдается способом <strong style={{ color: '#FFFFFF' }}>самовывоза</strong> по адресу:
            ул. Мичурина, 12, к указанному времени готовности.
          </p>
          <p style={{ margin: 0 }}>
            Заказ может быть отменён пользователем до момента начала его приготовления.
            После начала приготовления отмена заказа невозможна.
          </p>
        </SectionCard>

        <SectionCard
          icon={<RotateCcw style={{ width: 18, height: 18, color: '#FF6B00' }} strokeWidth={1.8} />}
          title="Политика возврата средств"
        >
          <p style={{ margin: 0, marginBottom: 8 }}>
            В случае отмены заказа до момента начала его приготовления или отказа заведения
            в выполнении заказа денежные средства возвращаются в <strong style={{ color: '#FFFFFF' }}>полном объёме</strong> на
            банковскую карту, с которой была совершена оплата.
          </p>
          <p style={{ margin: 0 }}>
            Срок возврата — от <strong style={{ color: '#FFFFFF' }}>1 до 3 рабочих дней</strong> в зависимости
            от банка-эмитента.
          </p>
        </SectionCard>

        <SectionCard
          icon={<Shield style={{ width: 18, height: 18, color: '#FF6B00' }} strokeWidth={1.8} />}
          title="Политика конфиденциальности"
        >
          <p style={{ margin: 0, marginBottom: 8 }}>
            Мы собираем только необходимые данные для обработки заказов: имя пользователя Telegram,
            идентификатор аккаунта и историю заказов.
          </p>
          <p style={{ margin: 0 }}>
            Персональные данные <strong style={{ color: '#FFFFFF' }}>не передаются третьим лицам</strong>,
            за исключением случаев, предусмотренных законодательством РФ.
            Данные используются исключительно для исполнения обязательств перед клиентом.
          </p>
        </SectionCard>

        <SectionCard
          icon={<Building2 style={{ width: 18, height: 18, color: '#FF6B00' }} strokeWidth={1.8} />}
          title="Реквизиты организации"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <span style={{ fontSize: 12, color: '#8A8A8E', display: 'block', marginBottom: 2 }}>
                Организационно-правовая форма
              </span>
              <span style={{ color: '#FFFFFF' }}>ИП / ООО — (указать при регистрации)</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
              <span style={{ fontSize: 12, color: '#8A8A8E', display: 'block', marginBottom: 2 }}>
                ИНН
              </span>
              <span style={{ color: '#FFFFFF' }}>— (указать при регистрации)</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
              <span style={{ fontSize: 12, color: '#8A8A8E', display: 'block', marginBottom: 2 }}>
                ОГРНИП / ОГРН
              </span>
              <span style={{ color: '#FFFFFF' }}>— (указать при регистрации)</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
              <span style={{ fontSize: 12, color: '#8A8A8E', display: 'block', marginBottom: 2 }}>
                Контактный телефон
              </span>
              <span style={{ color: '#FFFFFF' }}>— (указать при регистрации)</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
              <span style={{ fontSize: 12, color: '#8A8A8E', display: 'block', marginBottom: 2 }}>
                Email для обращений
              </span>
              <span style={{ color: '#FFFFFF' }}>— (указать при регистрации)</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
              <span style={{ fontSize: 12, color: '#8A8A8E', display: 'block', marginBottom: 2 }}>
                Фактический адрес кухни
              </span>
              <span style={{ color: '#FFFFFF' }}>ул. Мичурина, 12</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={<Shield style={{ width: 18, height: 18, color: '#FF6B00' }} strokeWidth={1.8} />}
          title="Публичная оферта"
        >
          <p style={{ margin: 0, marginBottom: 8 }}>
            Настоящие условия являются публичной офертой в соответствии со ст. 437 ГК РФ.
            Оформление заказа означает акцепт оферты.
          </p>
          <p style={{ margin: 0 }}>
            Исполнитель оставляет за собой право изменять условия оферты в одностороннем порядке
            с предварительным уведомлением через приложение.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
