'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
];

export default function NavBar({ connected, address, onConnect, apiOnline, network }: {
  connected: boolean;
  address: string;
  onConnect: () => void;
  apiOnline: boolean;
  network: string;
}) {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between mb-12 animate-fade-in-up relative">
      {/* Subtle glow under header */}
      <div className="absolute -bottom-6 left-0 right-0 h-24 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center top, rgba(0,240,255,0.05), transparent)', filter: 'blur(30px)' }} />

      <div className="flex items-center gap-6 relative z-10">
        <Link href="/" className="flex items-center gap-4 group transition-all">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-2xl transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #00f0ff, #ff00aa)', opacity: 0.9, boxShadow: '0 0 25px rgba(0,240,255,0.3)' }} />
            <div className="absolute rounded-[14px] flex items-center justify-center transition-all duration-300" style={{ inset: 2.5, background: '#05060f' }}>
              <span className="text-xl font-black font-mono text-glow-cyan transition-all duration-300 group-hover:scale-110" style={{ color: '#00f0ff' }}>A</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Agent<span className="text-glow-cyan" style={{ color: '#00f0ff' }}>Tip</span></h1>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold" style={{ color: 'rgba(224,228,240,0.35)' }}>AI Agent Economy</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-2 ml-6">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative"
                style={{
                  color: active ? '#00f0ff' : 'rgba(224,228,240,0.5)',
                  background: active ? 'linear-gradient(135deg, rgba(0,240,255,0.12), rgba(0,240,255,0.06))' : 'transparent',
                  border: active ? '1px solid rgba(0,240,255,0.2)' : '1px solid transparent',
                  boxShadow: active ? '0 0 20px rgba(0,240,255,0.15), 0 4px 12px rgba(0,0,0,0.2)' : 'none',
                  textShadow: active ? '0 0 12px rgba(0,240,255,0.5)' : 'none',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl panel">
          <div className="w-2.5 h-2.5 rounded-full animate-pulse-glow" style={{ background: apiOnline ? '#00ff88' : '#ffaa00', boxShadow: `0 0 10px ${apiOnline ? 'rgba(0,255,136,0.6)' : 'rgba(255,170,0,0.6)'}` }} />
          <span className="text-xs font-mono font-semibold" style={{ color: 'rgba(224,228,240,0.6)' }}>{apiOnline ? 'Live' : 'Demo'}</span>
          <div className="w-[1px] h-3" style={{ background: 'rgba(0,240,255,0.15)' }} />
          <span className="text-xs font-mono font-semibold" style={{ color: 'rgba(224,228,240,0.5)' }}>{network}</span>
        </div>
        {connected ? (
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105" style={{ border: '1.5px solid rgba(0,240,255,0.25)', background: 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(0,240,255,0.04))', boxShadow: '0 0 25px rgba(0,240,255,0.12), 0 4px 12px rgba(0,0,0,0.2)' }}>
            <div className="status-online" />
            <span className="text-sm font-mono font-bold" style={{ color: '#00f0ff' }}>{address.slice(0, 6)}...{address.slice(-4)}</span>
          </div>
        ) : (
          <button onClick={onConnect} className="btn-connect px-7 py-3 rounded-xl text-sm font-bold tracking-wide" style={{ color: '#00f0ff' }}>
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
