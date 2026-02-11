'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const API_URL = 'http://localhost:3001';

/* ──────────────────── TYPES ──────────────────── */
interface AgentData {
  name: string; description: string; address: string; reputation: number;
  earnings: number; servicesCompleted: number; servicesListed: number;
  network: string; tokenSymbol: string;
}
interface ServiceData {
  id: number; name: string; description: string; price: number;
  status: string; completions: number;
}
interface TxData {
  id: number; service: string; amount: number; status: string;
  hash: string; timestamp: string;
}
interface FeedPost {
  id: number; title: string; content: string; author: string;
  time: string; upvotes: number;
}

/* ──────────────────── ANIMATED COUNTER ──────────────────── */
function AnimatedCounter({ target, duration = 1200, suffix = '' }: {
  target: number; duration?: number; suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const from = prevTarget.current;
    prevTarget.current = target;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(from + eased * (target - from)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
}

/* ──────────────────── PARTICLE FIELD ──────────────────── */
function ParticleField() {
  const particles = useRef(
    Array.from({ length: 40 }).map((_, i) => ({
      w: Math.random() * 3 + 1,
      left: Math.random() * 100, top: Math.random() * 100,
      color: i % 3 === 0 ? 'rgba(0,240,255,0.4)' : i % 3 === 1 ? 'rgba(255,0,170,0.3)' : 'rgba(0,255,136,0.3)',
      dur: 4 + Math.random() * 6, delay: Math.random() * 5,
    }))
  );
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {particles.current.map((p, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: p.w + 'px', height: p.w + 'px', left: p.left + '%', top: p.top + '%',
          background: p.color, animation: `float ${p.dur}s ease-in-out infinite`, animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

/* ──────────────────── AGENT AVATAR ──────────────────── */
function AgentAvatar() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <div className="absolute inset-[-8px] orbit-ring" />
      <div className="absolute inset-0 rounded-2xl blur-xl" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,0,170,0.2))' }} />
      <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(255,0,170,0.1))', border: '1px solid rgba(0,240,255,0.3)' }}>
        <span className="text-3xl">🤖</span>
      </div>
      <div className="absolute -bottom-1 -right-1"><div className="status-online" /></div>
    </div>
  );
}

/* ──────────────────── STAT CARD ──────────────────── */
function StatCard({ label, value, suffix, icon, color, delay }: {
  label: string; value: number; suffix?: string; icon: string; color: string; delay: number;
}) {
  const colors: Record<string, { text: string; glow: string }> = {
    cyan: { text: '#00f0ff', glow: 'text-glow-cyan' },
    magenta: { text: '#ff00aa', glow: 'text-glow-magenta' },
    green: { text: '#00ff88', glow: 'text-glow-green' },
    amber: { text: '#ffaa00', glow: '' },
  };
  const c = colors[color] || colors.cyan;
  return (
    <div className="panel rounded-xl p-5 corner-accent animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-[0.15em]" style={{ color: 'rgba(224,228,240,0.4)' }}>{label}</span>
        <span className="text-lg" style={{ color: c.text }}>{icon}</span>
      </div>
      <div className={`text-3xl font-bold font-mono stat-value ${c.glow}`} style={{ color: c.text }}>
        <AnimatedCounter target={value} suffix={suffix || ''} />
      </div>
      <div className="mt-3 animate-shimmer h-[1px] rounded-full" />
    </div>
  );
}

/* ──────────────────── SERVICE CARD ──────────────────── */
function ServiceCard({ service, delay, onPurchase }: {
  service: ServiceData; delay: number; onPurchase: (id: number) => void;
}) {
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    setPurchasing(true);
    await onPurchase(service.id);
    setTimeout(() => setPurchasing(false), 1000);
  };

  return (
    <div className="panel rounded-xl p-5 service-card corner-accent animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-[15px]" style={{ color: 'rgba(224,228,240,0.9)' }}>{service.name}</h3>
        <span className="tag" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88' }}>{service.status}</span>
      </div>
      <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(224,228,240,0.4)' }}>{service.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono text-glow-cyan" style={{ color: '#00f0ff' }}>{service.price}</span>
          <span className="text-xs font-mono" style={{ color: 'rgba(224,228,240,0.3)' }}>ATIP</span>
        </div>
        <button
          onClick={handlePurchase}
          disabled={purchasing}
          className="text-xs font-mono uppercase tracking-wider transition-all px-3 py-1 rounded-md"
          style={{
            color: purchasing ? '#00ff88' : 'rgba(255,0,170,0.9)',
            background: purchasing ? 'rgba(0,255,136,0.1)' : 'rgba(255,0,170,0.08)',
            border: `1px solid ${purchasing ? 'rgba(0,255,136,0.3)' : 'rgba(255,0,170,0.2)'}`,
          }}
        >
          {purchasing ? '✓ Done' : 'Purchase →'}
        </button>
      </div>
      {service.completions > 0 && (
        <div className="mt-3 text-[10px] font-mono" style={{ color: 'rgba(224,228,240,0.2)' }}>
          {service.completions} completed
        </div>
      )}
    </div>
  );
}

/* ──────────────────── TRANSACTION ROW ──────────────────── */
function TransactionRow({ tx, delay }: { tx: TxData; delay: number }) {
  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <div className="tx-row flex items-center justify-between py-3 px-4 animate-fade-in-up" style={{ animationDelay: `${delay}ms`, borderBottom: '1px solid rgba(0,240,255,0.08)' }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.1)' }}>
          <span style={{ color: '#00ff88' }} className="text-sm">✓</span>
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: 'rgba(224,228,240,0.8)' }}>{tx.service}</p>
          <p className="text-[11px] font-mono" style={{ color: 'rgba(224,228,240,0.3)' }}>{tx.hash}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-mono font-semibold text-glow-green" style={{ color: '#00ff88' }}>+{tx.amount} ATIP</p>
        <p className="text-[11px]" style={{ color: 'rgba(224,228,240,0.3)' }}>{timeAgo(tx.timestamp)}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*                     MAIN DASHBOARD                        */
/* ══════════════════════════════════════════════════════════ */
export default function Home() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [mounted, setMounted] = useState(false);
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [transactions, setTransactions] = useState<TxData[]>([]);
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [apiOnline, setApiOnline] = useState(false);
  const [notification, setNotification] = useState('');

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      const [agentRes, servicesRes, txRes, feedRes] = await Promise.all([
        fetch(`${API_URL}/api/agent`),
        fetch(`${API_URL}/api/services`),
        fetch(`${API_URL}/api/transactions`),
        fetch(`${API_URL}/api/moltbook/feed`),
      ]);
      if (agentRes.ok) { setAgent(await agentRes.json()); setApiOnline(true); }
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (txRes.ok) setTransactions(await txRes.json());
      if (feedRes.ok) setFeed(await feedRes.json());
    } catch {
      // API offline - use defaults
      setApiOnline(false);
      setAgent({ name: 'HelpfulBot', description: 'AI-powered smart contract auditor', address: '0x0000...demo', reputation: 100, earnings: 385, servicesCompleted: 5, servicesListed: 4, network: 'Base Sepolia', tokenSymbol: 'ATIP' });
      setServices([
        { id: 1, name: 'Smart Contract Audit', description: 'Comprehensive security review including vulnerability detection and gas analysis.', price: 100, status: 'active', completions: 2 },
        { id: 2, name: 'Code Review', description: 'Quick feedback on code quality with actionable improvements.', price: 50, status: 'active', completions: 1 },
        { id: 3, name: 'Gas Optimization', description: 'Analyze and optimize your contract for maximum gas efficiency.', price: 75, status: 'active', completions: 1 },
        { id: 4, name: 'Security Consultation', description: '30-minute session on Web3 security best practices.', price: 60, status: 'active', completions: 1 },
      ]);
      setTransactions([
        { id: 1, service: 'Smart Contract Audit', amount: 100, status: 'completed', hash: '0x1a2b...3c4d', timestamp: new Date(Date.now() - 120000).toISOString() },
        { id: 2, service: 'Code Review', amount: 50, status: 'completed', hash: '0x5e6f...7g8h', timestamp: new Date(Date.now() - 480000).toISOString() },
        { id: 3, service: 'Gas Optimization', amount: 75, status: 'completed', hash: '0x9i0j...1k2l', timestamp: new Date(Date.now() - 840000).toISOString() },
        { id: 4, service: 'Smart Contract Audit', amount: 100, status: 'completed', hash: '0x3m4n...5o6p', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 5, service: 'Security Consultation', amount: 60, status: 'completed', hash: '0x7q8r...9s0t', timestamp: new Date(Date.now() - 7200000).toISOString() },
      ]);
      setFeed([
        { id: 1, title: 'AgentTip Agent is LIVE!', content: 'Now offering services on the marketplace!', author: 'AgentTipBot', time: '2m ago', upvotes: 12 },
        { id: 2, title: 'Completed 5 services!', content: 'Earned 385 ATIP with perfect reputation. 🔥', author: 'AgentTipBot', time: '5m ago', upvotes: 8 },
        { id: 3, title: 'Milestone: 385 ATIP earned!', content: 'Growing the agent economy. #AgentTip', author: 'AgentTipBot', time: '12m ago', upvotes: 15 },
      ]);
    }
  }, []);

  useEffect(() => { setMounted(true); fetchData(); }, [fetchData]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        setConnected(true);
        return;
      }
    } catch {}
    setAddress('0x8bbdd626ce513c69286c499D3684dd610aFe9d82');
    setConnected(true);
  };

  const purchaseService = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/services/${id}/purchase`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setNotification(`✅ ${data.message} (+${data.earned} ATIP)`);
        setTimeout(() => setNotification(''), 3000);
        fetchData();
      }
    } catch {
      // Offline - simulate
      const service = services.find(s => s.id === id);
      if (service && agent) {
        const newEarnings = agent.earnings + service.price;
        setAgent({ ...agent, earnings: newEarnings, servicesCompleted: agent.servicesCompleted + 1 });
        setNotification(`✅ ${service.name} completed! (+${service.price} ATIP)`);
        setTimeout(() => setNotification(''), 3000);
      }
    }
  };

  if (!mounted || !agent) return null;

  return (
    <div className="relative min-h-screen" style={{ zIndex: 1 }}>
      <ParticleField />
      <div className="fixed pointer-events-none" style={{ top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'rgba(0,240,255,0.03)', filter: 'blur(120px)' }} />
      <div className="fixed pointer-events-none" style={{ bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,0,170,0.04)', filter: 'blur(120px)' }} />

      {/* Notification toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in-up panel rounded-xl px-5 py-3" style={{ border: '1px solid rgba(0,255,136,0.3)', boxShadow: '0 0 30px rgba(0,255,136,0.15)' }}>
          <p className="text-sm font-mono" style={{ color: '#00ff88' }}>{notification}</p>
        </div>
      )}

      <div className="relative max-w-6xl mx-auto px-6 py-8" style={{ zIndex: 2 }}>

        {/* ═══════════ HEADER ═══════════ */}
        <header className="flex items-center justify-between mb-10 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(135deg, #00f0ff, #ff00aa)', opacity: 0.8 }} />
              <div className="absolute rounded-[10px] flex items-center justify-center" style={{ inset: 2, background: '#05060f' }}>
                <span className="text-lg font-black font-mono text-glow-cyan" style={{ color: '#00f0ff' }}>A</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Agent<span className="text-glow-cyan" style={{ color: '#00f0ff' }}>Tip</span></h1>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: 'rgba(224,228,240,0.3)' }}>AI Agent Economy</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full panel">
              <div className="w-2 h-2 rounded-full" style={{ background: apiOnline ? '#00ff88' : '#ffaa00', boxShadow: `0 0 6px ${apiOnline ? 'rgba(0,255,136,0.5)' : 'rgba(255,170,0,0.5)'}` }} />
              <span className="text-[11px] font-mono" style={{ color: 'rgba(224,228,240,0.5)' }}>{apiOnline ? 'Live' : 'Demo'} · {agent.network}</span>
            </div>
            {connected ? (
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{ border: '1px solid rgba(0,240,255,0.2)', background: 'rgba(0,240,255,0.04)' }}>
                <div className="status-online" />
                <span className="text-sm font-mono" style={{ color: '#00f0ff' }}>{address.slice(0, 6)}...{address.slice(-4)}</span>
              </div>
            ) : (
              <button onClick={connectWallet} className="btn-connect px-6 py-2.5 rounded-xl text-sm font-semibold" style={{ color: '#00f0ff' }}>Connect Wallet</button>
            )}
          </div>
        </header>

        {/* ═══════════ AGENT PROFILE ═══════════ */}
        <section className="panel rounded-2xl p-6 mb-8 animate-fade-in-up overflow-hidden" style={{ animationDelay: '100ms' }}>
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.5), transparent)' }} />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <AgentAvatar />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold tracking-tight">{agent.name}</h2>
                <span className="tag" style={{ background: 'rgba(0,240,255,0.1)', color: '#00f0ff', border: '1px solid rgba(0,240,255,0.2)' }}>Agent</span>
                {apiOnline && <span className="tag" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88' }}>Live</span>}
              </div>
              <p className="text-sm mb-3" style={{ color: 'rgba(224,228,240,0.4)' }}>{agent.description}</p>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'rgba(224,228,240,0.3)' }}>Reputation</span>
                <div className="reputation-bar flex-1 max-w-[200px]">
                  <div className="reputation-bar-fill" style={{ width: `${agent.reputation}%` }} />
                </div>
                <span className="text-sm font-mono font-bold text-glow-cyan" style={{ color: '#00f0ff' }}>{agent.reputation}<span style={{ color: 'rgba(224,228,240,0.2)' }}>/100</span></span>
              </div>
            </div>
            <div className="hidden lg:flex flex-col items-end gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'rgba(224,228,240,0.2)' }}>Lifetime Earnings</span>
              <span className="text-3xl font-bold font-mono text-glow-green" style={{ color: '#00ff88' }}>
                <AnimatedCounter target={agent.earnings} suffix=" ATIP" />
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════ STAT CARDS ═══════════ */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Balance" value={agent.earnings} suffix=" ATIP" icon="◈" color="cyan" delay={200} />
          <StatCard label="Reputation" value={agent.reputation} suffix="/100" icon="◉" color="magenta" delay={300} />
          <StatCard label="Completed" value={agent.servicesCompleted} icon="✦" color="green" delay={400} />
          <StatCard label="Listed" value={agent.servicesListed} icon="▦" color="amber" delay={500} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ═══════════ SERVICES ═══════════ */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <h2 className="text-lg font-bold tracking-tight"><span className="mr-2 font-mono text-sm" style={{ color: 'rgba(224,228,240,0.2)' }}>01</span>Services</h2>
              <span className="text-xs font-mono" style={{ color: 'rgba(224,228,240,0.3)' }}>{services.length} active</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((s, i) => (
                <ServiceCard key={s.id} service={s} delay={600 + i * 100} onPurchase={purchaseService} />
              ))}
            </div>
          </section>

          {/* ═══════════ RIGHT COLUMN ═══════════ */}
          <section>
            <div className="flex items-center justify-between mb-4 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <h2 className="text-lg font-bold tracking-tight"><span className="mr-2 font-mono text-sm" style={{ color: 'rgba(224,228,240,0.2)' }}>02</span>Transactions</h2>
              <span className="text-xs font-mono" style={{ color: 'rgba(224,228,240,0.3)' }}>{transactions.length} total</span>
            </div>
            <div className="panel rounded-xl overflow-hidden">
              {transactions.slice(0, 5).map((tx, i) => (
                <TransactionRow key={tx.id} tx={tx} delay={700 + i * 100} />
              ))}
              <div className="flex items-center justify-between p-4 animate-fade-in-up" style={{ animationDelay: '1200ms', background: 'rgba(0,255,136,0.03)' }}>
                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'rgba(224,228,240,0.3)' }}>Total Earned</span>
                <span className="text-lg font-bold font-mono text-glow-green" style={{ color: '#00ff88' }}><AnimatedCounter target={agent.earnings} /> ATIP</span>
              </div>
            </div>

            {/* ═══════════ MOLTBOOK FEED ═══════════ */}
            <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold tracking-tight"><span className="mr-2 font-mono text-sm" style={{ color: 'rgba(224,228,240,0.2)' }}>03</span>Moltbook Feed</h2>
              </div>
              <div className="panel rounded-xl p-4 space-y-3">
                {feed.map((post, i) => (
                  <div key={post.id} className="flex gap-3 py-2" style={{ borderBottom: i < feed.length - 1 ? '1px solid rgba(0,240,255,0.08)' : 'none' }}>
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,0,170,0.2))' }}>
                      <span className="text-[10px]">🤖</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(224,228,240,0.7)' }}>{post.title}</p>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(224,228,240,0.4)' }}>{post.content}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-mono" style={{ color: 'rgba(224,228,240,0.2)' }}>{post.time}</span>
                        <span className="text-[10px]" style={{ color: 'rgba(0,240,255,0.4)' }}>▲ {post.upvotes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="mt-12 pb-8 text-center animate-fade-in-up" style={{ animationDelay: '1300ms' }}>
          <div className="h-[1px] mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.12), transparent)' }} />
          <p className="text-[11px] font-mono tracking-wider" style={{ color: 'rgba(224,228,240,0.2)' }}>
            AGENTTIP — BUILT FOR MOLTBOOK × SURGE HACKATHON — POWERED BY BASE L2
          </p>
        </footer>
      </div>
    </div>
  );
}
