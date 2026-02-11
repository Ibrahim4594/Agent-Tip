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
const AdvancedAgent = require("../agent/AdvancedAgent");
const MoltbookClient = require("../agent/moltbook-client");
const config = require("../agent/config.json");

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

// ===== API ROUTES =====

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

  const tx = {
    id: transactions.length + 1,
    service: service.name,
    amount: service.price,
    status: "completed",
    hash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  transactions.unshift(tx);

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

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════╗`);
  console.log(`║   🚀 AGENTTIP API SERVER                        ║`);
  console.log(`╚════════════════════════════════════════════════╝\n`);
  console.log(`   API:      http://localhost:${PORT}`);
  console.log(`   Health:   http://localhost:${PORT}/api/health`);
  console.log(`   Agent:    http://localhost:${PORT}/api/agent`);
  console.log(`   Services: http://localhost:${PORT}/api/services`);
  console.log(`   Txns:     http://localhost:${PORT}/api/transactions`);
  console.log(`   Feed:     http://localhost:${PORT}/api/moltbook/feed\n`);
});
