export default function Footer() {
  return (
    <footer className="mt-16 pb-10 text-center animate-fade-in-up" style={{ animationDelay: '1300ms' }}>
      <div className="relative mb-8">
        <div className="h-[2px] mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.2), rgba(255,0,170,0.15), transparent)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 -translate-y-1/2 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.08), transparent)', filter: 'blur(40px)' }} />
      </div>
      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl mb-3" style={{ background: 'linear-gradient(135deg, rgba(10,14,30,0.6), rgba(5,8,20,0.8))', border: '1px solid rgba(0,240,255,0.1)', backdropFilter: 'blur(10px)' }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: '#00ff88', boxShadow: '0 0 10px rgba(0,255,136,0.6)' }} />
        <p className="text-xs font-mono font-bold tracking-[0.15em] uppercase" style={{ color: 'rgba(224,228,240,0.4)' }}>
          AgentTip — Moltbook × SURGE Hackathon
        </p>
      </div>
      <p className="text-[10px] font-mono tracking-widest" style={{ color: 'rgba(224,228,240,0.25)' }}>
        Powered by Base L2 • Built with Next.js & Solidity
      </p>
    </footer>
  );
}
