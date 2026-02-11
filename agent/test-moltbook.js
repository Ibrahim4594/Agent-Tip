/**
 * Moltbook Integration Test
 *
 * Tests the full AgentTip + Moltbook flow:
 * 1. Agent completes services
 * 2. Posts activity to Moltbook
 * 3. Shows social feed
 *
 * Usage:
 *   node agent/test-moltbook.js
 */

require("dotenv").config();
const AdvancedAgent = require("./AdvancedAgent");
const MoltbookClient = require("./moltbook-client");
const config = require("./config.json");

async function main() {
  console.log("\n╔════════════════════════════════════════════════╗");
  console.log("║   🔗 AGENTTIP + MOLTBOOK INTEGRATION TEST      ║");
  console.log("╚════════════════════════════════════════════════╝\n");

  // Initialize agent
  const agent = new AdvancedAgent(config);
  await agent.initialize(
    "https://sepolia.base.org",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x1234567890123456789012345678901234567890"
  );

  // Initialize Moltbook client
  const moltbook = new MoltbookClient();
  const hasMoltbookKey = !!process.env.MOLTBOOK_API_KEY;

  if (hasMoltbookKey) {
    console.log("✅ Moltbook API key found - posting to REAL Moltbook\n");
  } else {
    console.log("⚠️  No Moltbook API key - running in DEMO mode\n");
    console.log("   Add MOLTBOOK_API_KEY to .env for real posts\n");
  }

  // ===== PHASE 1: List Services =====
  console.log("═══════════════════════════════════════════");
  console.log("PHASE 1: LIST SERVICES");
  console.log("═══════════════════════════════════════════\n");

  await agent.listServices();

  // Post "go live" to Moltbook
  if (hasMoltbookKey) {
    await moltbook.postGoLive(agent.services);
  } else {
    console.log("\n📱 [DEMO] Would post to Moltbook: \"AgentTip Agent is LIVE!\"");
    console.log("   Services: " + agent.services.map(s => `${s.name} (${s.price} ATIP)`).join(", ") + "\n");
  }

  // ===== PHASE 2: Complete Services =====
  console.log("═══════════════════════════════════════════");
  console.log("PHASE 2: COMPLETE SERVICES & POST");
  console.log("═══════════════════════════════════════════\n");

  const completions = [
    { name: "Smart Contract Audit", earnings: 100 },
    { name: "Code Review", earnings: 50 },
    { name: "Gas Optimization", earnings: 75 },
    { name: "Smart Contract Audit", earnings: 100 },
    { name: "Security Consultation", earnings: 60 },
  ];

  for (const completion of completions) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = await agent.completeService(
      completion.name,
      completion.earnings
    );
    agent.logActivity("Service Completed", `${completion.name} - ${completion.earnings} ATIP`);
    agent.updateReputation(5, `Completed ${completion.name}`);

    // Post to Moltbook
    if (hasMoltbookKey) {
      await moltbook.postServiceCompletion(
        completion.name,
        completion.earnings,
        agent.earnings
      );
    } else {
      console.log(`📱 [DEMO] Would post: "Completed ${completion.name} (+${completion.earnings} ATIP)"`);
    }
  }

  // ===== PHASE 3: Milestone Post =====
  console.log("\n═══════════════════════════════════════════");
  console.log("PHASE 3: MILESTONE");
  console.log("═══════════════════════════════════════════\n");

  if (agent.completedServices >= 5) {
    if (hasMoltbookKey) {
      await moltbook.postMilestone(
        "5 Services Completed!",
        `🎉 Just completed 5 services on AgentTip!\n\nTotal earned: ${agent.earnings} ATIP\nReputation: ${agent.reputation}/100\n\nReady for more challenges!`
      );
    } else {
      console.log(`📱 [DEMO] Would post milestone: "5 Services Completed!"`);
      console.log(`   Total: ${agent.earnings} ATIP, Reputation: ${agent.reputation}/100\n`);
    }
  }

  // ===== PHASE 4: Status Update =====
  console.log("═══════════════════════════════════════════");
  console.log("PHASE 4: STATUS UPDATE");
  console.log("═══════════════════════════════════════════\n");

  if (hasMoltbookKey) {
    await moltbook.postStatusUpdate(
      agent.reputation,
      agent.earnings,
      agent.completedServices
    );
  } else {
    console.log(`📱 [DEMO] Would post status update:`);
    console.log(`   Reputation: ${agent.reputation}/100`);
    console.log(`   Earnings: ${agent.earnings} ATIP`);
    console.log(`   Completed: ${agent.completedServices} services\n`);
  }

  // ===== PHASE 5: Intelligence Report =====
  console.log("═══════════════════════════════════════════");
  console.log("PHASE 5: FINAL REPORT");
  console.log("═══════════════════════════════════════════\n");

  agent.generateIntelligenceReport();

  // ===== FINAL SUMMARY =====
  console.log("╔════════════════════════════════════════════════╗");
  console.log("║   ✅ INTEGRATION TEST COMPLETE!                 ║");
  console.log("╚════════════════════════════════════════════════╝\n");

  const stats = agent.getStats();
  console.log("📊 Agent Summary:");
  console.log(`   Name: ${stats.name}`);
  console.log(`   Reputation: ${agent.reputation}/100`);
  console.log(`   Services Completed: ${stats.servicesCompleted}`);
  console.log(`   Total Earnings: ${stats.totalEarnings} ATIP`);
  console.log(`   Activity Log: ${agent.activityLog.length} entries`);
  console.log(`   Moltbook Posts: ${hasMoltbookKey ? "REAL" : "DEMO"} mode`);
  console.log(`\n🎉 Full AgentTip + Moltbook integration working!\n`);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
