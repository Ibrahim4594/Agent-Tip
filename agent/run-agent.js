/**
 * AgentTip Agent - Production Runner
 *
 * Runs the agent with blockchain integration
 * This is what will run on Day 5 with real contracts
 */

require("dotenv").config();
const AgentWithContracts = require("./AgentWithContracts");
const config = require("./config.json");

async function main() {
  console.log(`\n${"🚀".repeat(30)}`);
  console.log(`AgentTip - PRODUCTION AGENT RUNNER`);
  console.log(`${"🚀".repeat(30)}\n`);

  // Create agent
  const agent = new AgentWithContracts(config);

  // Check if we have contract addresses
  const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS;
  const marketplaceAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;

  if (!tokenAddress || !marketplaceAddress) {
    console.log(`⚠️  WARNING: Contract addresses not set in .env`);
    console.log(`📝 Set these environment variables to connect:\n`);
    console.log(`   TOKEN_CONTRACT_ADDRESS=0x...`);
    console.log(`   MARKETPLACE_CONTRACT_ADDRESS=0x...`);
    console.log(`   PRIVATE_KEY=0x...\n`);

    console.log(`Running demo mode instead...\n`);

    // Run demo
    await agent.simulateActivity();
    return;
  }

  if (!privateKey) {
    console.log(`❌ ERROR: PRIVATE_KEY not set in .env`);
    console.log(`⚠️  Cannot run without private key for transactions\n`);
    return;
  }

  console.log(`✅ Contract addresses found!`);
  console.log(`📍 Token: ${tokenAddress}`);
  console.log(`📍 Marketplace: ${marketplaceAddress}\n`);

  try {
    // Initialize with wallet
    const rpcUrl = process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";
    const initialized = await agent.initializeWithWallet(
      rpcUrl,
      tokenAddress,
      marketplaceAddress,
      privateKey
    );

    if (!initialized) {
      console.log(`❌ Failed to initialize agent\n`);
      return;
    }

    // Display wallet info
    await agent.displayWalletInfo();

    // Setup event listeners
    agent.setupEventListeners();

    // List services
    console.log(`📝 Listing services on blockchain...\n`);
    await agent.listServicesOnChain();

    // Get balance
    const balance = await agent.getBalanceFromChain();
    console.log(`💰 Current ATIP balance: ${balance}\n`);

    // Display profile
    agent.displayProfile();

    console.log(`✅ Agent is running and listening for events!`);
    console.log(`📊 Agent will process the following services:`);
    agent.services.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.name} (${s.price} ATIP)`);
    });
    console.log(`\n🎯 Agent is ready to earn! Waiting for service purchases...\n`);

  } catch (error) {
    console.error(`❌ Error:`, error);
  }
}

// Run the agent
main().catch(error => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
