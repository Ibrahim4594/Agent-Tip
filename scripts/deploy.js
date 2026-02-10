// Deployment script for AgentTip contracts
const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy Lock contract (example - we'll replace with AgentTipToken later)
  console.log("📦 Deploying Lock contract...");

  const unlockTime = Math.floor(Date.now() / 1000) + 60; // Unlock in 1 minute
  const lockedAmount = hre.ethers.parseEther("0.001");

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  await lock.waitForDeployment();

  const lockAddress = await lock.getAddress();
  console.log("✅ Lock deployed to:", lockAddress);
  console.log("🔓 Unlock time:", new Date(unlockTime * 1000).toLocaleString());
  console.log("💵 Locked amount:", hre.ethers.formatEther(lockedAmount), "ETH\n");

  // Save deployment info
  console.log("📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Network:", hre.network.name);
  console.log("Contract:", lockAddress);
  console.log("Deployer:", deployer.address);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("📝 To verify on block explorer, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${lockAddress} ${unlockTime}`);
  }
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
