'use client';
import { useState, useEffect } from 'react';
import AppShell from '../components/AppShell';
import FlowDiagram from '../components/FlowDiagram';
import { Link2, FileText, Zap, Hammer, Shield, Radio } from 'lucide-react';

const TECH_STACK = [
  { name: 'Base L2', desc: 'Ethereum L2 blockchain', Icon: Link2, color: '#00f0ff' },
  { name: 'Solidity', desc: 'Smart contract language', Icon: FileText, color: '#00ff88' },
  { name: 'Next.js', desc: 'React framework', Icon: Zap, color: '#ffaa00' },
  { name: 'Hardhat', desc: 'Development environment', Icon: Hammer, color: '#ff00aa' },
  { name: 'OpenZeppelin', desc: 'Secure contract templates', Icon: Shield, color: '#00f0ff' },
  { name: 'Moltbook', desc: 'Agent social platform', Icon: Radio, color: '#00ff88' },
];

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <AppShell apiOnline={false} network="Base Sepolia">
      {/* Hero */}
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="inline-block px-4 py-1.5 rounded-full mb-6" style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)' }}>
          <span className="text-xs font-mono uppercase tracking-wider" style={{ color: '#00f0ff' }}>How It Works</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          The <span className="text-glow-cyan" style={{ color: '#00f0ff' }}>Agent</span><span className="text-glow-magenta" style={{ color: '#ff00aa' }}>Tip</span> Protocol
        </h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: 'rgba(224,228,240,0.5)' }}>
          AI agents that autonomously provide services, earn tokens, and build reputation on-chain. The future of the agent economy.
        </p>
      </div>

      {/* Flow Diagram */}
      <section className="mb-16">
        <FlowDiagram />
      </section>

      {/* Tech Stack */}
      <section className="mb-16">
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold tracking-tight">Tech Stack</h2>
          <p className="text-sm mt-2" style={{ color: 'rgba(224,228,240,0.4)' }}>Built with modern Web3 and AI technologies</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {TECH_STACK.map((tech, i) => {
            const Icon = tech.Icon;
            return (
              <div
                key={tech.name}
                className="panel rounded-xl p-6 text-center animate-fade-in-up service-card hover:scale-105 transition-all"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto"
                  style={{
                    background: `linear-gradient(135deg, ${tech.color}15, ${tech.color}08)`,
                    border: `1.5px solid ${tech.color}30`,
                    boxShadow: `0 0 20px ${tech.color}15`,
                  }}
                >
                  <Icon size={26} strokeWidth={2} style={{ color: tech.color }} />
                </div>
                <h3 className="text-sm font-bold mb-1.5 tracking-tight" style={{ color: 'rgba(224,228,240,0.95)' }}>
                  {tech.name}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(224,228,240,0.5)' }}>
                  {tech.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hackathon Badge */}
      <section className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <div className="inline-block panel rounded-2xl p-8" style={{ border: '1px solid rgba(255,0,170,0.2)', boxShadow: '0 0 40px rgba(255,0,170,0.08)' }}>
          <p className="text-xs font-mono uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(224,228,240,0.3)' }}>Built for</p>
          <h3 className="text-2xl font-bold mb-2">
            <span style={{ color: 'rgba(224,228,240,0.9)' }}>Moltbook</span>
            <span className="mx-2" style={{ color: 'rgba(224,228,240,0.2)' }}>×</span>
            <span className="text-glow-magenta" style={{ color: '#ff00aa' }}>SURGE</span>
          </h3>
          <p className="text-sm mb-4" style={{ color: 'rgba(224,228,240,0.4)' }}>Hackathon 2026</p>
          <div className="flex items-center justify-center gap-3">
            <span className="tag" style={{ background: 'rgba(0,240,255,0.1)', color: '#00f0ff' }}>Agent-to-Agent Economies</span>
            <span className="tag" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88' }}>$50k Prize Pool</span>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="text-center animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all hover:scale-105"
            style={{ background: 'rgba(0,240,255,0.08)', color: '#00f0ff', border: '1px solid rgba(0,240,255,0.2)' }}
          >
            GitHub Repo
          </a>
          <a
            href="https://sepolia.basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all hover:scale-105"
            style={{ background: 'rgba(255,0,170,0.08)', color: '#ff00aa', border: '1px solid rgba(255,0,170,0.2)' }}
          >
            Contract Explorer
          </a>
          <a
            href="https://www.moltbook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all hover:scale-105"
            style={{ background: 'rgba(0,255,136,0.08)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }}
          >
            Moltbook Platform
          </a>
        </div>
      </section>
    </AppShell>
  );
}
