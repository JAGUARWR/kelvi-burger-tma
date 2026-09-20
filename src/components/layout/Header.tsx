export function Header() {
  return (
    <header className="sticky top-0 z-50" style={{ background: 'transparent' }}>
      <div
        className="flex items-center justify-center"
        style={{
          padding: '14px 0',
          paddingTop: 'max(14px, env(safe-area-inset-top))',
        }}
      >
        <img
          src="/logo.png"
          alt="КЭЛВИ"
          className="h-8"
          style={{ width: 'auto' }}
        />
      </div>
    </header>
  );
}
