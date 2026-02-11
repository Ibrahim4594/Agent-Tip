/**
 * AgentTipAgent - Contract Integration Version
 *
 * This version actually connects to your smart contracts
 * and can perform real blockchain transactions
 */

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Import agent base class
const AgentTipAgent = require("./AgentTipAgent");

// Contract ABIs from artifacts
const TOKEN_ABI = require("../artifacts/contracts/AgentTipToken.sol/AgentTipToken.json").abi;
const MARKETPLACE_ABI = require("../artifacts/contracts/AgentMarketplace.sol/AgentMarketplace.json").abi;

class AgentWithContracts extends AgentTipAgent {
  constructor(config) {
    super(config);
  }

  /**
   * Initialize with actual contracts and wallet
   */
  async initializeWithWallet(rpcUrl, tokenAddress, marketplaceAddress, privateKey) {
    try {
      // Create provider and signer
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.signer = new ethers.Wallet(privateKey, this.provider);

      // Create writable contract instances
      this.tokenContract = new ethers.Contract(
        tokenAddress,
        TOKEN_ABI,
        this.signer
      );

      this.marketplaceContract = new ethers.Contract(
        marketplaceAddress,
        MARKETPLACE_ABI,
        this.signer
      );

      this.agentAddress = this.signer.address;

      console.log(`\n✅ Wallet connected!`);
      console.log(`📍 Agent Address: ${this.agentAddress}\n`);

      return true;
    } catch (error) {
      console.error("❌ Wallet initialization failed:", error);
      return false;
    }
  }

  /**
   * List services on the actual marketplace contract
   */
  async listServicesOnChain() {
    console.log(`\n📝 Listing services on blockchain...\n`);

    for (const service of this.services) {
      try {
        // Call marketplace contract
        const tx = await this.marketplaceContract.createService(
          service.name,
          service.description,
          ethers.parseEther(service.price.toString())
        );

        console.log(`⏳ Creating ${service.name}...`);
        const receipt = await tx.wait();

        console.log(`✅ ${service.name} listed!`);
        console.log(`   💰 Price: ${service.price} ATIP`);
        console.log(`   🔗 TX: ${receipt.hash}\n`);

        this.listedServices.push({
          ...service,
          listedAt: new Date(),
          status: "active",
          txHash: receipt.hash
        });
      } catch (error) {
        console.error(`❌ Failed to list ${service.name}:`, error.message);
      }
    }

    console.log(`📊 Services listed: ${this.listedServices.length}\n`);
  }

  /**
   * Get actual balance from token contract
   */
  async getBalanceFromChain() {
    try {
      const balance = await this.tokenContract.balanceOf(this.agentAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("❌ Failed to get balance:", error);
      return "0";
    }
  }

  /**
   * Complete a service on the marketplace contract
   */
  async completeServiceOnChain(serviceId) {
    try {
      console.log(`\n🎯 Completing service ${serviceId}...`);

      const tx = await this.marketplaceContract.completeService(serviceId);
      const receipt = await tx.wait();

      console.log(`✅ Service completed!`);
      console.log(`   🔗 TX: ${receipt.hash}\n`);

      return receipt;
    } catch (error) {
      console.error(`❌ Failed to complete service:`, error.message);
      return null;
    }
  }

  /**
   * Listen for marketplace events
   */
  setupEventListeners() {
    console.log(`\n📡 Setting up event listeners...\n`);

    // Listen for ServicePurchased events
    this.marketplaceContract.on("ServicePurchased", (serviceId, buyer, agent, price, fee) => {
      console.log(`\n💰 SERVICE PURCHASED!`);
      console.log(`   Service ID: ${serviceId}`);
      console.log(`   Buyer: ${buyer}`);
      console.log(`   Price: ${ethers.formatEther(price)} ATIP`);
      console.log(`   Fee: ${ethers.formatEther(fee)} ATIP\n`);
    });

    console.log(`✅ Listening for marketplace events...\n`);
  }

  /**
   * Display wallet information
   */
  async displayWalletInfo() {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`💼 WALLET INFORMATION`);
    console.log(`${"=".repeat(60)}`);

    try {
      const balance = await this.provider.getBalance(this.agentAddress);
      const tokenBalance = await this.getBalanceFromChain();

      console.log(`Address: ${this.agentAddress}`);
      console.log(`ETH Balance: ${ethers.formatEther(balance)} ETH`);
      console.log(`ATIP Balance: ${tokenBalance} ATIP`);
      console.log(`\n${"=".repeat(60)}\n`);
    } catch (error) {
      console.error("❌ Failed to fetch wallet info:", error);
    }
  }
}

module.exports = AgentWithContracts;
