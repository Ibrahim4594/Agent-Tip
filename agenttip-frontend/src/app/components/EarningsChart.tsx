'use client';
import { useMemo } from 'react';
import type { TxData } from '../lib/types';

const BAR_COLORS = ['#00f0ff', '#ff00aa', '#00ff88', '#ffaa00'];

export default function EarningsChart({ transactions }: { transactions: TxData[] }) {
  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    transactions.forEach(tx => {
      grouped[tx.service] = (grouped[tx.service] || 0) + tx.amount;
    });
    const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...entries.map(e => e[1]), 1);
    return entries.map(([name, total]) => ({ name, total, pct: (total / max) * 100 }));
  }, [transactions]);

  return (
    <div className="panel rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
      <h3 className="text-xs font-mono uppercase tracking-[0.15em] mb-4" style={{ color: 'rgba(224,228,240,0.4)' }}>
        Earnings by Service
      </h3>
      <div className="space-y-3">
        {chartData.map((d, i) => (
          <div key={d.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] truncate mr-2" style={{ color: 'rgba(224,228,240,0.6)' }}>{d.name}</span>
              <span className="text-xs font-mono font-semibold" style={{ color: BAR_COLORS[i % BAR_COLORS.length] }}>{d.total} ATIP</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,240,255,0.06)' }}>
              <div
                className="h-full rounded-full chart-bar-enter"
                style={{
                  width: `${d.pct}%`,
                  background: `linear-gradient(90deg, ${BAR_COLORS[i % BAR_COLORS.length]}, ${BAR_COLORS[i % BAR_COLORS.length]}88)`,
                  boxShadow: `0 0 8px ${BAR_COLORS[i % BAR_COLORS.length]}44`,
                  animationDelay: `${i * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {chartData.length === 0 && (
        <p className="text-xs text-center py-4" style={{ color: 'rgba(224,228,240,0.3)' }}>No earnings data yet</p>
      )}
    </div>
  );
}
