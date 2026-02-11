/**
 * DAY 5 DEPLOYMENT SCRIPT
 *
 * Deploys AgentTip contracts to Base Sepolia testnet
 *
 * Usage:
 *   npx hardhat run scripts/deploy-day5.js --network baseSepolia
 *
 * Before running:
 *   1. Set PRIVATE_KEY in .env
 *   2. Have testnet ETH in your wallet
 */

require("dotenv").config();
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Colors for console output
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
  log("blue", "║        🚀 DAY 5 - AGENTIP DEPLOYMENT          ║");
  log("blue", "╚════════════════════════════════════════════════╝\n");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  log("yellow", `📝 Deploying with account: ${deployer.address}`);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceETH = hre.ethers.formatEther(balance);
  log("yellow", `💰 Account balance: ${balanceETH} ETH\n`);

  if (balance === 0n) {
    log("red", "❌ ERROR: Account has no ETH for gas fees!");
    log("red", "   Get testnet ETH from faucet first:\n");
    log("red", "   https://www.coinbase.com/faucets/base-sepolia-faucet");
    process.exit(1);
  }

  try {
    // ===== DEPLOY AGENTIPTOKEN =====
    log("bright", "Step 1: Deploying AgentTipToken...\n");

    const AgentTipToken = await hre.ethers.getContractFactory("AgentTipToken");
    const token = await AgentTipToken.deploy();
    await token.waitForDeployment();

    const tokenAddress = await token.getAddress();
    log("green", `✅ AgentTipToken deployed: ${tokenAddress}\n`);

    // Get initial supply
    const initialSupply = await token.balanceOf(deployer.address);
    log("green", `   Initial supply: ${hre.ethers.formatEther(initialSupply)} ATIP\n`);

    // ===== DEPLOY AGENTMARKETPLACE =====
    log("bright", "Step 2: Deploying AgentMarketplace...\n");

    const AgentMarketplace = await hre.ethers.getContractFactory(
      "AgentMarketplace"
    );
    const marketplace = await AgentMarketplace.deploy(tokenAddress);
    await marketplace.waitForDeployment();

    const marketplaceAddress = await marketplace.getAddress();
    log("green", `✅ AgentMarketplace deployed: ${marketplaceAddress}\n`);

    // ===== SAVE ADDRESSES =====
    log("bright", "Step 3: Saving addresses to .env...\n");

    const envPath = path.join(__dirname, "..", ".env");
    let envContent = fs.readFileSync(envPath, "utf-8");

    // Update contract addresses
    envContent = envContent.replace(
      /TOKEN_CONTRACT_ADDRESS=.*/,
      `TOKEN_CONTRACT_ADDRESS=${tokenAddress}`
    );
    envContent = envContent.replace(
      /MARKETPLACE_CONTRACT_ADDRESS=.*/,
      `MARKETPLACE_CONTRACT_ADDRESS=${marketplaceAddress}`
    );

    fs.writeFileSync(envPath, envContent);
    log("green", "✅ Addresses saved to .env\n");

    // ===== DISPLAY SUMMARY =====
    log("bright", "╔════════════════════════════════════════════════╗");
    log("bright", "║           ✅ DEPLOYMENT COMPLETE!              ║");
    log("bright", "╚════════════════════════════════════════════════╝\n");

    console.log("📋 Contract Addresses:");
    console.log(`   Token:       ${tokenAddress}`);
    console.log(`   Marketplace: ${marketplaceAddress}\n`);

    console.log("📊 Network Information:");
    console.log(`   Network: ${hre.network.name}`);
    console.log(`   Chain ID: 84532`);
    console.log(`   RPC: https://sepolia.base.org\n`);

    // ===== VERIFICATION =====
    log("bright", "Next Steps:");
    console.log("\n1️⃣  Verify contracts on BaseScan:");
    console.log(
      `   npx hardhat verify --network baseSepolia ${tokenAddress}`
    );
    console.log(
      `   npx hardhat verify --network baseSepolia ${marketplaceAddress} ${tokenAddress}\n`
    );

    console.log("2️⃣  Test with the agent:");
    console.log(`   node agent/run-agent.js\n`);

    console.log("3️⃣  View on Block Explorer:");
    console.log(
      `   https://sepolia.basescan.org/address/${tokenAddress} (Token)`
    );
    console.log(
      `   https://sepolia.basescan.org/address/${marketplaceAddress} (Marketplace)\n`
    );

    log("green", "🎉 Ready for Day 5 agent testing!\n");

    // Save deployment info to file
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      network: hre.network.name,
      chainId: 84532,
      deployer: deployer.address,
      contracts: {
        token: tokenAddress,
        marketplace: marketplaceAddress,
      },
      links: {
        token: `https://sepolia.basescan.org/address/${tokenAddress}`,
        marketplace: `https://sepolia.basescan.org/address/${marketplaceAddress}`,
      },
    };

    const infoPath = path.join(__dirname, "..", "deployment-info-day5.json");
    fs.writeFileSync(infoPath, JSON.stringify(deploymentInfo, null, 2));
    log("green", `✅ Deployment info saved to deployment-info-day5.json\n`);
  } catch (error) {
    log("red", `❌ Deployment failed:\n`);
    console.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  log("red", `Fatal error: ${error.message}`);
  process.exit(1);
});
