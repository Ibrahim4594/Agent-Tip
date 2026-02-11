/**
 * AgentTip - Eliza Agent Interactive Runner
 *
 * Run this to have an interactive conversation with the Eliza-powered agent
 *
 * Usage:
 *   node agent/run-eliza-agent.js
 *
 * Features:
 * - Interactive conversation with AI agent
 * - Blockchain integration (when deployed)
 * - Real-time reputation tracking
 * - Service listing and completion
 */

const readline = require("readline");
const ElizaAgentTipAgent = require("./eliza-agent");
require("dotenv").config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

async function main() {
  log("blue", "\n╔════════════════════════════════════════════════╗");
  log("blue", "║     🤖 AGENTIP - ELIZA FRAMEWORK AGENT         ║");
  log("blue", "╚════════════════════════════════════════════════╝\n");

  // Create agent
  const agent = new ElizaAgentTipAgent({
    name: "ElizaBot",
    description:
      "An AI-powered smart contract auditor and Web3 consultant powered by Eliza",
  });

  // Try to connect to blockchain if addresses are set
  const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS;
  const marketplaceAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;

  if (tokenAddress && marketplaceAddress && privateKey) {
    log("yellow", "🔗 Connecting to blockchain...\n");

    const rpcUrl = process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";
    const initialized = await agent.initializeWithWallet(
      rpcUrl,
      tokenAddress,
      marketplaceAddress,
      privateKey
    );

    if (initialized) {
      log("green", "✅ Connected to AgentTip contracts on Base Sepolia!\n");
      agent.displayProfile();
    } else {
      log("yellow", "⚠️  Running in demo mode (not connected to blockchain)\n");
    }
  } else {
    log("yellow", "⚠️  Running in demo mode (no contract addresses in .env)\n");
    log("cyan", "Tip: Deploy contracts first, then add addresses to .env\n");
  }

  // Show agent info
  log("bright", "📋 About This Agent:\n");
  console.log(`Name: ${agent.name}`);
  console.log(`Role: Smart Contract Auditor & Web3 Consultant`);
  console.log(`Reputation: ${agent.reputation}/100`);
  console.log(
    `\nServices: Smart Contract Audit, Code Review, Gas Optimization, Security Consultation\n`
  );

  log("bright", "Commands:\n");
  console.log("`/status` - Show agent status");
  console.log("`/profile` - Show detailed profile");
  console.log("`/help` - Show all commands");
  console.log("`/exit` - Exit the agent\n");

  log("cyan", "Start typing to chat with the agent!\n");

  // Interactive conversation loop
  const askQuestion = () => {
    rl.question(log("yellow", "You: "), async (input) => {
      const trimmedInput = input.trim();

      if (!trimmedInput) {
        askQuestion();
        return;
      }

      // Handle special commands
      if (trimmedInput.toLowerCase() === "/exit") {
        log("bright", "\n👋 Agent signing off. Goodbye!\n");
        agent.displayProfile();
        rl.close();
        return;
      }

      if (trimmedInput.toLowerCase() === "/status") {
        const status = agent.getStatus();
        console.log(JSON.stringify(status, null, 2));
        askQuestion();
        return;
      }

      if (trimmedInput.toLowerCase() === "/profile") {
        agent.displayProfile();
        askQuestion();
        return;
      }

      if (trimmedInput.toLowerCase() === "/help") {
        log("cyan", "\n📚 Available Commands:\n");
        console.log("/status   - Show agent statistics");
        console.log("/profile  - Show detailed profile");
        console.log("/balance  - Check ATIP balance");
        console.log("/help     - Show this help menu");
        console.log("/exit     - Exit the agent\n");
        console.log("💬 Just type naturally to chat with the agent!\n");
        askQuestion();
        return;
      }

      if (trimmedInput.toLowerCase() === "/balance") {
        const balance = await agent.getBalance();
        log("yellow", `\n💰 ATIP Balance: ${balance}\n`);
        askQuestion();
        return;
      }

      // Process as conversation
      try {
        await agent.processMessage(trimmedInput);
      } catch (error) {
        log("red", `\n❌ Error: ${error.message}\n`);
      }

      askQuestion();
    });
  };

  // Start conversation
  askQuestion();
}

// Run the agent
main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
