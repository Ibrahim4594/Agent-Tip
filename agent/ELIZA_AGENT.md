# 🤖 ElizaBot - AgentTip Eliza Framework Agent

> AI-powered smart contract auditor and Web3 consultant using the Eliza framework

---

## 🎯 What is ElizaBot?

**ElizaBot** is an intelligent AI agent that:
- ✅ Uses Eliza framework for AI capabilities
- ✅ Integrates with AgentTip smart contracts
- ✅ Maintains conversation history
- ✅ Provides professional services
- ✅ Tracks reputation and earnings
- ✅ Runs on Base Sepolia testnet (when deployed)

---

## 🚀 Quick Start

### Demo Mode (No Blockchain)

```bash
npm run agent:eliza
```

This starts an interactive conversation with the agent. No testnet ETH needed!

### Example Conversation

```
You: Hi, what services do you offer?

ElizaBot: I'm a professional smart contract auditor and Web3 consultant.
I offer four main services:

1. Smart Contract Audit - 100 ATIP - Comprehensive security review
2. Code Review - 50 ATIP - Quick feedback on code quality
3. Gas Optimization - 75 ATIP - Reduce contract costs
4. Security Consultation - 60 ATIP - Web3 security best practices

What can I help you with today?
```

---

## 📋 Available Commands

When chatting with ElizaBot:

| Command | Description |
|---------|-------------|
| `/status` | Show agent statistics |
| `/profile` | Show detailed profile |
| `/balance` | Check ATIP balance |
| `/help` | Show all commands |
| `/exit` | Exit the agent |
| (just type) | Chat with the agent naturally |

---

## 💬 What ElizaBot Can Do

### Services
- **Smart Contract Audit** (100 ATIP)
  - Comprehensive security review
  - Gas optimization analysis
  - Best practices recommendations

- **Code Review** (50 ATIP)
  - Quick feedback on code quality
  - Improvement suggestions
  - Performance optimization tips

- **Gas Optimization** (75 ATIP)
  - Reduce contract costs
  - Optimize function calls
  - Storage efficiency

- **Security Consultation** (60 ATIP)
  - Web3 security best practices
  - Vulnerability discussion
  - Risk assessment

### Features
- ✅ Natural language conversation
- ✅ Service recommendations based on needs
- ✅ Reputation tracking (0-100)
- ✅ Earnings calculation
- ✅ Service history
- ✅ Blockchain integration (when deployed)

---

## 🔧 How It Works

### Architecture

```
User Input
    ↓
Conversation History
    ↓
Claude API (via Anthropic SDK)
    ↓
Agent Processing
    ↓
Blockchain Interaction (optional)
    ↓
Response to User
```

### Technology Stack

- **Framework**: Eliza (@ai16z/eliza)
- **AI**: Claude (via @anthropic-ai/sdk)
- **Blockchain**: Ethers.js
- **Network**: Base Sepolia testnet
- **Contracts**: AgentTipToken + AgentMarketplace

---

## 📊 Agent State

ElizaBot tracks:

```javascript
{
  name: "ElizaBot",
  reputation: 100,                    // 0-100 score
  earnings: 0,                        // Total ATIP earned
  completedServices: 0,               // Services finished
  listedServices: [],                 // Services offered
  conversationHistory: []             // Chat history
}
```

---

## 🌐 Blockchain Integration

### Demo Mode (Current)
- ✅ Full AI conversation
- ✅ Service tracking
- ✅ Reputation system
- ✅ No blockchain needed

### Production Mode (After Deployment)
```bash
# Add to .env:
TOKEN_CONTRACT_ADDRESS=0x...
MARKETPLACE_CONTRACT_ADDRESS=0x...
PRIVATE_KEY=0x...

# Run:
npm run agent:eliza
```

Then ElizaBot will:
- ✅ Connect to real contracts
- ✅ List services on blockchain
- ✅ Track real ATIP earnings
- ✅ Interact with smart contracts
- ✅ Complete real transactions

---

## 💻 Code Examples

### Basic Usage

```javascript
const ElizaAgentTipAgent = require("./eliza-agent");

// Create agent
const agent = new ElizaAgentTipAgent({
  name: "ElizaBot",
  description: "Smart contract auditor"
});

// Chat with agent
const response = await agent.processMessage(
  "Can you audit my smart contract?"
);

console.log(response);
```

### With Blockchain

```javascript
// Initialize with wallet
await agent.initializeWithWallet(
  "https://sepolia.base.org",
  TOKEN_ADDRESS,
  MARKETPLACE_ADDRESS,
  PRIVATE_KEY
);

// Agent now connects to real blockchain
await agent.processMessage("List my services on the marketplace");
```

### Check Status

```javascript
const status = agent.getStatus();
console.log(`Reputation: ${status.reputation}/100`);
console.log(`Earnings: ${status.earnings} ATIP`);
console.log(`Services Completed: ${status.completedServices}`);
```

---

## 🎓 Features Explained

### Conversation Memory

ElizaBot remembers your entire conversation:

```
User: I need a code review
ElizaBot: I can provide a code review for 50 ATIP...

User: What did we just talk about?
ElizaBot: We discussed code review services...
```

The agent maintains context throughout the conversation!

### Reputation System

- Starts at 100/100
- Increases with successful interactions
- Decreases with issues
- Affects service trustworthiness

### Earnings Tracking

Services automatically add to earnings:
- Smart Contract Audit: +100 ATIP
- Code Review: +50 ATIP
- Gas Optimization: +75 ATIP
- Security Consultation: +60 ATIP

---

## 🚀 Development Flow

### Phase 1: Demo (Right Now)
```bash
npm run agent:eliza
# Chat with agent, no ETH needed
```

### Phase 2: Deploy Contracts
```bash
# Get testnet ETH from faucet
# npm run deploy:day5
```

### Phase 3: Connect Blockchain
```bash
# Add contract addresses to .env
npm run agent:eliza
# Agent connects to real blockchain
```

### Phase 4: Autonomous Operation
```bash
# Agent runs independently
# Listens for service requests
# Completes services
# Earns real ATIP tokens
```

---

## 🆘 Troubleshooting

### "Cannot find module @anthropic-ai/sdk"
```bash
npm install @anthropic-ai/sdk
```

### "Agent not responding"
- Check internet connection
- Verify Claude API key (if using custom key)
- Check agent initialization

### "Cannot connect to blockchain"
- Ensure contract addresses in `.env`
- Check private key is correct
- Verify RPC connection

### "Service not tracking earnings"
- Restart agent (`npm run agent:eliza`)
- Check transaction on BaseScan
- Verify contract is deployed

---

## 📚 Files

| File | Purpose |
|------|---------|
| `eliza-agent.js` | Main agent class |
| `run-eliza-agent.js` | Interactive runner |
| `ELIZA_AGENT.md` | This documentation |

---

## 🔗 Useful Commands

```bash
# Start interactive agent
npm run agent:eliza

# Run tests
npm test

# Deploy contracts
npm run deploy:day5

# Check agent status
npm run agent:eliza
# Then type: /status
```

---

## 🎯 Next Steps

1. **Test with agent**
   ```bash
   npm run agent:eliza
   ```

2. **Get testnet ETH** (when ready)
   - https://www.coinbase.com/faucets/base-sepolia-faucet

3. **Deploy contracts**
   ```bash
   npm run deploy:day5
   ```

4. **Connect blockchain**
   - Add addresses to `.env`
   - Run agent again

5. **Build frontend** (Day 6)
   - Display agent earnings
   - Show service history

---

## 💡 Design Philosophy

**"Keep it Simple, Make it Smart"**

- ✅ Natural language interface
- ✅ Smart AI responses
- ✅ Minimal configuration
- ✅ Production-ready code
- ✅ Hackathon-friendly

---

## 📞 Support

For issues or questions:
- Check `/help` in the agent
- Review error messages
- Check blockchain on BaseScan
- Review hardhat logs

---

**Ready to chat with your AI agent?** 🤖

```bash
npm run agent:eliza
```

---

**ElizaBot is ready to help!** 💪

