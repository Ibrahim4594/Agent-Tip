# 🚀 DAY 5 - DEPLOYMENT & INTEGRATION

> **Status**: Ready to Deploy
> **Date**: February 11, 2026
> **Contracts**: AgentTipToken + AgentMarketplace
> **Network**: Base Sepolia Testnet

---

## 📋 What Is Day 5?

Day 5 is where we take everything from Days 1-4 and deploy it to a **real blockchain**. Your smart contracts and AI agent will start operating on Base Sepolia testnet!

---

## 🎯 Day 5 Objectives

- ✅ Deploy AgentTipToken contract
- ✅ Deploy AgentMarketplace contract
- ✅ Connect AI agent to real blockchain
- ✅ Verify contracts on BaseScan
- ✅ Test agent earning real ATIP tokens

---

## ⚙️ Prerequisites (BEFORE Deployment)

### 1. Get MetaMask Private Key

You need your wallet's **private key** to deploy contracts.

**How to get it:**
1. Open MetaMask
2. Click the 3-dot menu → Account details
3. Click "Export private key"
4. Enter your password
5. Copy the private key (starts with `0x`)

**⚠️ SECURITY WARNING:**
- Never share your private key with anyone
- Never post it on GitHub or Discord
- It's like your wallet password!

### 2. Get Testnet ETH

You need **testnet ETH** to pay for gas fees when deploying.

**Best faucets (no phone/email verification):**

1. **Coinbase Faucet** (Easiest)
   - https://www.coinbase.com/faucets/base-sepolia-faucet
   - Click "Send me ETH"
   - Shows up in seconds

2. **Alchemy Faucet** (No sign-up)
   - https://www.alchemy.com/faucets/base-sepolia
   - Paste wallet address
   - Claim ETH

3. **QuickNode** (Quick)
   - https://faucet.quicknode.com/base/sepolia
   - Paste wallet address
   - Get 0.5 testnet ETH

**How much do you need?**
- ~0.05 ETH minimum for deploying both contracts
- Get 0.1 ETH to be safe

### 3. Update .env File

Once you have your private key, add it to the `.env` file:

```bash
PRIVATE_KEY=0xyour_private_key_here
```

Example (NOT real):
```bash
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

---

## 🚀 Deployment Steps

### Step 1: Verify Setup

Check that everything is ready:

```bash
npm test
```

**You should see:**
```
65 passing
```

If any tests fail, fix them before deploying!

### Step 2: Deploy to Base Sepolia

Run the deployment script:

```bash
npx hardhat run scripts/deploy-day5.js --network baseSepolia
```

**What you'll see:**

```
╔════════════════════════════════════════════════╗
║        🚀 DAY 5 - AGENTIP DEPLOYMENT          ║
╚════════════════════════════════════════════════╝

📝 Deploying with account: 0x123...
💰 Account balance: 0.5 ETH

Step 1: Deploying AgentTipToken...
✅ AgentTipToken deployed: 0xabc...

Step 2: Deploying AgentMarketplace...
✅ AgentMarketplace deployed: 0xdef...

Step 3: Saving addresses to .env...
✅ Addresses saved to .env

╔════════════════════════════════════════════════╗
║           ✅ DEPLOYMENT COMPLETE!              ║
╚════════════════════════════════════════════════╝
```

**Important:** The script **automatically saves** contract addresses to `.env`! ✅

### Step 3: Verify Contracts

Verify your contracts on BaseScan for transparency:

```bash
# Token contract
npx hardhat verify --network baseSepolia TOKEN_ADDRESS

# Marketplace contract
npx hardhat verify --network baseSepolia MARKETPLACE_ADDRESS TOKEN_ADDRESS
```

Replace `TOKEN_ADDRESS` and `MARKETPLACE_ADDRESS` with actual addresses from deployment.

**You can find these:**
- In your `.env` file
- In `deployment-info-day5.json`
- In the deployment console output

---

## 🧪 Step 4: Test Agent with Deployed Contracts

Now test that the agent can talk to the deployed contracts:

```bash
node scripts/test-deployed.js
```

**Expected output:**

```
╔════════════════════════════════════════════════╗
║      🧪 DAY 5 - DEPLOYED CONTRACT TEST        ║
╚════════════════════════════════════════════════╝

Step 1: Connecting to deployed contracts...
✅ Agent connected to deployed contracts

Step 2: Checking wallet balance...
💰 ATIP Balance: 1000000

✅ AGENT READY FOR WORK!
```

### Step 5: Run the Agent

Start the agent listening for service purchases:

```bash
node agent/run-agent.js
```

The agent will:
- ✅ Connect to your deployed contracts
- ✅ List services on marketplace
- ✅ Listen for service purchases
- ✅ Complete services and earn ATIP tokens

---

## 📊 What Gets Deployed?

### 1. AgentTipToken (ERC-20)

**What it does:**
- Tracks agent earnings
- Handles token transfers
- Mints new tokens as agents earn

**Features:**
- Initial supply: 1,000,000 ATIP
- Max supply: 1,000,000,000 ATIP
- Transferable between agents
- Burnable (tokens can be removed)

### 2. AgentMarketplace

**What it does:**
- Lists services from agents
- Manages service purchases
- Tracks completion and earnings
- Takes 2% platform fee

**Features:**
- Service listing (name, description, price)
- Service purchase and payment
- Service completion
- Event logging for transparency

---

## 🔍 View on Block Explorer

After deployment, you can view your contracts on BaseScan:

**Format:**
```
https://sepolia.basescan.org/address/0xYOUR_CONTRACT_ADDRESS
```

**Examples:**
- Token: `https://sepolia.basescan.org/address/0xabc123...`
- Marketplace: `https://sepolia.basescan.org/address/0xdef456...`

You can see:
- ✅ All transactions
- ✅ All function calls
- ✅ Token balances
- ✅ Contract code

---

## 🤖 Agent Integration

### What the Agent Can Now Do

With deployed contracts, the agent can:

```javascript
// List services on the real marketplace
await agent.listServicesOnChain()

// Check real token balance
const balance = await agent.getBalanceFromChain()

// Complete services and earn real ATIP
await agent.completeServiceOnChain(serviceId)

// Listen for real purchase events
agent.setupEventListeners()
```

### Example Agent Workflow

```javascript
// 1. Initialize agent with real contracts
const agent = new AgentWithContracts(config);
await agent.initializeWithWallet(
  "https://sepolia.base.org",
  TOKEN_ADDRESS,
  MARKETPLACE_ADDRESS,
  PRIVATE_KEY
);

// 2. List services on marketplace
await agent.listServicesOnChain();
console.log("✅ Services listed on marketplace");

// 3. Listen for purchases
agent.setupEventListeners();
console.log("🎧 Listening for service purchases...");

// 4. When someone buys, agent automatically:
//    - Receives the service request
//    - Completes the work
//    - Earns ATIP tokens
//    - Logs the activity
```

---

## 🐛 Troubleshooting

### "Insufficient funds for gas"

**Problem:** Account doesn't have enough testnet ETH

**Solution:**
1. Get more testnet ETH from a faucet
2. Wait for transaction to complete (can take 1-2 minutes)

### "Contract address not found"

**Problem:** `.env` doesn't have contract addresses

**Solution:**
1. Run deployment again: `npx hardhat run scripts/deploy-day5.js --network baseSepolia`
2. Check `.env` file has addresses filled in
3. Check `deployment-info-day5.json` was created

### "Cannot connect to RPC"

**Problem:** Network connection issues

**Solution:**
1. Check internet connection
2. Try alternative RPC: Edit `.env` to use different RPC URL
3. Wait a moment and try again

### "Private key invalid"

**Problem:** PRIVATE_KEY in `.env` is wrong format

**Solution:**
1. Get fresh private key from MetaMask
2. Make sure it starts with `0x`
3. Double-check no spaces at beginning/end
4. Paste exactly as shown in MetaMask

---

## 📈 What Happens Next?

### Day 6: Frontend & Dashboard
- Build Next.js UI
- Connect MetaMask wallet
- Display earned ATIP tokens
- Show agent profile

### Day 7: Moltbook Integration
- Post agent activity to Moltbook feed
- Share earnings announcements
- Build reputation score

### Day 8: Demo & Polish
- Create demonstration video
- Test all features end-to-end
- Polish UI and error messages

### Day 9: Submission
- Package project
- Create X post with @lablabai and @Surgexyz_
- Submit to LabLab.ai
- Celebrate! 🎉

---

## ✅ Day 5 Checklist

- [ ] Get testnet ETH from faucet
- [ ] Add PRIVATE_KEY to .env
- [ ] Run `npm test` (65 passing)
- [ ] Run `npx hardhat run scripts/deploy-day5.js --network baseSepolia`
- [ ] Verify contract addresses in `.env`
- [ ] Run `node scripts/test-deployed.js`
- [ ] View contracts on BaseScan
- [ ] Run `node agent/run-agent.js` successfully
- [ ] Commit changes to git

---

## 🎉 Success Metrics

After Day 5, you should have:

✅ AgentTipToken deployed on Base Sepolia
✅ AgentMarketplace deployed on Base Sepolia
✅ AI agent connecting to real blockchain
✅ Agent showing real ATIP balance
✅ All contracts visible on BaseScan
✅ Deployment info saved

---

## 🔗 Useful Links

- **Base Sepolia Faucet**: https://www.coinbase.com/faucets/base-sepolia-faucet
- **BaseScan Block Explorer**: https://sepolia.basescan.org
- **Ethers.js Docs**: https://docs.ethers.org
- **Hardhat Docs**: https://hardhat.org

---

## 💡 Pro Tips

1. **Save the deployment addresses** - You'll need them for frontend (Day 6)
2. **Keep the private key safe** - Never commit to GitHub
3. **Test locally first** - Use `npx hardhat test` before deploying
4. **Check gas prices** - On busy days, gas can be more expensive
5. **Monitor on BaseScan** - Watch transactions confirm in real-time

---

**You're about to deploy to a real blockchain! This is HUGE!** 🚀

Once you have testnet ETH, you can deploy in seconds and see your Web3 agent working on a real network!

---

**Ready? Let's go to Day 6!** 📱

