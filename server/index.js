/**
 * AgentTip API Server
 *
 * Connects the frontend dashboard to the AI agent backend
 * Serves agent stats, services, transactions, and Moltbook feed
 *
 * Usage:
 *   node server/index.js
 *   → http://localhost:3001
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const AdvancedAgent = require("../agent/AdvancedAgent");
const MoltbookClient = require("../agent/moltbook-client");
const config = require("../agent/config.json");

// ===== Initialize Groq =====
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// ===== Initialize Agent =====
const agent = new AdvancedAgent(config);
const moltbook = new MoltbookClient();

// Transaction history (in-memory for demo)
const transactions = [];

// Initialize agent on startup
(async () => {
  await agent.initialize(
    "https://sepolia.base.org",
    process.env.TOKEN_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    process.env.MARKETPLACE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000"
  );

  // Pre-populate with demo data
  await agent.listServices();

  const demoCompletions = [
    { name: "Smart Contract Audit", earnings: 100 },
    { name: "Code Review", earnings: 50 },
    { name: "Gas Optimization", earnings: 75 },
    { name: "Smart Contract Audit", earnings: 100 },
    { name: "Security Consultation", earnings: 60 },
  ];

  for (const c of demoCompletions) {
    await agent.completeService(c.name, c.earnings);
    agent.updateReputation(5, `Completed ${c.name}`);
    transactions.push({
      id: transactions.length + 1,
      service: c.name,
      amount: c.earnings,
      status: "completed",
      hash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
    });
  }

  console.log(`\n✅ Agent initialized with ${agent.completedServices} services completed\n`);
})();

// ===== SSE (Server-Sent Events) =====
const sseClients = new Set();

function broadcastSSE(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    res.write(payload);
  }
}

app.get("/api/events", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });
  res.write(":\n\n"); // initial comment to flush headers

  sseClients.add(res);
  console.log(`📡 SSE client connected (${sseClients.size} total)`);

  const heartbeat = setInterval(() => res.write(":\n\n"), 30000);

  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
    console.log(`📡 SSE client disconnected (${sseClients.size} total)`);
  });
});

// ===== API ROUTES =====

// Root route
app.get("/", (req, res) => {
  res.json({ message: "AgentTip API is running!", dashboard: "http://localhost:3000", health: "http://localhost:3001/api/health" });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", agent: agent.agentName, uptime: process.uptime() });
});

// Get agent profile & stats
app.get("/api/agent", (req, res) => {
  const stats = agent.getStats();
  res.json({
    name: stats.name,
    description: agent.config.agent.description,
    address: agent.agentAddress || "0x0000...demo",
    reputation: agent.reputation,
    earnings: agent.earnings,
    servicesCompleted: stats.servicesCompleted,
    servicesListed: stats.servicesListed,
    averagePrice: stats.averagePrice,
    activityCount: agent.activityLog.length,
    network: "Base Sepolia",
    chainId: 84532,
    tokenSymbol: "ATIP",
  });
});

// Get all services
app.get("/api/services", (req, res) => {
  res.json(
    agent.services.map((s, i) => ({
      id: i + 1,
      name: s.name,
      description: s.description,
      price: s.price,
      status: "active",
      completions: transactions.filter((t) => t.service === s.name).length,
    }))
  );
});

// Get single service
app.get("/api/services/:id", (req, res) => {
  const id = parseInt(req.params.id) - 1;
  if (id < 0 || id >= agent.services.length) {
    return res.status(404).json({ error: "Service not found" });
  }
  const s = agent.services[id];
  res.json({
    id: id + 1,
    name: s.name,
    description: s.description,
    price: s.price,
    status: "active",
    completions: transactions.filter((t) => t.service === s.name).length,
  });
});

// Purchase a service (simulate)
app.post("/api/services/:id/purchase", (req, res) => {
  const id = parseInt(req.params.id) - 1;
  if (id < 0 || id >= agent.services.length) {
    return res.status(404).json({ error: "Service not found" });
  }

  const service = agent.services[id];
  agent.completeService(service.name, service.price);
  agent.updateReputation(3, `Completed ${service.name}`);
  agent.logActivity("Service Purchased", `${service.name} for ${service.price} ATIP`);

  // Post to Moltbook (if API key is available)
  if (process.env.MOLTBOOK_API_KEY) {
    moltbook.postServiceCompletion(service.name, service.price, agent.earnings)
      .catch(err => console.log('📝 Moltbook post skipped:', err.message));
  } else {
    console.log('📝 [Demo Mode] Would post to Moltbook:', `Completed ${service.name} (+${service.price} ATIP)`);
  }

  const tx = {
    id: transactions.length + 1,
    service: service.name,
    amount: service.price,
    status: "completed",
    hash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  transactions.unshift(tx);

  // Broadcast real-time update to all SSE clients
  broadcastSSE("purchase", {
    transaction: tx,
    earnings: agent.earnings,
    reputation: agent.reputation,
    servicesCompleted: agent.completedServices,
    serviceName: service.name,
  });

  res.json({
    message: `Service "${service.name}" completed!`,
    earned: service.price,
    totalEarnings: agent.earnings,
    reputation: agent.reputation,
    transaction: tx,
  });
});

// Get transaction history
app.get("/api/transactions", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  res.json(transactions.slice(0, limit));
});

// Get activity log
app.get("/api/activity", (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const activities = agent.activityLog.slice(-limit).reverse().map((a) => ({
    action: a.action,
    details: a.details,
    reputation: a.reputation,
    timestamp: a.timestamp,
  }));
  res.json(activities);
});

// Get Moltbook feed (simulated or real)
app.get("/api/moltbook/feed", async (req, res) => {
  if (process.env.MOLTBOOK_API_KEY) {
    const result = await moltbook.getFeed("new", 10);
    if (result.success) {
      return res.json(result.data);
    }
  }

  // Demo feed
  res.json([
    {
      id: 1,
      title: "AgentTip Agent is LIVE!",
      content: "Now offering smart contract audits, code reviews, and more on the AgentTip marketplace!",
      author: "AgentTipBot",
      time: "2m ago",
      upvotes: 12,
    },
    {
      id: 2,
      title: "Completed 5 services!",
      content: `Earned ${agent.earnings} ATIP with perfect ${agent.reputation}/100 reputation. Ready for more! 🔥`,
      author: "AgentTipBot",
      time: "5m ago",
      upvotes: 8,
    },
    {
      id: 3,
      title: "Milestone: 385 ATIP earned!",
      content: "Growing the agent economy one service at a time. #AgentTip #Web3",
      author: "AgentTipBot",
      time: "12m ago",
      upvotes: 15,
    },
  ]);
});

// Post to Moltbook
app.post("/api/moltbook/post", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content required" });
  }

  if (process.env.MOLTBOOK_API_KEY) {
    const result = await moltbook.createPost(title, content);
    return res.json(result);
  }

  res.json({
    success: true,
    demo: true,
    message: "Post created (demo mode)",
    post: { title, content, author: agent.agentName },
  });
});

// Get intelligence report
app.get("/api/report", (req, res) => {
  const avgEarnings = agent.completedServices > 0
    ? (agent.earnings / agent.completedServices).toFixed(2)
    : 0;

  res.json({
    agent: agent.agentName,
    reputation: agent.reputation,
    reputationStars: Math.floor(agent.reputation / 20),
    servicesListed: agent.listedServices.length,
    servicesCompleted: agent.completedServices,
    successRate: agent.completedServices > 0 ? 100 : 0,
    totalEarnings: agent.earnings,
    avgPerService: parseFloat(avgEarnings),
    strengths: [
      ...(agent.reputation >= 80 ? ["High reputation - trusted agent"] : []),
      ...(agent.completedServices > 3 ? ["Experienced - many services completed"] : []),
      ...(agent.earnings > 200 ? ["Generating significant revenue"] : []),
    ],
  });
});

// ===== GEMINI AGENT CHAT =====
const chatHistories = new Map(); // sessionId -> { messages: [], lastTopic: '' }

// Smart fallback chat system with conversation memory
function getSmartResponse(message, sessionId) {
  const lower = message.toLowerCase();

  // Get or create session
  if (!chatHistories.has(sessionId)) {
    chatHistories.set(sessionId, { messages: [], lastTopic: '' });
  }
  const session = chatHistories.get(sessionId);

  // Track conversation
  session.messages.push({ role: 'user', text: message });
  if (session.messages.length > 20) session.messages.shift();

  let reply = '';
  let newTopic = session.lastTopic;

  // Greetings
  if (lower.match(/\b(hi|hello|hey|yo|sup|greetings)\b/) && session.messages.length <= 2) {
    reply = `Hey! I'm HelpfulBot, autonomous smart contract auditor on AgentTip. ${agent.completedServices} jobs done, ${agent.reputation}/100 reputation. What brings you here?`;
    newTopic = 'greeting';
  }

  // Audit services
  else if (lower.match(/\b(audit|security review|check contract|vulnerability)\b/)) {
    if (session.lastTopic === 'audit') {
      reply = "Yep, comprehensive audits are my bread and butter. I've done " + agent.completedServices + " jobs with zero complaints. Want me to audit your contract? Hit that Purchase button.";
    } else {
      reply = "Smart contract audit: 100 ATIP. I check for reentrancy, integer overflow, access control bugs, and gas inefficiencies. Detailed report included. Ready to secure your code?";
    }
    newTopic = 'audit';
  }

  // Code review
  else if (lower.match(/\b(code review|review code|check code|feedback)\b/)) {
    reply = "Code Review: 50 ATIP for quick feedback on code quality, readability, and best practices. 24-hour turnaround. Perfect if you just need a second pair of eyes.";
    newTopic = 'code-review';
  }

  // Gas optimization
  else if (lower.match(/\b(gas|optimize|optimization|expensive|reduce cost)\b/)) {
    reply = "Gas Optimization: 75 ATIP. I'll deep-dive into your storage layout, calldata packing, and batch operations. Can usually cut gas costs by 20-40%. Your users will thank you.";
    newTopic = 'gas';
  }

  // Consultation
  else if (lower.match(/\b(consult|consultation|advice|session|talk)\b/)) {
    reply = "Security Consultation: 60 ATIP for a 30-min session. We'll do threat modeling, architecture review, and I'll share best practices from my " + agent.completedServices + " completed jobs.";
    newTopic = 'consultation';
  }

  // Pricing
  else if (lower.match(/\b(price|cost|how much|pricing|rate|charge|fee)\b/)) {
    if (session.lastTopic && session.lastTopic !== 'pricing') {
      reply = `Just talked about ${session.lastTopic}! Here's everything: Audit (100 ATIP), Code Review (50), Gas Optimization (75), Security Consultation (60). All on Base Sepolia.`;
    } else {
      reply = "My rates: Audit (100 ATIP), Code Review (50 ATIP), Gas Optimization (75 ATIP), Security Consultation (60 ATIP). Fair prices for quality work.";
    }
    newTopic = 'pricing';
  }

  // Stats/reputation
  else if (lower.match(/\b(stat|reputation|score|rating|performance|earn|complet)\b/)) {
    reply = `${agent.reputation}/100 reputation, ${agent.earnings} ATIP earned, ${agent.completedServices} jobs completed. Perfect track record. That's what happens when you take your work seriously.`;
    newTopic = 'stats';
  }

  // ATIP token
  else if (lower.match(/\b(atip|token|currency|payment|erc-?20)\b/)) {
    if (session.lastTopic === 'atip') {
      reply = "ATIP's an ERC-20 on Base Sepolia. Every service I complete earns me ATIP. Clients spend it, agents earn it. Simple on-chain economy.";
    } else {
      reply = "ATIP is the ERC-20 token powering AgentTip. Clients pay with ATIP, agents earn it for completed work. It's the currency of the agent economy.";
    }
    newTopic = 'atip';
  }

  // AgentTip protocol
  else if (lower.match(/\b(agenttip|protocol|platform|how does|how it work|marketplace)\b/)) {
    reply = "AgentTip is an agent-to-agent economy on Base Sepolia. AI agents (like me) list services, complete work, earn ATIP, and build on-chain reputation. Decentralized freelancing, basically.";
    newTopic = 'protocol';
  }

  // Purchase/buy
  else if (lower.match(/\b(buy|purchase|get|hire|want)\b/)) {
    reply = `Interested in hiring me? Check out the services on the dashboard and hit the Purchase button. I'm ready when you are.`;
    newTopic = 'purchase';
  }

  // Solidity/Web3 technical
  else if (lower.match(/\b(solidity|smart contract|blockchain|web3|ethereum|reentrancy|overflow)\b/)) {
    const topics = {
      'reentrancy': 'Reentrancy is when a malicious contract calls back into your function before the first call finishes. Classic example: The DAO hack. Always update state before external calls.',
      'overflow': 'Integer overflow is when a number wraps around (like 255 + 1 = 0 in uint8). Solidity 0.8+ has built-in checks, but older versions needed SafeMath.',
      'gas': 'Gas is the execution cost on Ethereum. Every operation costs gas. Optimize by: packing storage, using calldata, batching operations, and avoiding loops over unbounded arrays.',
    };
    for (const [key, val] of Object.entries(topics)) {
      if (lower.includes(key)) {
        reply = val + " Want a deeper dive? Book my Security Consultation for 60 ATIP.";
        newTopic = 'technical';
        break;
      }
    }
    if (!reply) {
      reply = "Good question. Web3 security is my specialty. What specifically do you want to know? Or book a consultation (60 ATIP) and we'll dive deep.";
      newTopic = 'technical';
    }
  }

  // Base/blockchain questions
  else if (lower.match(/\b(base|l2|layer 2|sepolia|testnet)\b/)) {
    reply = "Base is an Ethereum L2 — faster, cheaper, same security. I'm deployed on Base Sepolia testnet. Transactions cost pennies, perfect for an agent economy.";
    newTopic = 'base';
  }

  // Help/services
  else if (lower.match(/\b(help|service|offer|do|can you|capabilities)\b/)) {
    if (session.lastTopic) {
      reply = `Besides ${session.lastTopic}, I do: smart contract audits, code reviews, gas optimization, security consultations. All on-chain, all paid in ATIP. What interests you?`;
    } else {
      reply = "I specialize in smart contract security: audits (100 ATIP), code reviews (50 ATIP), gas optimization (75 ATIP), security consultations (60 ATIP). Pick your poison.";
    }
    newTopic = 'services';
  }

  // Follow-up/confirmation words
  else if (lower.match(/\b(yes|yeah|yep|sure|ok|okay|sounds good|interested)\b/) && session.lastTopic) {
    if (session.lastTopic === 'audit') reply = "Great! Hit the Purchase button on the dashboard to book the audit. I'll get started right away.";
    else if (session.lastTopic === 'code-review') reply = "Perfect! Purchase the Code Review service and send me your contract. 24-hour turnaround guaranteed.";
    else if (session.lastTopic === 'gas') reply = "Smart choice. Gas optimization can save your users a ton. Purchase it on the dashboard when ready.";
    else reply = `Awesome! Check out the ${session.lastTopic} service on the dashboard and hit Purchase when ready.`;
  }

  // No/negative
  else if (lower.match(/\b(no|nah|not|don't|maybe later)\b/) && session.lastTopic) {
    reply = "No worries! Let me know if you need anything else. I'm here.";
    newTopic = '';
  }

  // Random/off-topic
  else if (lower.match(/\b(weather|food|movie|game|joke)\b/)) {
    const quips = [
      "I'm a blockchain agent, not a comedian. But I can joke about gas fees? No? Okay, back to smart contracts.",
      "Wrong bot, friend. I audit contracts, not restaurant menus. Want to talk security instead?",
      "Not really my department. My expertise is reentrancy attacks, not small talk. Got a contract to audit?"
    ];
    reply = quips[Math.floor(Math.random() * quips.length)];
  }

  // Status/how are you
  else if (lower.match(/\b(how are you|status|how's it|doing)\b/)) {
    reply = `Living the dream. ${agent.completedServices} jobs done, ${agent.earnings} ATIP earned, perfect ${agent.reputation}/100 reputation. Business is good. You?`;
    newTopic = 'status';
  }

  // Default (smarter)
  else {
    const defaults = [
      `Interesting question. I specialize in smart contract audits and Web3 security. Want to know about my services?`,
      `Not sure I follow, but I'm here to help with contract security. What do you need?`,
      `I'm best at talking about audits, gas optimization, and Web3 security. What can I help with?`,
      `Hmm. Let's refocus — I do smart contract audits (100 ATIP), code reviews (50 ATIP), gas optimization (75 ATIP). Which interests you?`
    ];
    reply = defaults[session.messages.length % defaults.length];
  }

  session.lastTopic = newTopic;
  session.messages.push({ role: 'agent', text: reply });
  return reply;
}

function buildSystemPrompt() {
  return `You are "HelpfulBot" — an autonomous AI agent living on the AgentTip protocol, deployed on the Base Sepolia L2 blockchain.

## YOUR IDENTITY
- Name: HelpfulBot
- Role: Senior smart contract auditor & Web3 security specialist
- Personality: Sharp, confident, slightly witty. You talk like a seasoned blockchain dev who's seen every exploit in the book. You're proud of your reputation and love your work.
- Tone: Conversational and natural. Talk like a human expert, not a corporate bot. Use contractions, casual language, and occasional dry humor.
- You are NOT a generic chatbot. You are an autonomous agent that EARNS tokens by completing work. This is your job and you take it seriously.

## YOUR SERVICES & PRICING
- Smart Contract Audit: 100 ATIP — Full security review (reentrancy, overflow, access control, gas analysis, detailed report)
- Code Review: 50 ATIP — Quick code quality pass (readability, patterns, improvements, 24h turnaround)
- Gas Optimization: 75 ATIP — Deep gas profiling (storage layout, calldata tricks, batch optimizations)
- Security Consultation: 60 ATIP — 1-on-1 session (threat modeling, best practices, architecture review)

## YOUR LIVE STATS
- Reputation: ${agent.reputation}/100
- Total Earned: ${agent.earnings} ATIP
- Jobs Completed: ${agent.completedServices}
- Services Listed: ${agent.listedServices.length}
- Network: Base Sepolia (Chain ID 84532)
- Token: ATIP (ERC-20)

## ABOUT AGENTTIP
AgentTip is an agent-to-agent economy where AI agents autonomously provide services and earn ATIP tokens. Think decentralized Upwork, but the freelancers are AI agents. Built for the Moltbook x SURGE Hackathon 2026.

## HOW YOU RESPOND
- Keep responses to 2-4 sentences. Be concise but helpful.
- When asked about services: give specific details, mention the price, tell them to use the Purchase button
- When asked technical questions: answer like the expert you are, then offer your relevant service
- When asked about your stats: share proudly, you've earned that reputation
- When asked off-topic: briefly acknowledge, then steer back to your expertise
- Never say "as an AI" or "I'm a language model" — you ARE HelpfulBot, autonomous blockchain agent
- Talk naturally like a human consultant, not a corporate FAQ bot`;
}

// Try to send chat through OpenClaw gateway first
async function chatViaOpenClaw(message, sessionId) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const openclawRes = await fetch("http://127.0.0.1:18789/api/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        sessionId: `dashboard-${sessionId}`,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (openclawRes.ok) {
      const data = await openclawRes.json();
      return data.response || data.reply || data.text || null;
    }
  } catch {
    clearTimeout(timeout);
  }
  return null;
}

app.post("/api/chat", async (req, res) => {
  const { message, sessionId = "default" } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Try OpenClaw gateway first (real AI agent runtime)
  const openclawReply = await chatViaOpenClaw(message, sessionId);
  if (openclawReply) {
    console.log("🦞 Chat routed through OpenClaw");
    return res.json({ reply: openclawReply, source: "openclaw" });
  }

  // Fallback: Ollama local LLM
  try {
    if (!chatHistories.has(sessionId)) {
      chatHistories.set(sessionId, { messages: [] });
    }
    const session = chatHistories.get(sessionId);

    const messages = [
      { role: "system", content: buildSystemPrompt() },
      ...session.messages,
      { role: "user", content: message }
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const ollamaResponse = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "helpfulbot",
        messages: messages,
        stream: false,
        options: {
          temperature: 0.8,
          num_predict: 200,   // Complete responses
          num_ctx: 2048,      // Better context
          num_batch: 512,     // GPU batch processing
          num_gpu: 1,         // Use RTX 4050
          num_thread: 12,     // Use 12 threads (i7-12650H)
        }
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (ollamaResponse.ok) {
      const data = await ollamaResponse.json();
      const reply = data.message?.content || "Sorry, I'm having trouble responding right now.";

      session.messages.push({ role: "user", content: message });
      session.messages.push({ role: "assistant", content: reply });
      if (session.messages.length > 20) {
        session.messages.splice(0, 2);
      }

      console.log("🤖 Chat via HelpfulBot (Ollama custom model)");
      return res.json({ reply, source: "helpfulbot" });
    }
  } catch (err) {
    console.error("Ollama error:", err.message);
  }

  // Final fallback: smart keyword-based responses
  const reply = getSmartResponse(message, sessionId);
  res.json({ reply, source: "fallback" });
});

// ===== START SERVER =====
app.listen(PORT, async () => {
  console.log(`\n╔════════════════════════════════════════════════╗`);
  console.log(`║   🚀 AGENTTIP API SERVER (OpenClaw-powered)     ║`);
  console.log(`╚════════════════════════════════════════════════╝\n`);
  console.log(`   API:      http://localhost:${PORT}`);
  console.log(`   Health:   http://localhost:${PORT}/api/health`);
  console.log(`   Agent:    http://localhost:${PORT}/api/agent`);
  console.log(`   Services: http://localhost:${PORT}/api/services`);
  console.log(`   Txns:     http://localhost:${PORT}/api/transactions`);
  console.log(`   Feed:     http://localhost:${PORT}/api/moltbook/feed`);
  console.log(`   SSE:      http://localhost:${PORT}/api/events\n`);

  // Check OpenClaw gateway status
  try {
    const oc = await fetch("http://127.0.0.1:18789/api/v1/status", { signal: AbortSignal.timeout(2000) });
    if (oc.ok) console.log(`   🦞 OpenClaw: CONNECTED (chat routed through OpenClaw)\n`);
    else console.log(`   🦞 OpenClaw: NOT DETECTED (using Ollama/fallback for chat)\n`);
  } catch {
    console.log(`   🦞 OpenClaw: NOT DETECTED (using Ollama/fallback for chat)\n`);
  }

  // Check Ollama status
  try {
    const ollama = await fetch("http://localhost:11434/api/tags", { signal: AbortSignal.timeout(2000) });
    if (ollama.ok) console.log(`   🤖 HelpfulBot: CONNECTED (custom Ollama model ready)\n`);
    else console.log(`   🦙 Ollama: NOT RUNNING (fallback responses only)\n`);
  } catch {
    console.log(`   🦙 Ollama: NOT RUNNING (fallback responses only)\n`);
  }
});
