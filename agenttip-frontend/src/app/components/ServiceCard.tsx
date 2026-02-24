'use client';
import { useState } from 'react';
import type { ServiceData } from '../lib/types';

export default function ServiceCard({ service, delay, onPurchase }: {
  service: ServiceData; delay: number; onPurchase: (id: number) => void;
}) {
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    setPurchasing(true);
    await onPurchase(service.id);
    setTimeout(() => setPurchasing(false), 1000);
  };

  return (
    <div className="panel rounded-2xl p-6 service-card corner-accent animate-fade-in-up group" style={{ animationDelay: `${delay}ms` }}>
      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-70" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.6), rgba(255,0,170,0.4), transparent)' }} />

      <div className="flex items-start justify-between mb-4">
        <h3 className="font-bold text-base tracking-tight" style={{ color: 'rgba(224,228,240,0.95)' }}>{service.name}</h3>
        <span className="tag px-3 py-1.5 font-bold" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.08))', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)', boxShadow: '0 0 15px rgba(0,255,136,0.15)' }}>
          {service.status}
        </span>
      </div>

      <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(224,228,240,0.5)' }}>{service.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-glow-cyan" style={{ color: '#00f0ff', letterSpacing: '-0.02em' }}>{service.price}</span>
          <span className="text-xs font-mono font-semibold" style={{ color: 'rgba(224,228,240,0.4)' }}>ATIP</span>
        </div>
        <button
          onClick={handlePurchase}
          disabled={purchasing}
          className="text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 px-4 py-2 rounded-lg relative overflow-hidden"
          style={{
            color: purchasing ? '#00ff88' : '#ff00aa',
            background: purchasing
              ? 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.1))'
              : 'linear-gradient(135deg, rgba(255,0,170,0.12), rgba(255,0,170,0.06))',
            border: `1.5px solid ${purchasing ? 'rgba(0,255,136,0.4)' : 'rgba(255,0,170,0.3)'}`,
            boxShadow: purchasing
              ? '0 0 20px rgba(0,255,136,0.2), 0 4px 12px rgba(0,0,0,0.2)'
              : '0 0 20px rgba(255,0,170,0.15), 0 4px 12px rgba(0,0,0,0.2)',
            transform: purchasing ? 'scale(0.98)' : 'scale(1)'
          }}
        >
          {purchasing ? 'COMPLETED' : 'PURCHASE'}
        </button>
      </div>

      {service.completions > 0 && (
        <div className="mt-4 pt-3 text-[11px] font-mono font-semibold" style={{ color: 'rgba(224,228,240,0.3)', borderTop: '1px solid rgba(0,240,255,0.06)' }}>
          ⚡ {service.completions} completed
        </div>
      )}
    </div>
  );
}
