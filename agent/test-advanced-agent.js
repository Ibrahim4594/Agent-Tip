/**
 * Test Script: Advanced Agent Features
 *
 * Demonstrates sophisticated agent capabilities:
 * - Reputation system
 * - Dynamic pricing
 * - Service recommendations
 * - Activity logging
 * - Intelligence reports
 * - Moltbook integration (stub)
 */

const AdvancedAgent = require("./AdvancedAgent");
const config = require("./config.json");

async function main() {
  console.log(`\n${"🚀".repeat(30)}`);
  console.log(`ADVANCED AGENT - FULL CAPABILITIES DEMO`);
  console.log(`${"🚀".repeat(30)}\n`);

  // Create advanced agent
  const agent = new AdvancedAgent(config);

  // Initialize
  await agent.initialize(
    "https://sepolia.base.org",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x1234567890123456789012345678901234567890"
  );

  console.log(`\n${"=".repeat(60)}`);
  console.log(`PHASE 1: SETUP & REPUTATION`);
  console.log(`${"=".repeat(60)}\n`);

  agent.logActivity("Startup", "Agent initialized and ready");

  // List services
  console.log(`\n📝 Listing services...\n`);
  await agent.listServices();

  // Generate recommendations
  console.log(`\n${"=".repeat(60)}`);
  console.log(`PHASE 2: MARKET ANALYSIS & RECOMMENDATIONS`);
  console.log(`${"=".repeat(60)}`);

  agent.generateRecommendations("I need to audit my smart contract and optimize gas");

  // Analyze market
  console.log(`${"=".repeat(60)}`);
  console.log(`PHASE 3: MARKET INTELLIGENCE`);
  console.log(`${"=".repeat(60)}`);

  const marketData = {
    demandHighServices: ["Smart Contract Audit", "Security Review"],
    averagePrice: 75,
    competitionLevel: "Medium"
  };

  agent.analyzeMarket(marketData);

  // Simulate service completions
  console.log(`${"=".repeat(60)}`);
  console.log(`PHASE 4: SERVICE COMPLETIONS & EARNINGS`);
  console.log(`${"=".repeat(60)}\n`);

  const serviceCompletions = [
    { name: "Smart Contract Audit", earnings: 100 },
    { name: "Code Review", earnings: 50 },
    { name: "Gas Optimization", earnings: 75 },
    { name: "Smart Contract Audit", earnings: 100 },
    { name: "Security Consultation", earnings: 60 }
  ];

  for (const completion of serviceCompletions) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = await agent.completeService(completion.name, completion.earnings);
    agent.logActivity("Service Completed", `${completion.name} - Earned ${completion.earnings} ATIP`);
    agent.updateReputation(5, `Completed ${completion.name}`);
  }

  // Learn from experience
  console.log(`\n${"=".repeat(60)}`);
  console.log(`PHASE 5: LEARNING & INTELLIGENCE`);
  console.log(`${"=".repeat(60)}`);

  agent.learnFromExperience();

  // Generate reports
  console.log(`\n${"=".repeat(60)}`);
  console.log(`PHASE 6: REPORTING`);
  console.log(`${"=".repeat(60)}`);

  agent.generateIntelligenceReport();

  // Display profile
  console.log(`${"=".repeat(60)}`);
  console.log(`PHASE 7: AGENT PROFILE`);
  console.log(`${"=".repeat(60)}`);

  agent.displayProfile();

  // Prepare Moltbook posts
  console.log(`${"=".repeat(60)}`);
  console.log(`PHASE 8: SOCIAL PRESENCE (MOLTBOOK)`);
  console.log(`${"=".repeat(60)}`);

  const activityPost = agent.prepareMoltbookPost("activity");
  const expertisePost = agent.prepareMoltbookPost("expertise");
  const milestonePost = agent.prepareMoltbookPost("milestone");

  // Display activity log
  console.log(`${"=".repeat(60)}`);
  console.log(`PHASE 9: ACTIVITY HISTORY`);
  console.log(`${"=".repeat(60)}`);

  agent.displayActivityLog(15);

  // Final summary
  console.log(`${"=".repeat(60)}`);
  console.log(`✅ ADVANCED AGENT DEMO COMPLETE!`);
  console.log(`${"=".repeat(60)}\n`);

  const stats = agent.getStats();
  console.log(`📊 Final Statistics:`);
  console.log(`   Agent: ${stats.name}`);
  console.log(`   Reputation: ${agent.reputation}/100`);
  console.log(`   Services Listed: ${stats.servicesListed}`);
  console.log(`   Services Completed: ${stats.servicesCompleted}`);
  console.log(`   Total Earnings: ${stats.totalEarnings} ATIP`);
  console.log(`   Activity Log Entries: ${agent.activityLog.length}`);
  console.log(`   Moltbook Posts Prepared: 3`);
  console.log(`\n🎉 Agent is fully operational and ready for production!\n`);
}

// Run the demo
main().catch(error => {
  console.error("❌ Error:", error);
  process.exit(1);
});
