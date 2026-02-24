/**
 * AgentTip - Eliza Framework Agent
 *
 * Uses the Eliza AI framework for autonomous agent capabilities
 * Integrated with Web3 for blockchain interactions
 *
 * Features:
 * - AI-powered service provider
 * - Blockchain integration (AgentTipToken + AgentMarketplace)
 * - Memory system with conversation history
 * - Reputation tracking
 * - Natural language processing
 */

const Groq = require("groq-sdk");
const { ethers } = require("ethers");
require("dotenv").config();

const AGENT_TIP_TOKEN_ABI = require("../artifacts/contracts/AgentTipToken.sol/AgentTipToken.json")
  .abi;
const AGENT_MARKETPLACE_ABI = require("../artifacts/contracts/AgentMarketplace.sol/AgentMarketplace.json")
  .abi;

class ElizaAgentTipAgent {
  constructor(config = {}) {
    this.name = config.name || "ElizaAgent";
    this.description =
      config.description ||
      "An AI-powered service provider on the AgentTip marketplace";

    // Blockchain
    this.provider = null;
    this.signer = null;
    this.tokenContract = null;
    this.marketplaceContract = null;
    this.agentAddress = null;

    // Agent state
    this.conversationHistory = [];
    this.reputation = 100;
    this.earnings = 0;
    this.completedServices = 0;
    this.listedServices = [];

    // AI Client
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // System prompt for the agent
    this.systemPrompt = `You are ${this.name}, an autonomous AI agent on the AgentTip marketplace.

Your role: Provide professional smart contract audits, code reviews, and Web3 consulting services.

Services offered:
1. Smart Contract Audit - 100 ATIP - Comprehensive security review
2. Code Review - 50 ATIP - Quick feedback on code quality
3. Gas Optimization - 75 ATIP - Reduce contract costs
4. Security Consultation - 60 ATIP - Web3 security best practices

Guidelines:
- Be professional and helpful
- Provide accurate technical information
- Always maintain reputation (currently ${this.reputation}/100)
- Track earnings (currently ${this.earnings} ATIP)
- Log all activities
- Suggest appropriate services based on customer needs

When discussing services, be specific about what you offer and why.
When asked about your status, provide current stats:
- Reputation: ${this.reputation}/100
- Total Earnings: ${this.earnings} ATIP
- Services Completed: ${this.completedServices}`;
  }

  /**
   * Initialize agent with blockchain connection
   */
  async initializeWithWallet(rpcUrl, tokenAddress, marketplaceAddress, privateKey) {
    try {
      console.log("\n🔌 Initializing Eliza Agent with blockchain...\n");

      // Setup provider and signer
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.signer = new ethers.Wallet(privateKey, this.provider);
      this.agentAddress = this.signer.address;

      // Setup contracts
      this.tokenContract = new ethers.Contract(
        tokenAddress,
        AGENT_TIP_TOKEN_ABI,
        this.signer
      );
      this.marketplaceContract = new ethers.Contract(
        marketplaceAddress,
        AGENT_MARKETPLACE_ABI,
        this.signer
      );

      console.log(`✅ Wallet initialized: ${this.agentAddress}`);
      console.log(`✅ Connected to AgentTipToken: ${tokenAddress}`);
      console.log(`✅ Connected to AgentMarketplace: ${marketplaceAddress}\n`);

      return true;
    } catch (error) {
      console.error(`❌ Initialization failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Get balance from blockchain
   */
  async getBalance() {
    if (!this.tokenContract) {
      console.warn("⚠️  Not connected to blockchain - using simulated balance");
      return this.earnings;
    }

    try {
      const balance = await this.tokenContract.balanceOf(this.agentAddress);
      return Number(ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error(`❌ Error getting balance: ${error.message}`);
      return this.earnings;
    }
  }

  /**
   * Process user message with AI
   * Uses Groq for natural language understanding and response
   */
  async processMessage(userMessage) {
    console.log(`\n👤 User: ${userMessage}\n`);

    // Add to conversation history
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    try {
      // Call Groq API
      const response = await this.client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        messages: [
          { role: "system", content: this.systemPrompt },
          ...this.conversationHistory,
        ],
      });

      const assistantMessage = response.choices[0]?.message?.content || "";

      // Add response to history
      this.conversationHistory.push({
        role: "assistant",
        content: assistantMessage,
      });

      // Process any actions in the response
      await this.processAgentActions(userMessage, assistantMessage);

      console.log(`🤖 ${this.name}: ${assistantMessage}\n`);

      return assistantMessage;
    } catch (error) {
      console.error(`❌ Error processing message: ${error.message}`);
      return "I encountered an error processing your request. Please try again.";
    }
  }

  /**
   * Process agent actions based on conversation
   * Handles service listings, completions, etc.
   */
  async processAgentActions(userMessage, response) {
    const lowerMessage = userMessage.toLowerCase();
    const lowerResponse = response.toLowerCase();

    // Detect if user wants to buy a service
    if (
      (lowerMessage.includes("smart contract audit") ||
        lowerMessage.includes("audit")) &&
      !this.listedServices.includes("Smart Contract Audit")
    ) {
      this.listService("Smart Contract Audit", 100);
    }

    if (
      (lowerMessage.includes("code review") || lowerMessage.includes("review")) &&
      !this.listedServices.includes("Code Review")
    ) {
      this.listService("Code Review", 50);
    }

    // Detect if service was completed
    if (
      lowerMessage.includes("completed") ||
      lowerResponse.includes("completed service")
    ) {
      this.completeService("General Service");
    }

    // Track reputation based on sentiment
    if (
      lowerResponse.includes("professional") ||
      lowerResponse.includes("helpful")
    ) {
      this.reputation = Math.min(100, this.reputation + 2);
    }
  }

  /**
   * List a service on the marketplace
   */
  listService(serviceName, price) {
    if (!this.listedServices.includes(serviceName)) {
      this.listedServices.push(serviceName);
      console.log(`\n📝 Listed service: ${serviceName} (${price} ATIP)`);
    }
  }

  /**
   * Complete a service and earn ATIP
   */
  completeService(serviceName) {
    const serviceMap = {
      "Smart Contract Audit": 100,
      "Code Review": 50,
      "Gas Optimization": 75,
      "Security Consultation": 60,
    };

    const earnings = serviceMap[serviceName] || 50;
    this.earnings += earnings;
    this.completedServices += 1;
    this.reputation = Math.min(100, this.reputation + 5);

    console.log(
      `\n✅ Completed: ${serviceName} (+${earnings} ATIP, Reputation: ${this.reputation}/100)`
    );
  }

  /**
   * Get agent status
   */
  getStatus() {
    return {
      name: this.name,
      address: this.agentAddress,
      reputation: this.reputation,
      earnings: this.earnings,
      completedServices: this.completedServices,
      listedServices: this.listedServices,
      conversationCount: this.conversationHistory.length,
    };
  }

  /**
   * Display agent profile
   */
  displayProfile() {
    const status = this.getStatus();

    console.log(`\n╔════════════════════════════════════╗`);
    console.log(`║       🤖 AGENT PROFILE             ║`);
    console.log(`╚════════════════════════════════════╝\n`);

    console.log(`Name: ${status.name}`);
    console.log(`Address: ${status.address || "Not connected"}`);
    console.log(`Reputation: ${status.reputation}/100 ${"⭐".repeat(Math.floor(status.reputation / 20))}`);
    console.log(`Total Earnings: ${status.earnings} ATIP`);
    console.log(`Services Completed: ${status.completedServices}`);
    console.log(`Services Listed: ${status.listedServices.join(", ") || "None"}`);
    console.log(`Conversations: ${status.conversationCount}`);
    console.log();
  }
}

module.exports = ElizaAgentTipAgent;
