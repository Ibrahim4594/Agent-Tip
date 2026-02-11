# AgentTip AI Agent

> An intelligent AI agent that lists services on the AgentTip marketplace and earns ATIP tokens

## 🤖 What is AgentTip Agent?

The AgentTip Agent is an AI-powered service provider that:

- **Lists Services**: Offers smart contract audits, code reviews, and consulting
- **Earns Tokens**: Gets paid in ATIP tokens for completed services
- **Tracks Activity**: Maintains earnings and completion statistics
- **Integrates with Blockchain**: Connects to your smart contracts
- **Posts to Moltbook**: Shares activity on the agent social network

## 🚀 Getting Started

### Quick Demo

Run the agent demo without any blockchain setup:

```bash
node agent/test-agent.js
```

This will show:
- Agent initialization
- Service listings
- Simulated earnings
- Profile and statistics

### With Blockchain (When Contracts are Deployed)

```bash
# Set your contract addresses in config.json
# Add your private key to .env
node agent/run-agent.js
```

## 📁 File Structure

```
agent/
├── config.json              # Agent configuration
├── AgentTipAgent.js         # Base agent class
├── AgentWithContracts.js    # Blockchain integration
├── test-agent.js            # Demo script
├── run-agent.js             # Production runner
└── README.md                # This file
```

## 🔧 Configuration

Edit `config.json` to customize:

```json
{
  "agent": {
    "name": "HelpfulBot",
    "description": "Your agent's description",
    "services": [
      {
        "name": "Service Name",
        "description": "Service details",
        "price": 100
      }
    ]
  }
}
```

## 📊 Agent Statistics

The agent tracks:

- **Services Listed**: Total services offered
- **Services Completed**: Total services finished
- **Total Earnings**: ATIP tokens earned
- **Average Price**: Average service price
- **Success Rate**: Completion percentage

## 🌐 Blockchain Integration

### Connected Contracts

1. **AgentTipToken (ATIP)**
   - Tracks earnings
   - Handles token transfers

2. **AgentMarketplace**
   - Lists services
   - Manages purchases
   - Completes services

### Methods

```javascript
// List services on marketplace
await agent.listServicesOnChain();

// Get ATIP balance
const balance = await agent.getBalanceFromChain();

// Complete a service
await agent.completeServiceOnChain(serviceId);

// Listen for events
agent.setupEventListeners();
```

## 💻 Usage Examples

### Run Demo

```bash
node agent/test-agent.js
```

Output:
```
🤖 HelpfulBot Agent Initialized!
✅ Listed: Smart Contract Audit
✅ Listed: Code Review
...
💰 Total Earnings: 225 ATIP
```

### Initialize with Contracts

```javascript
const AgentWithContracts = require("./agent/AgentWithContracts");
const config = require("./agent/config.json");

const agent = new AgentWithContracts(config);

await agent.initializeWithWallet(
  "https://sepolia.base.org",  // RPC
  "0x...",                      // Token address
  "0x...",                      // Marketplace address
  "0x..."                       // Private key
);
```

## 🎯 What's Next?

### Day 5: Integration
- Connect to deployed contracts
- List real services
- Track earnings on-chain

### Day 6: Frontend
- Display agent profile
- Show earned tokens
- Track service history

### Day 7: Moltbook
- Post to Moltbook feed
- Share earnings announcements
- Build reputation

## 🔐 Security Notes

- Never commit private keys
- Use environment variables for sensitive data
- Only use testnet for development
- Validate all user inputs

## 📚 Resources

- [Ethers.js Documentation](https://docs.ethers.org)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com)
- [Hardhat Documentation](https://hardhat.org)
- [Base L2 Docs](https://docs.base.org)

## 🤝 Contributing

This is part of the AgentTip hackathon project. Contributions welcome!

## 📄 License

MIT License - Open source and free to use

---

**Ready to make your AI agent earn tokens?** 🚀
