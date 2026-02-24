'use client';
import { useState, useEffect } from 'react';
import type { TxData } from '../lib/types';

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export default function TransactionRow({ tx, delay, isNew }: { tx: TxData; delay: number; isNew?: boolean }) {
  const [highlight, setHighlight] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const animClass = highlight ? 'animate-slide-in-left' : 'animate-fade-in-up';
  const bgStyle = highlight
    ? 'linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,255,136,0.03))'
    : undefined;

  return (
    <div
      className={`tx-row flex items-center justify-between py-4 px-5 ${animClass} group transition-all duration-300`}
      style={{ animationDelay: highlight ? '0ms' : `${delay}ms`, borderBottom: '1px solid rgba(0,240,255,0.08)', background: bgStyle }}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center relative transition-all duration-300 group-hover:scale-110${highlight ? ' animate-live-pulse' : ''}`}
          style={{
            background: highlight
              ? 'linear-gradient(135deg, rgba(0,255,136,0.25), rgba(0,255,136,0.12))'
              : 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.08))',
            border: `1px solid rgba(0,255,136,${highlight ? '0.4' : '0.2'})`,
            boxShadow: highlight
              ? '0 0 25px rgba(0,255,136,0.2), 0 4px 12px rgba(0,0,0,0.2)'
              : '0 0 20px rgba(0,255,136,0.1), 0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          <div className="absolute inset-0 rounded-xl opacity-50" style={{ background: 'radial-gradient(circle at top, rgba(0,255,136,0.3), transparent)' }} />
          <span style={{ color: '#00ff88', fontSize: '18px', fontWeight: 'bold' }} className="relative z-10">
            {highlight ? '+' : '✓'}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold mb-0.5 transition-colors group-hover:text-cyan-300" style={{ color: 'rgba(224,228,240,0.85)' }}>{tx.service}</p>
          <a
            href={`https://sepolia.basescan.org/tx/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="blockchain-link text-[10px] font-mono"
            style={{ color: 'rgba(0,240,255,0.6)' }}
          >
            {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
          </a>
        </div>
      </div>
      <div className="text-right">
        <p className="text-base font-mono font-black text-glow-green mb-0.5" style={{ color: '#00ff88', letterSpacing: '-0.01em' }}>
          +{tx.amount} ATIP
        </p>
        <p className="text-[10px] font-mono" style={{ color: 'rgba(224,228,240,0.35)' }}>{timeAgo(tx.timestamp)}</p>
      </div>
    </div>
  );
}
