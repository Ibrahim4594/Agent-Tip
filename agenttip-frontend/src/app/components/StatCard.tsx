import AnimatedCounter from './AnimatedCounter';
import { COLORS } from '../lib/constants';
import Image from 'next/image';

const ICON_PATHS = {
  wallet: '/icons/wallet.png',
  award: '/icons/trophey.png',
  check: '/icons/check.png',
  layers: '/icons/layers.png'
};

export default function StatCard({ label, value, suffix, icon, color, delay }: {
  label: string; value: number; suffix?: string; icon: 'wallet' | 'award' | 'check' | 'layers'; color: string; delay: number;
}) {
  const c = COLORS[color as keyof typeof COLORS] || COLORS.cyan;
  return (
    <div className="panel rounded-2xl p-6 corner-accent animate-fade-in-up group transition-all duration-500" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-mono uppercase tracking-[0.15em] font-semibold" style={{ color: 'rgba(224,228,240,0.5)' }}>{label}</span>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center relative transition-all duration-500 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${c.text}18, ${c.text}08)`,
            boxShadow: `0 0 35px ${c.text}25, 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 ${c.text}15`,
            border: `1px solid ${c.text}20`
          }}
        >
          <div className="absolute inset-0 rounded-2xl opacity-50" style={{ background: `radial-gradient(circle at top, ${c.text}20, transparent)` }} />
          <Image
            src={ICON_PATHS[icon]}
            alt={label}
            width={44}
            height={44}
            className="relative z-10 transition-transform duration-500 group-hover:scale-110"
            style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))' }}
          />
        </div>
      </div>
      <div className={`text-4xl font-black font-mono stat-value ${c.glow} transition-all duration-300`} style={{ color: c.text, letterSpacing: '-0.03em' }}>
        <AnimatedCounter target={value} suffix={suffix || ''} />
      </div>
      <div className="mt-5 h-[3px] rounded-full relative overflow-hidden" style={{ background: `rgba(${c.text === '#00f0ff' ? '0,240,255' : c.text === '#ff00aa' ? '255,0,170' : c.text === '#00ff88' ? '0,255,136' : '255,170,0'},0.1)` }}>
        <div className="absolute inset-0 rounded-full transition-all duration-1000 group-hover:w-full" style={{ width: '40%', background: `linear-gradient(90deg, ${c.text}, ${c.text}80)`, boxShadow: `0 0 10px ${c.text}` }} />
      </div>
    </div>
  );
}
