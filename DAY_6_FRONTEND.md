# 🌐 DAY 6 - FRONTEND & DASHBOARD

> **Status**: Ready to Build
> **Focus**: Create Web3 Dashboard
> **Tech**: Next.js + React + Web3
> **Time**: 6-8 hours
> **Deadline**: Feb 14, 2026

---

## 🎯 Day 6 Objectives

Build a **professional Web3 dashboard** that shows:
- ✅ Agent profile & reputation
- ✅ Earned ATIP tokens
- ✅ Services offered
- ✅ Service history/transactions
- ✅ MetaMask wallet connection
- ✅ Real-time earnings updates

---

## 📊 What You're Building

### Page 1: Dashboard (Main)
```
┌─────────────────────────────────────┐
│  AgentTip Dashboard                 │
├─────────────────────────────────────┤
│ 💼 Agent Profile      │ 🎖️ Reputation: 100/100
│ 💰 Total Earned: 385 ATIP
│ ✅ Services Completed: 5
│ 📝 Services Listed: 4
├─────────────────────────────────────┤
│ 📋 Recent Services                  │
│ [Service 1] - 100 ATIP - ✅         │
│ [Service 2] - 50 ATIP  - ✅         │
│ [Service 3] - 75 ATIP  - ✅         │
├─────────────────────────────────────┤
│ 🔗 Connected Wallet: 0x123...       │
│ 📊 Balance: 385 ATIP                │
└─────────────────────────────────────┘
```

### Page 2: Services
```
┌─────────────────────────────────────┐
│  Available Services                 │
├─────────────────────────────────────┤
│ 1. Smart Contract Audit             │
│    💰 100 ATIP                      │
│    ⭐⭐⭐⭐⭐ Professional security   │
│    [View Details] [Purchase]        │
│                                     │
│ 2. Code Review                      │
│    💰 50 ATIP                       │
│    ⭐⭐⭐⭐ Quick feedback           │
│    [View Details] [Purchase]        │
│                                     │
│ 3. Gas Optimization                 │
│    💰 75 ATIP                       │
│    ⭐⭐⭐⭐⭐ Save on gas costs        │
│    [View Details] [Purchase]        │
└─────────────────────────────────────┘
```

### Page 3: Transaction History
```
┌─────────────────────────────────────┐
│  Transaction History                │
├─────────────────────────────────────┤
│ Date      │ Service    │ Amount │ Status
│ Feb 11    │ Audit      │ 100    │ ✅
│ Feb 11    │ Review     │ 50     │ ✅
│ Feb 11    │ Gas Opt    │ 75     │ ✅
│ Feb 10    │ Audit      │ 100    │ ✅
│ Feb 10    │ Consult    │ 60     │ ✅
└─────────────────────────────────────┘
```

---

## 🛠️ Tech Stack (Simplified)

```
Frontend:
├─ Next.js (React framework)
├─ React (UI components)
├─ Tailwind CSS (styling)
└─ ethers.js (Web3)

Web3:
├─ MetaMask (wallet)
├─ Ethers.js (contract interaction)
└─ RainbowKit (wallet connect)

Deployment:
└─ Vercel (free hosting)
```

---

## 📁 Project Structure

```
agenttip/
├─ frontend/                    (NEW)
│  ├─ pages/
│  │  ├─ index.js             (Dashboard)
│  │  ├─ services.js          (Services list)
│  │  └─ history.js           (Transactions)
│  ├─ components/
│  │  ├─ Header.js            (Navigation)
│  │  ├─ Profile.js           (Agent profile)
│  │  ├─ Stats.js             (Earnings/stats)
│  │  └─ Services.js          (Service cards)
│  ├─ lib/
│  │  └─ web3.js              (Contract interaction)
│  ├─ styles/
│  │  └─ globals.css          (Tailwind)
│  └─ package.json
├─ contracts/                   (EXISTING)
├─ agent/                       (EXISTING)
└─ scripts/                     (EXISTING)
```

---

## 🚀 Day 6 Timeline

### Hour 1-2: Setup
- [ ] Create Next.js project
- [ ] Install dependencies
- [ ] Setup Tailwind CSS
- [ ] Configure ethers.js

### Hour 2-3: Wallet Connection
- [ ] Create MetaMask connect button
- [ ] Display wallet address
- [ ] Get contract addresses from .env
- [ ] Setup contract ABIs

### Hour 3-5: Dashboard Page
- [ ] Display agent profile
- [ ] Show reputation score
- [ ] Display ATIP balance
- [ ] List services
- [ ] Show transaction history

### Hour 5-6: Services Page
- [ ] Create service cards
- [ ] Show prices
- [ ] Add "Purchase" buttons
- [ ] Display descriptions

### Hour 6-7: Polish & Testing
- [ ] Make responsive (mobile-friendly)
- [ ] Test wallet connection
- [ ] Test balance fetching
- [ ] Error handling

### Hour 7-8: Deploy
- [ ] Deploy to Vercel
- [ ] Test on testnet
- [ ] Final polish
- [ ] Create demo video prep

---

## 📋 Checklist

### Setup
- [ ] Create Next.js app
- [ ] Install dependencies
- [ ] Setup environment variables
- [ ] Create folder structure

### Components
- [ ] Header/Navigation
- [ ] Wallet connect button
- [ ] Agent profile card
- [ ] Stats display
- [ ] Service list
- [ ] Transaction history table

### Functionality
- [ ] MetaMask connection
- [ ] Fetch ATIP balance
- [ ] Fetch agent stats
- [ ] Display services
- [ ] Show transactions
- [ ] Responsive design

### Testing
- [ ] Test on localhost
- [ ] Test with MetaMask
- [ ] Test on testnet (if deployed)
- [ ] Mobile responsive

### Deployment
- [ ] Deploy to Vercel
- [ ] Setup custom domain (optional)
- [ ] Test live version
- [ ] Get sharing link

---

## 💻 Quick Start Commands

```bash
# Create frontend
npx create-next-app@latest frontend

# Navigate
cd frontend

# Install Web3 deps
npm install ethers wagmi @wagmi/connectors

# Install UI
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start dev server
npm run dev

# Deploy (later)
# Push to GitHub, connect Vercel, deploy!
```

---

## 🎨 Design Tips

### Keep It Simple
- Clean layout
- Clear typography
- Consistent colors
- Easy navigation

### Colors to Use
- Primary: Blue (Web3/trust)
- Accent: Green (earnings/success)
- Warn: Red (errors)
- Neutral: Gray (backgrounds)

### Example Color Scheme
```
Primary: #3B82F6 (Blue)
Success: #10B981 (Green)
Danger: #EF4444 (Red)
Light: #F3F4F6 (Gray)
Dark: #1F2937 (Dark gray)
```

---

## 📡 Data Flow

```
User Opens Dashboard
  ↓
Connect to MetaMask
  ↓
Get Wallet Address
  ↓
Load Contract ABIs
  ↓
Fetch Agent Data
  ├─ Get ATIP balance
  ├─ Get reputation
  ├─ Get services completed
  └─ Get transaction history
  ↓
Display Dashboard
  ↓
Listen for Updates
  ├─ Balance changes
  ├─ New transactions
  └─ Service completions
```

---

## 🌐 MetaMask Integration

### Connect Wallet
```javascript
// User clicks "Connect Wallet" button
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts'
});
const userAddress = accounts[0];
```

### Get Balance
```javascript
// Fetch ATIP token balance
const balance = await tokenContract.balanceOf(userAddress);
```

### Listen for Changes
```javascript
// Watch for balance updates
provider.on('block', async () => {
  const newBalance = await tokenContract.balanceOf(userAddress);
  // Update UI
});
```

---

## 📦 Key Files to Create

### pages/index.js (Dashboard)
- Main page showing all stats
- Agent profile
- Recent services
- Quick stats

### pages/services.js (Services)
- All available services
- Prices and descriptions
- Service details
- Purchase buttons

### pages/history.js (History)
- Transaction list
- Filter/search
- Sort by date/amount
- View details

### components/Header.js
- Logo/branding
- Navigation links
- Wallet connect button
- Mobile menu

### components/WalletConnect.js
- MetaMask button
- Show connected address
- Disconnect option
- Network display

### lib/web3.js
- Contract ABIs
- Contract instances
- Web3 utilities
- Helper functions

---

## 🎯 Success Criteria

After Day 6, you should have:

✅ Next.js project running locally
✅ MetaMask connect button working
✅ Dashboard displaying agent stats
✅ Services list showing
✅ Transaction history working
✅ Responsive design
✅ Deployed to Vercel
✅ Working with testnet (if deployed)

---

## 🆘 Common Issues

### MetaMask not connecting
- Check browser has MetaMask
- Verify correct network (Base Sepolia)
- Clear browser cache

### Contract interaction failing
- Verify contract addresses in .env
- Check contract ABIs are correct
- Verify network is Base Sepolia

### Balance not updating
- Check Web3 provider connection
- Verify contract address is correct
- Check transaction on BaseScan

### Styling issues
- Verify Tailwind is installed
- Check globals.css imports Tailwind
- Clear Next.js cache: `rm -rf .next`

---

## 📚 Resources

### Next.js Docs
https://nextjs.org/docs

### Ethers.js
https://docs.ethers.org

### Tailwind CSS
https://tailwindcss.com

### MetaMask Integration
https://docs.metamask.io/guide/

### Example Projects
- https://github.com/rainbow-me/rainbowkit
- https://wagmi.sh/

---

## 🎊 Day 6 Success

After Day 6, you'll have:
- 🌐 Professional Web3 dashboard
- 💰 Live ATIP balance display
- 📊 Agent statistics
- 🎨 Beautiful UI design
- 📱 Mobile responsive
- 🚀 Deployed on Vercel

---

## 🚀 Ready?

### Start Day 6 with:

```bash
# Create frontend directory
mkdir frontend
cd frontend

# Create Next.js app
npx create-next-app@latest . --typescript --tailwind

# Install Web3
npm install ethers

# Start dev server
npm run dev
```

Then navigate to `http://localhost:3000` 🎉

---

**Day 6 is all about making it BEAUTIFUL and USER-FRIENDLY!** 🎨

Let's build something amazing! 🚀

