/**
 * DAY 5 - TEST DEPLOYED CONTRACTS
 *
 * Tests the deployed AgentTip contracts on Base Sepolia
 * Shows the agent can interact with real contracts
 *
 * Usage:
 *   node scripts/test-deployed.js
 */

require("dotenv").config();
const hre = require("hardhat");
const AgentWithContracts = require("../agent/AgentWithContracts");
const config = require("../agent/config.json");

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

function log(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

async function main() {
  log("blue", "\n╔════════════════════════════════════════════════╗");
  log("blue", "║      🧪 DAY 5 - DEPLOYED CONTRACT TEST        ║");
  log("blue", "╚════════════════════════════════════════════════╝\n");

  // Check for contract addresses
  const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS;
  const marketplaceAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;

  if (!tokenAddress || !marketplaceAddress) {
    log("red", "❌ ERROR: Contract addresses not found in .env\n");
    log("yellow", "Please run deployment first:");
    console.log("   npx hardhat run scripts/deploy-day5.js --network baseSepolia\n");
    process.exit(1);
  }

  if (!privateKey) {
    log("red", "❌ ERROR: PRIVATE_KEY not set in .env\n");
    log("yellow", "Add your MetaMask private key to .env file");
    process.exit(1);
  }

  log("bright", "Step 1: Connecting to deployed contracts...\n");

  // Initialize agent with deployed contracts
  const agent = new AgentWithContracts(config);

  try {
    const rpcUrl = process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";

    // Initialize with wallet
    const initialized = await agent.initializeWithWallet(
      rpcUrl,
      tokenAddress,
      marketplaceAddress,
      privateKey
    );

    if (!initialized) {
      log("red", "❌ Failed to initialize agent\n");
      process.exit(1);
    }

    log("green", "✅ Agent connected to deployed contracts\n");

    // Display wallet info
    log("bright", "Step 2: Checking wallet balance...\n");
    await agent.displayWalletInfo();

    // Get balance
    log("bright", "Step 3: Getting ATIP token balance...\n");
    const balance = await agent.getBalanceFromChain();
    log("yellow", `💰 ATIP Balance: ${balance}\n`);

    // Display available services
    log("bright", "Step 4: Available services for agent...\n");
    agent.services.forEach((service, i) => {
      console.log(`${i + 1}. ${service.name} - ${service.price} ATIP`);
      console.log(`   ${service.description}\n`);
    });

    // Show next steps
    log("bright", "╔════════════════════════════════════════════════╗");
    log("bright", "║           ✅ AGENT READY FOR WORK!             ║");
    log("bright", "╚════════════════════════════════════════════════╝\n");

    log("yellow", "📝 Agent Details:");
    console.log(`   Name: ${agent.agentName}`);
    console.log(`   Address: ${agent.agentAddress}`);
    console.log(`   Network: Base Sepolia (84532)\n`);

    log("yellow", "🎯 Next Steps:");
    console.log(`\n1. Create a service listing on marketplace:`);
    console.log(`   await agent.listServicesOnChain()\n`);

    console.log(`2. Monitor for service purchases:\n`);
    console.log(`   agent.setupEventListeners()\n`);

    console.log(`3. Complete services and earn ATIP:\n`);
    console.log(`   await agent.completeServiceOnChain(serviceId)\n`);

    log("green", "✅ Agent is ready to earn tokens!\n");
  } catch (error) {
    log("red", `❌ Error: ${error.message}\n`);
    if (error.code === "INVALID_ARGUMENT") {
      log("red", "Make sure contract addresses are correct in .env");
    }
    process.exit(1);
  }
}

main().catch((error) => {
  log("red", `Fatal error: ${error.message}`);
  process.exit(1);
});
