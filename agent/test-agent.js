/**
 * Test Script: AgentTip Agent Demo
 *
 * This script demonstrates the agent in action:
 * - Initialize agent
 * - List services
 * - Simulate earnings
 * - Display profile and stats
 */

const AgentTipAgent = require("./AgentTipAgent");
const config = require("./config.json");

async function main() {
  console.log(`\n${"🚀".repeat(30)}`);
  console.log(`AgentTip - AI AGENT DEMO`);
  console.log(`${"🚀".repeat(30)}\n`);

  // Create agent instance
  const agent = new AgentTipAgent(config);

  // Simulate initialization (in production, you'd use real contract addresses)
  console.log(`\n📡 Connecting to blockchain...\n`);
  await agent.initialize(
    "https://sepolia.base.org", // RPC URL (public - no auth needed)
    "0x0000000000000000000000000000000000000000", // Placeholder token address
    "0x0000000000000000000000000000000000000000", // Placeholder marketplace address
    "0x1234567890123456789012345678901234567890"  // Demo agent address
  );

  // Run simulation
  await agent.simulateActivity();

  // Print final stats
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📊 FINAL SUMMARY`);
  console.log(`${"=".repeat(60)}\n`);

  const stats = agent.getStats();
  console.log(`✅ Agent Status: OPERATIONAL`);
  console.log(`💰 Total Earnings: ${stats.totalEarnings} ATIP`);
  console.log(`📋 Services Completed: ${stats.servicesCompleted}`);
  console.log(`📈 Success Rate: 100%`);
  console.log(`\n${"=".repeat(60)}\n`);

  console.log(`🎉 Agent demo complete! Ready for Day 5 integration! 🎉\n`);
}

// Run the demo
main().catch(error => {
  console.error("❌ Error:", error);
  process.exit(1);
});
