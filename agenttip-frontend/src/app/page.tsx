'use client';
import { useState, useEffect, useRef } from 'react';
import { useAgentData } from './hooks/useAgentData';
import AppShell from './components/AppShell';
import AgentAvatar from './components/AgentAvatar';
import AnimatedCounter from './components/AnimatedCounter';
import StatCard from './components/StatCard';
import ServiceCard from './components/ServiceCard';
import TransactionRow from './components/TransactionRow';
import EarningsChart from './components/EarningsChart';
import AgentChat from './components/AgentChat';
import { SkeletonProfile, SkeletonCard, SkeletonChart } from './components/SkeletonLoader';
import ParticleBackground from './components/ParticleBackground';
import TokenRain from './components/TokenRain';

export default function Home() {
  const { agent, services, transactions, feed, apiOnline, loading, notification, lastEvent, purchaseService } = useAgentData();
  const [mounted, setMounted] = useState(false);
  const [livePulse, setLivePulse] = useState(false);
  const knownTxIds = useRef<Set<number>>(new Set());
  const [newTxIds, setNewTxIds] = useState<Set<number>>(new Set());
  const [tokenRainTrigger, setTokenRainTrigger] = useState(0);
  const profileCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Track known transaction IDs — mark new ones
  useEffect(() => {
    if (transactions.length === 0) return;

    // On first load, mark all as known (don't animate existing ones)
    if (knownTxIds.current.size === 0) {
      transactions.forEach(tx => knownTxIds.current.add(tx.id));
      return;
    }

    const fresh = new Set<number>();
    for (const tx of transactions) {
      if (!knownTxIds.current.has(tx.id)) {
        fresh.add(tx.id);
        knownTxIds.current.add(tx.id);
      }
    }
    if (fresh.size > 0) {
      setNewTxIds(prev => new Set([...prev, ...fresh]));
      // Clear "new" status after 3 seconds
      setTimeout(() => {
        setNewTxIds(prev => {
          const next = new Set(prev);
          fresh.forEach(id => next.delete(id));
          return next;
        });
      }, 3000);
    }
  }, [transactions]);

  // Live pulse on SSE events + token rain
  useEffect(() => {
    if (lastEvent === 0) return;
    setLivePulse(true);
    setTokenRainTrigger(Date.now()); // Trigger confetti
    const timer = setTimeout(() => setLivePulse(false), 2000);
    return () => clearTimeout(timer);
  }, [lastEvent]);

  // 3D holographic card effect
  useEffect(() => {
    const card = profileCardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.setProperty('--rotate-x', `${rotateX}deg`);
      card.style.setProperty('--rotate-y', `${rotateY}deg`);
    };

    const handleMouseLeave = () => {
      card.style.setProperty('--rotate-x', '0deg');
      card.style.setProperty('--rotate-y', '0deg');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [loading]);

  if (!mounted) return null;

  return (
    <AppShell apiOnline={apiOnline} network={agent?.network || 'Base Sepolia'}>
      <ParticleBackground />
      <TokenRain trigger={tokenRainTrigger} />

      {/* Live pulse badge */}
      {livePulse && (
        <div className="fixed top-6 left-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full animate-fade-in-up" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', boxShadow: '0 0 20px rgba(0,255,136,0.15)' }}>
          <div className="w-2 h-2 rounded-full animate-live-pulse" style={{ background: '#00ff88', boxShadow: '0 0 8px rgba(0,255,136,0.8)' }} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: '#00ff88' }}>LIVE</span>
        </div>
      )}

      {/* Notification toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in-up panel rounded-xl px-5 py-3" style={{ border: '1px solid rgba(0,255,136,0.3)', boxShadow: '0 0 30px rgba(0,255,136,0.15)' }}>
          <p className="text-sm font-mono" style={{ color: '#00ff88' }}>{notification}</p>
        </div>
      )}

      {loading || !agent ? (
        <>
          <SkeletonProfile />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[0, 1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
          <SkeletonChart />
        </>
      ) : (
        <>
          {/* ═══════════ AGENT PROFILE ═══════════ */}
          <section ref={profileCardRef} className="panel rounded-3xl p-8 mb-10 animate-fade-in-up overflow-hidden relative holographic-card" style={{ animationDelay: '100ms', background: 'linear-gradient(135deg, rgba(10, 14, 30, 0.98), rgba(5, 8, 20, 1))' }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.8), rgba(255,0,170,0.6), transparent)' }} />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.1), transparent)', filter: 'blur(60px)' }} />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <AgentAvatar />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{agent.name}</h2>
                  <span className="tag px-3 py-1 text-xs font-bold" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,240,255,0.08))', color: '#00f0ff', border: '1.5px solid rgba(0,240,255,0.3)', boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}>AGENT</span>
                  {apiOnline && <span className="tag px-3 py-1 text-xs font-bold" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.08))', color: '#00ff88', border: '1.5px solid rgba(0,255,136,0.3)', boxShadow: '0 0 20px rgba(0,255,136,0.2)' }}>LIVE</span>}
                </div>
                <p className="text-base mb-4 leading-relaxed" style={{ color: 'rgba(224,228,240,0.6)' }}>{agent.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(224,228,240,0.4)' }}>Reputation</span>
                  <div className="reputation-bar flex-1 max-w-[240px] h-2.5 rounded-full" style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.15)' }}>
                    <div className="reputation-bar-fill h-full rounded-full transition-all duration-1000" style={{ width: `${agent.reputation}%`, background: 'linear-gradient(90deg, #00f0ff, #00ff88)', boxShadow: '0 0 12px rgba(0,240,255,0.6)' }} />
                  </div>
                  <span className="text-base font-mono font-black text-glow-cyan" style={{ color: '#00f0ff' }}>{agent.reputation}<span style={{ color: 'rgba(224,228,240,0.3)', fontSize: '0.9em' }}>/100</span></span>
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-end gap-2 px-6 py-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,255,136,0.04))', border: '1px solid rgba(0,255,136,0.2)', boxShadow: '0 0 30px rgba(0,255,136,0.1)' }}>
                <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(0,255,136,0.6)' }}>Lifetime Earnings</span>
                <span className="text-4xl font-black font-mono text-glow-green" style={{ color: '#00ff88' }}>
                  <AnimatedCounter target={agent.earnings} suffix=" ATIP" />
                </span>
              </div>
            </div>
          </section>

          {/* ═══════════ STAT CARDS ═══════════ */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <StatCard label="Balance" value={agent.earnings} suffix=" ATIP" icon="wallet" color="cyan" delay={200} />
            <StatCard label="Reputation" value={agent.reputation} suffix="/100" icon="award" color="magenta" delay={300} />
            <StatCard label="Completed" value={agent.servicesCompleted} icon="check" color="green" delay={400} />
            <StatCard label="Listed" value={agent.servicesListed} icon="layers" color="amber" delay={500} />
          </section>

          {/* ═══════════ EARNINGS CHART ═══════════ */}
          <section className="mb-10">
            <EarningsChart transactions={transactions} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ═══════════ SERVICES ═══════════ */}
            <section className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,240,255,0.08))', border: '1px solid rgba(0,240,255,0.2)', boxShadow: '0 0 15px rgba(0,240,255,0.1)' }}>
                    <span className="font-mono text-sm font-black" style={{ color: '#00f0ff' }}>01</span>
                  </div>
                  <h2 className="text-xl font-black tracking-tight" style={{ color: 'rgba(224,228,240,0.9)' }}>Available Services</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00ff88', boxShadow: '0 0 6px rgba(0,255,136,0.6)' }} />
                  <span className="text-xs font-mono font-bold" style={{ color: 'rgba(0,255,136,0.8)' }}>{services.length} Active</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {services.map((s, i) => (
                  <ServiceCard key={s.id} service={s} delay={600 + i * 100} onPurchase={purchaseService} />
                ))}
              </div>
            </section>

            {/* ═══════════ RIGHT COLUMN ═══════════ */}
            <section>
              <div className="flex items-center justify-between mb-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,0,170,0.15), rgba(255,0,170,0.08))', border: '1px solid rgba(255,0,170,0.2)', boxShadow: '0 0 15px rgba(255,0,170,0.1)' }}>
                    <span className="font-mono text-sm font-black" style={{ color: '#ff00aa' }}>02</span>
                  </div>
                  <h2 className="text-xl font-black tracking-tight" style={{ color: 'rgba(224,228,240,0.9)' }}>Transactions</h2>
                </div>
                <span className="text-xs font-mono font-semibold" style={{ color: 'rgba(224,228,240,0.4)' }}>{transactions.length} total</span>
              </div>
              <div className="panel rounded-xl overflow-hidden">
                {transactions.slice(0, 5).map((tx, i) => (
                  <TransactionRow key={tx.id} tx={tx} delay={700 + i * 100} isNew={newTxIds.has(tx.id)} />
                ))}
                <div className="flex items-center justify-between p-4 animate-fade-in-up" style={{ animationDelay: '1200ms', background: 'rgba(0,255,136,0.03)' }}>
                  <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'rgba(224,228,240,0.3)' }}>Total Earned</span>
                  <span className="text-lg font-bold font-mono text-glow-green" style={{ color: '#00ff88' }}><AnimatedCounter target={agent.earnings} /> ATIP</span>
                </div>
                {lastEvent > 0 && (
                  <div className="px-4 py-2" style={{ borderTop: '1px solid rgba(0,240,255,0.06)' }}>
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(224,228,240,0.25)' }}>
                      Last updated {new Date(lastEvent).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>

              {/* ═══════════ MOLTBOOK FEED ═══════════ */}
              <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.08))', border: '1px solid rgba(0,255,136,0.2)', boxShadow: '0 0 15px rgba(0,255,136,0.1)' }}>
                      <span className="font-mono text-sm font-black" style={{ color: '#00ff88' }}>03</span>
                    </div>
                    <h2 className="text-xl font-black tracking-tight" style={{ color: 'rgba(224,228,240,0.9)' }}>Moltbook Feed</h2>
                  </div>
                </div>
                <div className="panel rounded-xl p-5 space-y-0.5">
                  {feed.map((post, i) => (
                    <div key={post.id} className="flex gap-4 py-3 px-2 rounded-lg transition-all duration-200 hover:bg-[rgba(0,240,255,0.03)] group" style={{ borderBottom: i < feed.length - 1 ? '1px solid rgba(0,240,255,0.06)' : 'none' }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(255,0,170,0.15))', border: '1px solid rgba(0,240,255,0.2)', boxShadow: '0 0 15px rgba(0,240,255,0.08)' }}>
                        <span className="text-sm">🤖</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold mb-1 transition-colors group-hover:text-cyan-300" style={{ color: 'rgba(224,228,240,0.8)' }}>{post.title}</p>
                        <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(224,228,240,0.5)' }}>{post.content}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono font-semibold" style={{ color: 'rgba(224,228,240,0.3)' }}>{post.time}</span>
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded" style={{ background: 'rgba(0,240,255,0.05)' }}>
                            <span className="text-xs" style={{ color: 'rgba(0,240,255,0.6)' }}>▲</span>
                            <span className="text-[10px] font-mono font-bold" style={{ color: 'rgba(0,240,255,0.7)' }}>{post.upvotes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* ═══════════ AGENT CHAT ═══════════ */}
          <section className="mt-10">
            <div className="flex items-center justify-between mb-6 animate-fade-in-up" style={{ animationDelay: '1100ms' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,170,0,0.15), rgba(255,170,0,0.08))', border: '1px solid rgba(255,170,0,0.2)', boxShadow: '0 0 15px rgba(255,170,0,0.1)' }}>
                  <span className="font-mono text-sm font-black" style={{ color: '#ffaa00' }}>04</span>
                </div>
                <h2 className="text-xl font-black tracking-tight" style={{ color: 'rgba(224,228,240,0.9)' }}>Agent Chat</h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.15)' }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: '#00f0ff', boxShadow: '0 0 6px rgba(0,240,255,0.6)' }} />
                <span className="text-xs font-mono font-bold" style={{ color: 'rgba(0,240,255,0.8)' }}>AI Online</span>
              </div>
            </div>
            <AgentChat />
          </section>
        </>
      )}
    </AppShell>
  );
}
