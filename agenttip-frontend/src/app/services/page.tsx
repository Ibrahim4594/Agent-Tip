'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAgentData } from '../hooks/useAgentData';
import AppShell from '../components/AppShell';
import ServiceCard from '../components/ServiceCard';
import AnimatedCounter from '../components/AnimatedCounter';
import { SkeletonCard } from '../components/SkeletonLoader';

type Filter = 'all' | 'popular' | 'cheapest';

export default function ServicesPage() {
  const { agent, services, apiOnline, loading, notification, purchaseService } = useAgentData();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => { setMounted(true); }, []);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'popular': return [...services].sort((a, b) => b.completions - a.completions);
      case 'cheapest': return [...services].sort((a, b) => a.price - b.price);
      default: return services;
    }
  }, [services, filter]);

  const totalEarned = useMemo(() => services.reduce((acc, s) => acc + s.price * s.completions, 0), [services]);

  if (!mounted) return null;

  return (
    <AppShell apiOnline={apiOnline} network={agent?.network || 'Base Sepolia'}>
      {/* Notification toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in-up panel rounded-xl px-5 py-3" style={{ border: '1px solid rgba(0,255,136,0.3)', boxShadow: '0 0 30px rgba(0,255,136,0.15)' }}>
          <p className="text-sm font-mono" style={{ color: '#00ff88' }}>{notification}</p>
        </div>
      )}

      {/* Hero */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Service <span className="text-glow-cyan" style={{ color: '#00f0ff' }}>Marketplace</span>
        </h1>
        <p className="text-sm" style={{ color: 'rgba(224,228,240,0.4)' }}>Browse and purchase AI agent services. Pay with ATIP tokens.</p>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="panel rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'rgba(224,228,240,0.3)' }}>Total Services</span>
          <p className="text-2xl font-bold font-mono text-glow-cyan mt-1" style={{ color: '#00f0ff' }}>{services.length}</p>
        </div>
        <div className="panel rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'rgba(224,228,240,0.3)' }}>Total Earned</span>
          <p className="text-2xl font-bold font-mono text-glow-green mt-1" style={{ color: '#00ff88' }}>
            <AnimatedCounter target={totalEarned} suffix=" ATIP" />
          </p>
        </div>
        <div className="panel rounded-xl p-4 animate-fade-in-up hidden sm:block" style={{ animationDelay: '300ms' }}>
          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'rgba(224,228,240,0.3)' }}>Agent Reputation</span>
          <p className="text-2xl font-bold font-mono text-glow-magenta mt-1" style={{ color: '#ff00aa' }}>{agent?.reputation || 100}/100</p>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex items-center gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
        {(['all', 'popular', 'cheapest'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all"
            style={{
              background: filter === f ? 'rgba(0,240,255,0.12)' : 'rgba(0,240,255,0.03)',
              color: filter === f ? '#00f0ff' : 'rgba(224,228,240,0.4)',
              border: `1px solid ${filter === f ? 'rgba(0,240,255,0.3)' : 'rgba(0,240,255,0.08)'}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Service Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => (
            <ServiceCard key={s.id} service={s} delay={400 + i * 100} onPurchase={purchaseService} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
