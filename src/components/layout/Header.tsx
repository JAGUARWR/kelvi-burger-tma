export function Header() {
  return (
    <header className="sticky top-0 z-50" style={{ background: '#0F0F12' }}>
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
          className="h-7 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,107,0,0.3)]"
        />
      </div>
    </header>
  );
}
