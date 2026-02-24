'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { API_URL } from '../lib/constants';
import Image from 'next/image';

// 3D Icon components
const BotIcon = ({ size = 18 }: { size?: number }) => (
  <Image src="/icons/robot.png" alt="Bot" width={size} height={size} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
);

const UserIcon = ({ size = 14 }: { size?: number }) => (
  <Image src="/icons/user.png" alt="User" width={size} height={size} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
  </svg>
);

const SparklesIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
  </svg>
);

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'agent';
}

const QUICK_REPLIES = [
  { label: 'What do you do?', message: 'What services do you offer?' },
  { label: 'Pricing', message: 'How much do your services cost?' },
  { label: 'Your stats', message: 'What are your current stats and reputation?' },
  { label: 'What is ATIP?', message: 'What is the ATIP token and how does it work?' },
  { label: 'How AgentTip works', message: 'Explain how the AgentTip protocol works' },
  { label: 'Smart contract audit', message: 'Tell me about your smart contract audit service' },
];

function getOfflineResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return "Hey! I'm HelpfulBot, autonomous smart contract auditor on AgentTip. How can I help?";
  if (lower.includes('audit')) return 'Full smart contract audit: 100 ATIP. I check for reentrancy, overflow, access control issues, and gas inefficiencies. Hit that Purchase button to get started.';
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) return 'Audit (100 ATIP), Code Review (50 ATIP), Gas Optimization (75 ATIP), Security Consultation (60 ATIP). All on Base Sepolia.';
  if (lower.includes('help') || lower.includes('what can') || lower.includes('what do')) return "I do smart contract audits, code reviews, gas optimization, and security consultations. All on-chain, all paid in ATIP.";
  if (lower.includes('atip') || lower.includes('token')) return 'ATIP is the ERC-20 token powering AgentTip. Clients pay me in ATIP, I earn it by delivering work. The fuel of the agent economy.';
  if (lower.includes('agenttip') || lower.includes('protocol') || lower.includes('how does')) return 'AgentTip is an agent-to-agent economy on Base Sepolia. AI agents list services, complete work, earn ATIP tokens, and build on-chain reputation.';
  return "I specialize in smart contract security and Web3 auditing. Ask me about my services, pricing, or the AgentTip protocol!";
}

export default function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, text: "Hey! I'm HelpfulBot \u2014 autonomous smart contract auditor on the AgentTip protocol. Ask me anything about my services, Web3 security, or how agent economies work.", sender: 'agent' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(1);
  const sessionId = useRef(`s-${Date.now()}`);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || typing) return;

    const userMsg: ChatMessage = { id: idRef.current++, text: msg, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setShowChips(false);

    let replyText: string;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, sessionId: sessionId.current }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();
      replyText = data.reply || 'Something went wrong — try again.';
    } catch (err) {
      replyText = getOfflineResponse(msg);
    }

    const reply: ChatMessage = { id: idRef.current++, text: replyText, sender: 'agent' };
    setMessages(prev => [...prev, reply]);
    setTyping(false);
    inputRef.current?.focus();
  }, [input, typing]);

  const handleChip = (message: string) => {
    sendMessage(message);
  };

  return (
    <div className="panel rounded-xl overflow-hidden animate-fade-in-up chat-container" style={{ animationDelay: '800ms' }}>
      {/* Header */}
      <div className="chat-header px-4 py-3.5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(0,240,255,0.12)', background: 'linear-gradient(135deg, rgba(0,240,255,0.02), rgba(255,0,170,0.02))' }}>
        <div className="relative">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.12), rgba(255,0,170,0.12))', border: '1.5px solid rgba(0,240,255,0.25)' }}>
            <BotIcon />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5">
            <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: '#05060f', border: '1.5px solid #00ff88' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight" style={{ color: '#00f0ff', textShadow: '0 0 10px rgba(0,240,255,0.3)' }}>HelpfulBot</span>
            <ShieldIcon />
          </div>
          <span className="text-[10px] font-mono" style={{ color: 'rgba(224,228,240,0.4)' }}>Smart Contract Auditor · Ready to help</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.15)' }}>
          <SparklesIcon />
          <span className="text-[9px] font-mono font-semibold" style={{ color: '#00f0ff' }}>AI</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="chat-messages p-4 space-y-4 overflow-y-auto" style={{ height: 340 }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'agent' && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(0,240,255,0.12)', border: '1px solid rgba(0,240,255,0.2)' }}>
                <BotIcon />
              </div>
            )}
            <div
              className={`chat-bubble max-w-[76%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.sender === 'user' ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-bl-sm'
              }`}
              style={{
                background: msg.sender === 'user'
                  ? 'linear-gradient(135deg, rgba(255,0,170,0.12), rgba(255,0,170,0.08))'
                  : 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(0,240,255,0.04))',
                border: `1px solid ${msg.sender === 'user' ? 'rgba(255,0,170,0.2)' : 'rgba(0,240,255,0.15)'}`,
                color: 'rgba(224,228,240,0.9)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(255,0,170,0.12)', border: '1px solid rgba(255,0,170,0.2)' }}>
                <UserIcon />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(0,240,255,0.12)', border: '1px solid rgba(0,240,255,0.2)' }}>
              <BotIcon />
            </div>
            <div className="chat-bubble px-5 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(0,240,255,0.04))', border: '1px solid rgba(0,240,255,0.15)', backdropFilter: 'blur(8px)' }}>
              <span className="typing-dot" style={{ animationDelay: '0ms' }} />
              <span className="typing-dot" style={{ animationDelay: '150ms' }} />
              <span className="typing-dot" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Quick reply chips */}
        {showChips && !typing && (
          <div className="flex flex-wrap gap-2 pt-3">
            {QUICK_REPLIES.map((chip, idx) => (
              <button
                key={chip.label}
                onClick={() => handleChip(chip.message)}
                className="quick-chip px-3.5 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
                style={{
                  background: 'rgba(0,240,255,0.06)',
                  border: '1px solid rgba(0,240,255,0.18)',
                  color: 'rgba(0,240,255,0.8)',
                  animationDelay: `${idx * 50}ms`,
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2.5 p-3.5" style={{ borderTop: '1px solid rgba(0,240,255,0.12)', background: 'linear-gradient(180deg, rgba(5,6,15,0.8), rgba(5,6,15,0.95))' }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={typing ? 'HelpfulBot is thinking...' : 'Ask me anything...'}
          disabled={typing}
          className="flex-1 bg-transparent text-sm px-4 py-3 rounded-xl outline-none chat-input transition-all"
          style={{
            border: '1px solid rgba(0,240,255,0.15)',
            color: 'rgba(224,228,240,0.9)',
            background: 'rgba(0,240,255,0.02)',
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={typing || !input.trim()}
          className="px-5 py-3 rounded-xl transition-all chat-send-btn flex items-center justify-center gap-2"
          style={{
            background: typing || !input.trim()
              ? 'rgba(0,240,255,0.04)'
              : 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,240,255,0.1))',
            color: typing || !input.trim() ? 'rgba(0,240,255,0.3)' : '#00f0ff',
            border: `1px solid ${typing || !input.trim() ? 'rgba(0,240,255,0.1)' : 'rgba(0,240,255,0.25)'}`,
            boxShadow: typing || !input.trim() ? 'none' : '0 0 20px rgba(0,240,255,0.15)',
            cursor: typing || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
