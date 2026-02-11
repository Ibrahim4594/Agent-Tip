/**
 * AgentTip Agent
 *
 * AI agent that:
 * - Lists services on the marketplace
 * - Responds to requests
 * - Earns ATIP tokens
 * - Posts activity to Moltbook (future)
 * - Completes services
 */

const { ethers } = require("ethers");
const config = require("./config.json");

// Contract ABIs (minimal - just functions we need)
const TOKEN_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

const MARKETPLACE_ABI = [
  "function createService(string memory name, string memory description, uint256 price) external returns (uint256)",
  "function purchaseService(uint256 serviceId) external",
  "function completeService(uint256 serviceId) external",
  "function getService(uint256 serviceId) external view returns (tuple(uint256,address,string,string,uint256,uint8,address,uint256,uint256,uint256))",
  "function getActiveServices() external view returns (uint256[])",
  "event ServiceCreated(uint256 indexed serviceId, address indexed agent, string name, uint256 price)",
  "event ServicePurchased(uint256 indexed serviceId, address indexed buyer, address indexed agent, uint256 price, uint256 fee)",
  "event ServiceCompleted(uint256 indexed serviceId, address indexed agent, address indexed buyer)"
];

class AgentTipAgent {
  constructor(config) {
    this.config = config;
    this.agentName = config.agent.name;
    this.services = config.agent.services;
    this.listedServices = [];
    this.earnings = 0;
    this.completedServices = 0;

    console.log(`\n🤖 ${this.agentName} Agent Initialized!`);
    console.log(`📝 Services available: ${this.services.length}`);
    console.log(`💼 Ready to earn ATIP tokens!\n`);
  }

  /**
   * Initialize blockchain connections
   * @param {string} rpcUrl - RPC endpoint
   * @param {string} tokenAddress - Token contract address
   * @param {string} marketplaceAddress - Marketplace contract address
   * @param {string} agentWalletAddress - Agent's wallet address
   */
  async initialize(rpcUrl, tokenAddress, marketplaceAddress, agentWalletAddress) {
    try {
      // Create provider
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      // Create token contract instance (read-only)
      this.tokenContract = new ethers.Contract(
        tokenAddress,
        TOKEN_ABI,
        this.provider
      );

      // Create marketplace contract instance (read-only for now)
      this.marketplaceContract = new ethers.Contract(
        marketplaceAddress,
        MARKETPLACE_ABI,
        this.provider
      );

      this.agentAddress = agentWalletAddress;

      console.log(`✅ Blockchain connections initialized`);
      console.log(`📍 Agent Address: ${this.agentAddress}`);
      console.log(`🔗 Token Contract: ${tokenAddress}`);
      console.log(`🏪 Marketplace Contract: ${marketplaceAddress}\n`);

      return true;
    } catch (error) {
      console.error("❌ Initialization failed:", error);
      return false;
    }
  }

  /**
   * List all services on the marketplace
   * This simulates the agent listing its services
   */
  async listServices() {
    console.log(`\n📝 ${this.agentName} is listing services...\n`);

    for (const service of this.services) {
      try {
        // In a real scenario, we would call marketplace.createService()
        // For now, we simulate it for demonstration
        this.listedServices.push({
          ...service,
          listedAt: new Date(),
          status: "active"
        });

        console.log(`✅ Listed: ${service.name}`);
        console.log(`   💰 Price: ${service.price} ATIP`);
        console.log(`   📝 ${service.description}\n`);
      } catch (error) {
        console.error(`❌ Failed to list ${service.name}:`, error);
      }
    }

    console.log(`📊 Total services listed: ${this.listedServices.length}\n`);
    return this.listedServices;
  }

  /**
   * Get agent's current ATIP balance
   */
  async getBalance() {
    try {
      const balance = await this.tokenContract.balanceOf(this.agentAddress);
      const balanceInATIP = ethers.formatEther(balance);
      return balanceInATIP;
    } catch (error) {
      console.error("❌ Failed to get balance:", error);
      return "0";
    }
  }

  /**
   * Simulate completing a service and earning ATIP
   * @param {string} serviceName - Name of service completed
   * @param {number} earningAmount - Amount earned
   */
  async completeService(serviceName, earningAmount) {
    console.log(`\n🎯 Completing service: ${serviceName}`);
    console.log(`💰 Earning: ${earningAmount} ATIP`);

    this.earnings += earningAmount;
    this.completedServices += 1;

    console.log(`✅ Service completed!`);
    console.log(`📊 Total earnings so far: ${this.earnings} ATIP`);
    console.log(`📈 Services completed: ${this.completedServices}\n`);

    return {
      serviceName,
      earnings: earningAmount,
      totalEarnings: this.earnings,
      completedServices: this.completedServices
    };
  }

  /**
   * Get agent's statistics
   */
  getStats() {
    return {
      name: this.agentName,
      address: this.agentAddress,
      servicesListed: this.listedServices.length,
      servicesCompleted: this.completedServices,
      totalEarnings: this.earnings,
      averageServicePrice: this.services.length > 0
        ? this.services.reduce((sum, s) => sum + s.price, 0) / this.services.length
        : 0
    };
  }

  /**
   * Display agent profile
   */
  displayProfile() {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🤖 AGENT PROFILE`);
    console.log(`${"=".repeat(60)}`);

    const stats = this.getStats();

    console.log(`Name: ${stats.name}`);
    console.log(`Address: ${stats.address}`);
    console.log(`Description: ${this.config.agent.description}`);
    console.log(`Personality: ${this.config.agent.personality}`);
    console.log(`\n📊 STATISTICS:`);
    console.log(`   Services Listed: ${stats.servicesListed}`);
    console.log(`   Services Completed: ${stats.servicesCompleted}`);
    console.log(`   Total Earnings: ${stats.totalEarnings} ATIP`);
    console.log(`   Average Service Price: ${stats.averageServicePrice.toFixed(2)} ATIP`);
    console.log(`\n📝 SERVICES OFFERED:`);

    this.services.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name}`);
      console.log(`      💰 ${service.price} ATIP`);
      console.log(`      📝 ${service.description}`);
    });

    console.log(`\n${"=".repeat(60)}\n`);
  }

  /**
   * Simulate agent activity (for demo)
   */
  async simulateActivity() {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🎬 SIMULATING AGENT ACTIVITY`);
    console.log(`${"=".repeat(60)}\n`);

    // Simulate listing services
    await this.listServices();

    // Simulate completing services
    console.log(`📋 Simulating service completions:\n`);

    const completions = [
      { name: "Smart Contract Audit", earnings: 100 },
      { name: "Code Review", earnings: 50 },
      { name: "Gas Optimization", earnings: 75 }
    ];

    for (const completion of completions) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
      await this.completeService(completion.name, completion.earnings);
    }

    // Display final profile
    this.displayProfile();
  }

  /**
   * Log agent activity to console with formatting
   */
  log(message, level = "info") {
    const levels = {
      info: "ℹ️",
      success: "✅",
      warning: "⚠️",
      error: "❌",
      money: "💰"
    };

    console.log(`${levels[level] || level} ${message}`);
  }
}

module.exports = AgentTipAgent;
