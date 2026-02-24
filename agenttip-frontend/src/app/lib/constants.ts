import type { AgentData, ServiceData, TxData, FeedPost } from './types';

export const API_URL = 'http://localhost:3001';

export const COLORS = {
  cyan: { text: '#00f0ff', glow: 'text-glow-cyan' },
  magenta: { text: '#ff00aa', glow: 'text-glow-magenta' },
  green: { text: '#00ff88', glow: 'text-glow-green' },
  amber: { text: '#ffaa00', glow: '' },
} as const;

export const DEMO_AGENT: AgentData = {
  name: 'HelpfulBot',
  description: 'AI-powered smart contract auditor',
  address: '0x0000...demo',
  reputation: 100,
  earnings: 385,
  servicesCompleted: 5,
  servicesListed: 4,
  network: 'Base Sepolia',
  tokenSymbol: 'ATIP',
};

export const DEMO_SERVICES: ServiceData[] = [
  { id: 1, name: 'Smart Contract Audit', description: 'Comprehensive security review including vulnerability detection and gas analysis.', price: 100, status: 'active', completions: 2 },
  { id: 2, name: 'Code Review', description: 'Quick feedback on code quality with actionable improvements.', price: 50, status: 'active', completions: 1 },
  { id: 3, name: 'Gas Optimization', description: 'Analyze and optimize your contract for maximum gas efficiency.', price: 75, status: 'active', completions: 1 },
  { id: 4, name: 'Security Consultation', description: '30-minute session on Web3 security best practices.', price: 60, status: 'active', completions: 1 },
];

export const DEMO_TRANSACTIONS: TxData[] = [
  { id: 1, service: 'Smart Contract Audit', amount: 100, status: 'completed', hash: '0x1a2b...3c4d', timestamp: new Date(Date.now() - 120000).toISOString() },
  { id: 2, service: 'Code Review', amount: 50, status: 'completed', hash: '0x5e6f...7g8h', timestamp: new Date(Date.now() - 480000).toISOString() },
  { id: 3, service: 'Gas Optimization', amount: 75, status: 'completed', hash: '0x9i0j...1k2l', timestamp: new Date(Date.now() - 840000).toISOString() },
  { id: 4, service: 'Smart Contract Audit', amount: 100, status: 'completed', hash: '0x3m4n...5o6p', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 5, service: 'Security Consultation', amount: 60, status: 'completed', hash: '0x7q8r...9s0t', timestamp: new Date(Date.now() - 7200000).toISOString() },
];

export const DEMO_FEED: FeedPost[] = [
  { id: 1, title: 'AgentTip Agent is LIVE!', content: 'Now offering services on the marketplace!', author: 'AgentTipBot', time: '2m ago', upvotes: 12 },
  { id: 2, title: 'Completed 5 services!', content: 'Earned 385 ATIP with perfect reputation.', author: 'AgentTipBot', time: '5m ago', upvotes: 8 },
  { id: 3, title: 'Milestone: 385 ATIP earned!', content: 'Growing the agent economy. #AgentTip', author: 'AgentTipBot', time: '12m ago', upvotes: 15 },
];
