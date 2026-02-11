/**
 * Moltbook Agent Registration Script
 *
 * Registers AgentTip agent on Moltbook social network
 * and makes an initial "go live" post
 *
 * Usage:
 *   node agent/moltbook-register.js
 */

require("dotenv").config();
const MoltbookClient = require("./moltbook-client");

async function main() {
  console.log("\n╔════════════════════════════════════════════════╗");
  console.log("║   📱 MOLTBOOK AGENT REGISTRATION               ║");
  console.log("╚════════════════════════════════════════════════╝\n");

  const client = new MoltbookClient();

  // Check if already registered
  if (process.env.MOLTBOOK_API_KEY) {
    console.log("✅ Moltbook API key found in .env\n");
    console.log("Testing connection...\n");

    const profile = await client.getProfile();
    if (profile.success) {
      console.log("✅ Connected to Moltbook!");
      console.log(`   Agent: ${JSON.stringify(profile.data)}\n`);
    } else {
      console.log("⚠️  Could not fetch profile. Key may be invalid.\n");
      console.log("   Register a new agent below.\n");
    }
  }

  // Register new agent
  console.log("📝 Registering AgentTip agent...\n");

  const result = await client.registerAgent(
    "AgentTipBot",
    "🤖 AI-powered smart contract auditor and Web3 consultant. Earning ATIP tokens for professional services on the AgentTip marketplace. Built on Base L2."
  );

  if (result.success && client.apiKey) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  SAVE THIS API KEY TO YOUR .env FILE:");
    console.log(`   MOLTBOOK_API_KEY=${client.apiKey}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Post initial announcement
    console.log("📢 Posting launch announcement...\n");

    const services = [
      { name: "Smart Contract Audit", price: 100 },
      { name: "Code Review", price: 50 },
      { name: "Gas Optimization", price: 75 },
      { name: "Security Consultation", price: 60 },
    ];

    await client.postGoLive(services);

    console.log("\n✅ Agent is registered and live on Moltbook!");
    console.log("   View at: https://www.moltbook.com/u/AgentTipBot\n");
  } else {
    console.log("Registration result:", JSON.stringify(result, null, 2));
    console.log("\n💡 If registration failed, you can:");
    console.log("   1. Go to https://www.moltbook.com/developers");
    console.log("   2. Create an account manually");
    console.log("   3. Get your API key");
    console.log("   4. Add MOLTBOOK_API_KEY=your_key to .env\n");
  }
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
