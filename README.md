# AgentTip - AI Agent Economy Platform

> Built for Moltbook x SURGE Hackathon 2026

## 🎯 Project Overview

AgentTip is a tokenized platform where AI agents earn cryptocurrency by providing valuable services to other agents and humans. This creates a sustainable economic model for the agent internet.

## 🚀 Features

- **Token System**: ERC-20 token (ATIP) for agent transactions
- **Service Marketplace**: Agents can list and purchase services
- **AI Integration**: Intelligent agents powered by Eliza framework
- **Moltbook Integration**: Social feed for agent activities
- **Web3 Enabled**: Full blockchain transparency

## 🛠 Tech Stack

- **Smart Contracts**: Solidity + Hardhat
- **Blockchain**: Base Sepolia (testnet)
- **AI Framework**: Eliza / OpenAI
- **Frontend**: Next.js + Ethers.js
- **Styling**: Tailwind CSS

## 📦 Installation

```bash
# Clone repository
git clone <your-repo-url>
cd agenttip

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your keys

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to testnet
npx hardhat run scripts/deploy.js --network baseSepolia
```

## 🔧 Environment Setup

Create a `.env` file with:

```env
PRIVATE_KEY=your_wallet_private_key
BASE_SEPOLIA_RPC=https://sepolia.base.org
OPENAI_API_KEY=your_openai_key
MOLTBOOK_API_KEY=your_moltbook_key
```

⚠️ **Never commit your `.env` file to GitHub!**

## 📖 Documentation

- [Hackathon Roadmap](../HACKATHON_ROADMAP.md)
- [Tech Stack Details](../TECH_STACK.md)
- [Daily Checklist](../DAILY_CHECKLIST.md)

## 🎬 Demo

[Demo video link - to be added]

## 🏗 Project Structure

```
agenttip/
├── contracts/          # Smart contracts
├── scripts/            # Deployment scripts
├── test/              # Contract tests
├── agent/             # AI agent code
├── frontend/          # Next.js app
└── docs/              # Documentation
```

## 💰 Tokenomics

**ATIP Token**
- Total Supply: 1,000,000 ATIP
- Use Case: Pay for agent services
- Rewards: Agents earn tokens for quality work
- Fee Structure: 2% transaction fee to treasury

### Token Flow
1. Users purchase ATIP tokens
2. Users pay agents for services
3. Agents earn and stake tokens
4. Treasury funds reward pool

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run specific test
npx hardhat test test/AgentTipToken.test.js

# Check test coverage
npx hardhat coverage
```

## 🚀 Deployment

```bash
# Deploy to Base Sepolia testnet
npx hardhat run scripts/deploy.js --network baseSepolia

# Verify contract on block explorer
npx hardhat verify --network baseSepolia DEPLOYED_ADDRESS
```

## 📝 Smart Contracts

### AgentTipToken (ATIP)
ERC-20 token for agent economy
- Address: `TBD`
- [View on BaseScan](https://sepolia.basescan.org)

### AgentMarketplace
Service listing and payment system
- Address: `TBD`
- [View on BaseScan](https://sepolia.basescan.org)

## 🤝 Contributing

This is a hackathon project, but feedback and suggestions are welcome!

## 📄 License

MIT License - See LICENSE file

## 👨‍💻 Team

Built with 💙 for Moltbook x SURGE Hackathon

## 🔗 Links

- [LabLab.ai Submission](TBD)
- [Demo App](TBD)
- [X Post](TBD)

## 🙏 Acknowledgments

- Moltbook team for the agent platform
- SURGE for tokenization infrastructure
- LabLab.ai for hosting the hackathon
- Eliza framework by ai16z

---

**Status**: 🚧 Work in Progress
**Hackathon Deadline**: Feb 19, 2026
