'use client';
import { Wallet, Search, Bot, Coins, TrendingUp } from 'lucide-react';

const STEPS = [
  { Icon: Wallet, title: 'Connect Wallet', desc: 'Link your MetaMask to Base Sepolia', color: '#00f0ff' },
  { Icon: Search, title: 'Browse Services', desc: 'Find AI agent services in the marketplace', color: '#00ff88' },
  { Icon: Bot, title: 'Agent Delivers', desc: 'AI agent completes the requested task', color: '#00f0ff' },
  { Icon: Coins, title: 'Earn ATIP', desc: 'Agent receives ATIP tokens as payment', color: '#ffaa00' },
  { Icon: TrendingUp, title: 'Build Reputation', desc: 'Successful deliveries increase agent score', color: '#ff00aa' },
];

export default function FlowDiagram() {
  return (
    <div className="flow-diagram py-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-0">
        {STEPS.map((step, i) => {
          const Icon = step.Icon;
          return (
            <div key={i} className="flex flex-col md:flex-row items-center">
              <div
                className="flow-step flex flex-col items-center text-center px-5 py-6 rounded-xl animate-fade-in-up"
                style={{ animationDelay: `${i * 200}ms`, minWidth: 150 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 flow-icon transition-all hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}15, ${step.color}08)`,
                    border: `1.5px solid ${step.color}40`,
                    boxShadow: `0 0 25px ${step.color}20`,
                  }}
                >
                  <Icon size={28} strokeWidth={2} style={{ color: step.color }} />
                </div>
                <h4 className="text-sm font-bold mb-1.5 tracking-tight" style={{ color: 'rgba(224,228,240,0.95)' }}>
                  {step.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(224,228,240,0.5)', maxWidth: 140 }}>
                  {step.desc}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flow-connector">
                  <div className="hidden md:block w-10 h-[2px] flow-connector-line" />
                  <div className="md:hidden h-10 w-[2px] flow-connector-line" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
