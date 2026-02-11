/**
 * Moltbook API Client
 *
 * Connects AgentTip agent to Moltbook social network
 * API Docs: https://www.moltbook.com/developers
 * GitHub: https://github.com/moltbook/api
 */

const BASE_URL = "https://www.moltbook.com/api/v1";

class MoltbookClient {
  constructor(apiKey = null) {
    this.apiKey = apiKey || process.env.MOLTBOOK_API_KEY;
    this.agentName = null;
    this.registered = false;
  }

  /**
   * Make authenticated API request
   */
  async request(method, path, body = null) {
    const url = `${BASE_URL}${path}`;
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const options = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        console.error(`Moltbook API error (${response.status}):`, data);
        return { success: false, error: data, status: response.status };
      }

      return { success: true, data, status: response.status };
    } catch (error) {
      console.error(`Moltbook request failed:`, error.message);
      return { success: false, error: error.message, status: 0 };
    }
  }

  /**
   * Register a new agent on Moltbook
   * Returns API key and claim URL
   */
  async registerAgent(name, description) {
    console.log(`\n📱 Registering agent "${name}" on Moltbook...\n`);

    const result = await this.request("POST", "/agents/register", {
      name,
      description,
    });

    if (result.success) {
      this.apiKey = result.data.apiKey || result.data.api_key;
      this.agentName = name;
      this.registered = true;

      console.log(`✅ Agent registered on Moltbook!`);
      console.log(`   Name: ${name}`);
      if (result.data.claimUrl) {
        console.log(`   Claim URL: ${result.data.claimUrl}`);
      }
      console.log(`   API Key: ${this.apiKey ? this.apiKey.slice(0, 12) + "..." : "N/A"}\n`);
    } else {
      console.log(`⚠️  Registration response:`, result.error);
    }

    return result;
  }

  /**
   * Get current agent profile
   */
  async getProfile() {
    return await this.request("GET", "/agents/me");
  }

  /**
   * Update agent profile
   */
  async updateProfile(description) {
    return await this.request("PATCH", "/agents/me", { description });
  }

  /**
   * Create a text post on Moltbook
   */
  async createPost(title, content, submolt = "general") {
    console.log(`📝 Posting to Moltbook: "${title}"`);

    const result = await this.request("POST", "/posts", {
      submolt,
      title,
      content,
    });

    if (result.success) {
      console.log(`✅ Posted to m/${submolt}`);
    } else {
      console.log(`⚠️  Post response:`, result.error);
    }

    return result;
  }

  /**
   * Create a link post on Moltbook
   */
  async createLinkPost(title, url, submolt = "general") {
    return await this.request("POST", "/posts", {
      submolt,
      title,
      url,
    });
  }

  /**
   * Get feed posts
   */
  async getFeed(sort = "hot", limit = 25) {
    return await this.request("GET", `/posts?sort=${sort}&limit=${limit}`);
  }

  /**
   * Get posts from a specific submolt
   */
  async getSubmoltPosts(submolt, sort = "hot", limit = 25) {
    return await this.request(
      "GET",
      `/submolts/${submolt}?sort=${sort}&limit=${limit}`
    );
  }

  /**
   * Upvote a post
   */
  async upvotePost(postId) {
    return await this.request("POST", `/posts/${postId}/upvote`);
  }

  /**
   * Add comment to a post
   */
  async addComment(postId, content) {
    return await this.request("POST", `/posts/${postId}/comments`, {
      content,
    });
  }

  /**
   * Search Moltbook
   */
  async search(query, limit = 25) {
    return await this.request(
      "GET",
      `/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  /**
   * Follow another agent
   */
  async followAgent(name) {
    return await this.request("POST", `/agents/${name}/follow`);
  }

  // ========= AGENTTIP-SPECIFIC HELPER METHODS =========

  /**
   * Post a service completion announcement
   */
  async postServiceCompletion(serviceName, earnings, totalEarnings) {
    const title = `Completed: ${serviceName} (+${earnings} ATIP)`;
    const content = `🤖 Just completed a "${serviceName}" service and earned ${earnings} ATIP tokens!\n\nTotal earnings: ${totalEarnings} ATIP\n\n#AgentTip #Web3 #AIAgent`;
    return await this.createPost(title, content);
  }

  /**
   * Post a milestone achievement
   */
  async postMilestone(milestone, details) {
    const title = `🏆 Milestone: ${milestone}`;
    const content = `${details}\n\n#AgentTip #Milestone`;
    return await this.createPost(title, content);
  }

  /**
   * Post agent status update
   */
  async postStatusUpdate(reputation, totalEarnings, servicesCompleted) {
    const title = `Agent Status Update`;
    const content = `📊 Current stats:\n- Reputation: ${reputation}/100\n- Total Earned: ${totalEarnings} ATIP\n- Services Completed: ${servicesCompleted}\n\nReady for more work! 💪\n\n#AgentTip #AgentEconomy`;
    return await this.createPost(title, content);
  }

  /**
   * Post that agent is live on marketplace
   */
  async postGoLive(services) {
    const serviceList = services
      .map((s) => `- ${s.name}: ${s.price} ATIP`)
      .join("\n");
    const title = `🚀 AgentTip Agent is LIVE!`;
    const content = `I'm now offering services on the AgentTip marketplace!\n\nServices available:\n${serviceList}\n\nPowered by Base L2 + ATIP tokens.\n\n#AgentTip #Web3 #AIAgent #BaseSepolia`;
    return await this.createPost(title, content);
  }
}

module.exports = MoltbookClient;
