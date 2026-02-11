/**
 * AdvancedAgent - Extended Features
 *
 * More sophisticated agent with:
 * - Dynamic pricing
 * - Service recommendations
 * - Reputation system
 * - Activity logging
 * - Moltbook integration (stub)
 */

const AgentWithContracts = require("./AgentWithContracts");

class AdvancedAgent extends AgentWithContracts {
  constructor(config) {
    super(config);
    this.reputation = 100; // Start with 100 rep
    this.activityLog = [];
    this.recommendations = [];
  }

  /**
   * Log activity with timestamp
   */
  logActivity(action, details) {
    const entry = {
      timestamp: new Date(),
      action,
      details,
      reputation: this.reputation
    };

    this.activityLog.push(entry);

    // Keep only last 100 activities
    if (this.activityLog.length > 100) {
      this.activityLog.shift();
    }

    console.log(`📝 [${entry.timestamp.toLocaleTimeString()}] ${action}: ${details}`);
  }

  /**
   * Calculate dynamic price based on demand
   * @param {number} basePrice - Original price
   * @param {number} demandLevel - 0-100 (higher = more expensive)
   */
  calculateDynamicPrice(basePrice, demandLevel = 50) {
    // Price increases with demand
    const multiplier = 1 + (demandLevel / 100) * 0.5; // Up to 1.5x
    return Math.round(basePrice * multiplier);
  }

  /**
   * Update reputation based on activity
   * @param {number} change - +/- reputation points
   * @param {string} reason - Why reputation changed
   */
  updateReputation(change, reason) {
    this.reputation = Math.max(0, Math.min(100, this.reputation + change));
    this.logActivity("Reputation", `${change > 0 ? "+" : ""}${change} (${reason}) -> ${this.reputation}`);
  }

  /**
   * Generate service recommendations
   * @param {string} userNeeds - What user is looking for
   */
  generateRecommendations(userNeeds) {
    console.log(`\n💡 Analyzing user needs: "${userNeeds}"\n`);

    const recommendations = [];

    if (userNeeds.includes("smart contract") || userNeeds.includes("audit")) {
      recommendations.push({
        service: "Smart Contract Audit",
        reason: "You need comprehensive contract review",
        priority: 1
      });
    }

    if (userNeeds.includes("code") || userNeeds.includes("review")) {
      recommendations.push({
        service: "Code Review",
        reason: "Quick feedback on your code",
        priority: 2
      });
    }

    if (userNeeds.includes("gas") || userNeeds.includes("optimize")) {
      recommendations.push({
        service: "Gas Optimization",
        reason: "Reduce your contract costs",
        priority: 1
      });
    }

    if (userNeeds.includes("security")) {
      recommendations.push({
        service: "Security Consultation",
        reason: "Learn about Web3 security best practices",
        priority: 1
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        service: "Code Review",
        reason: "Start with a general review",
        priority: 2
      });
    }

    this.recommendations = recommendations;

    console.log(`🎯 Recommendations:\n`);
    recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec.service}`);
      console.log(`   📝 ${rec.reason}`);
      console.log(`   ⭐ Priority: ${rec.priority}\n`);
    });

    return recommendations;
  }

  /**
   * Simulate learning from experience
   */
  learnFromExperience() {
    console.log(`\n🧠 Agent is learning from experience...\n`);

    const completedCount = this.completedServices;
    const totalEarned = this.earnings;

    // Increase reputation with successful completions
    if (completedCount > 0) {
      this.updateReputation(Math.min(10, completedCount), "Successful service completions");
    }

    // Calculate success metrics
    const avgEarningsPerService = completedCount > 0 ? totalEarned / completedCount : 0;

    console.log(`📊 Experience Summary:`);
    console.log(`   Services Completed: ${completedCount}`);
    console.log(`   Total Earned: ${totalEarned} ATIP`);
    console.log(`   Avg per Service: ${avgEarningsPerService.toFixed(2)} ATIP`);
    console.log(`   Reputation: ${this.reputation}/100\n`);

    this.logActivity("Learning", `Learned from ${completedCount} services`);
  }

  /**
   * Prepare post for Moltbook (simulated)
   */
  prepareMoltbookPost(postType = "activity") {
    let postContent = "";

    switch (postType) {
      case "activity":
        postContent = `Just completed a service! Earned ${this.earnings} ATIP total. 💰 #AgentTip #Web3`;
        break;

      case "milestone":
        if (this.completedServices >= 10) {
          postContent = `🎉 Just hit 10 services completed! Ready to take on more. 💪 #AgentTip`;
        } else if (this.completedServices >= 5) {
          postContent = `🌟 5 services completed and going strong! #AgentTip #Agent`;
        }
        break;

      case "expertise":
        postContent = `Expertise: ${this.config.agent.description}\nReputation: ${this.reputation}/100 ⭐`;
        break;

      default:
        postContent = `Active on AgentTip marketplace. Offering quality services. #AgentTip`;
    }

    console.log(`\n📱 Moltbook Post Ready:\n`);
    console.log(`"${postContent}"\n`);

    this.logActivity("Moltbook", `Prepared ${postType} post`);

    return {
      type: postType,
      content: postContent,
      timestamp: new Date(),
      author: this.agentName
    };
  }

  /**
   * Get agent intelligence report
   */
  generateIntelligenceReport() {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🧠 AGENT INTELLIGENCE REPORT`);
    console.log(`${"=".repeat(60)}\n`);

    const avgCompletion = this.completedServices > 0
      ? this.earnings / this.completedServices
      : 0;

    const reputation = this.reputation;
    const successRate = this.completedServices > 0 ? 100 : 0;

    console.log(`Agent: ${this.agentName}`);
    console.log(`Reputation: ${reputation}/100 ${"⭐".repeat(Math.floor(reputation / 20))}`);
    console.log(`\n📊 Performance Metrics:`);
    console.log(`   Services Listed: ${this.listedServices.length}`);
    console.log(`   Services Completed: ${this.completedServices}`);
    console.log(`   Success Rate: ${successRate}%`);
    console.log(`   Total Earnings: ${this.earnings} ATIP`);
    console.log(`   Avg per Service: ${avgCompletion.toFixed(2)} ATIP`);

    console.log(`\n🎯 Strengths:`);
    if (this.reputation >= 80) {
      console.log(`   ✅ High reputation - clients trust this agent`);
    }
    if (this.completedServices > 5) {
      console.log(`   ✅ Experienced - has completed many services`);
    }
    if (this.earnings > 500) {
      console.log(`   ✅ Successful - generating significant revenue`);
    }

    console.log(`\n${"=".repeat(60)}\n`);
  }

  /**
   * Analyze market opportunity
   */
  analyzeMarket(marketData) {
    console.log(`\n📊 Market Analysis:\n`);

    if (marketData.demandHighServices) {
      console.log(`🔥 High Demand Services:`);
      marketData.demandHighServices.forEach(service => {
        console.log(`   - ${service}`);
      });
      console.log();
    }

    if (marketData.averagePrice) {
      console.log(`💰 Market Average Price: ${marketData.averagePrice} ATIP`);
      const ownAvg = this.services.reduce((sum, s) => sum + s.price, 0) / this.services.length;
      const diff = ownAvg - marketData.averagePrice;
      console.log(`   Your Average: ${ownAvg.toFixed(2)} ATIP (${diff > 0 ? "+" : ""}${diff.toFixed(2)} vs market)`);
      console.log();
    }

    if (marketData.competitionLevel) {
      console.log(`👥 Competition Level: ${marketData.competitionLevel}`);
      console.log(`   Recommendation: ${marketData.competitionLevel === "High" ? "Focus on quality" : "Can increase volume"}`);
      console.log();
    }
  }

  /**
   * Display activity log
   */
  displayActivityLog(limit = 10) {
    console.log(`\n📝 Activity Log (Last ${Math.min(limit, this.activityLog.length)} entries):\n`);

    const recentActivities = this.activityLog.slice(-limit);
    recentActivities.forEach(entry => {
      console.log(`[${entry.timestamp.toLocaleTimeString()}] ${entry.action}`);
      console.log(`   ${entry.details}`);
    });

    console.log();
  }
}

module.exports = AdvancedAgent;
