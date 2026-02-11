# ⚡ DAY 5 - QUICK START GUIDE

> **TL;DR**: Get testnet ETH → Add private key → Deploy → Test

---

## 🚀 3-Minute Setup

### 1. Get Testnet ETH (2 minutes)

**Best option - Coinbase Faucet:**
1. Go: https://www.coinbase.com/faucets/base-sepolia-faucet
2. Paste your wallet address from MetaMask
3. Click "Send me ETH"
4. Wait 30 seconds ✅

**Alternative faucets (if Coinbase busy):**
- Alchemy: https://www.alchemy.com/faucets/base-sepolia
- QuickNode: https://faucet.quicknode.com/base/sepolia

Need at least **0.05 ETH** for deployment.

### 2. Add Private Key to .env (1 minute)

Get your private key from MetaMask:
1. Click 3-dot menu
2. Account details
3. Export private key
4. Copy the key (starts with `0x`)

Edit `.env` file:
```
PRIVATE_KEY=0xyour_key_here
```

**⚠️ Never share this key!**

---

## 🎯 Deploy & Test

### Run Tests First
```bash
npm test
```
Expected: `65 passing` ✅

### Deploy to Base Sepolia
```bash
npm run deploy:day5
```

**You'll see:**
- ✅ Token deployed: `0xabc...`
- ✅ Marketplace deployed: `0xdef...`
- ✅ Addresses saved to `.env`

### Test Agent Connection
```bash
npm run test:deployed
```

Expected:
```
✅ Agent connected to deployed contracts
💰 ATIP Balance: 1000000
✅ AGENT READY FOR WORK!
```

### Run Agent
```bash
npm run agent
```

Agent will:
- Connect to real contracts
- List services on marketplace
- Listen for purchases
- Earn real ATIP tokens

---

## 📊 Verify on Block Explorer

After deployment, check your contracts on BaseScan:

**Find addresses:**
- Check `.env` file → `TOKEN_CONTRACT_ADDRESS` and `MARKETPLACE_CONTRACT_ADDRESS`
- OR check `deployment-info-day5.json`

**View on BaseScan:**
```
https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
```

---

## ✅ Success Checklist

- [ ] Got testnet ETH
- [ ] Added PRIVATE_KEY to .env
- [ ] Ran `npm test` (65 passing)
- [ ] Ran `npm run deploy:day5` (✅ both contracts deployed)
- [ ] Ran `npm run test:deployed` (✅ agent connected)
- [ ] Viewed contracts on BaseScan
- [ ] Ran `npm run agent` (✅ agent listening)

---

## 🆘 Troubleshooting

### "Insufficient funds for gas"
→ Need more testnet ETH from faucet

### "Contract address not found"
→ Run `npm run deploy:day5` again

### "Cannot connect to contracts"
→ Check contract addresses in `.env` are correct

### "PRIVATE_KEY is wrong"
→ Get fresh key from MetaMask, make sure starts with `0x`

---

## 📚 Full Guide

For detailed explanation of everything, read:
- `DAY_5_DEPLOYMENT.md` - Complete guide with all details

---

## 🎉 What's Next?

Once this is working:

**Day 6:** Build frontend to display agent earnings
**Day 7:** Post to Moltbook social feed
**Day 8:** Create demo video
**Day 9:** Submit to hackathon

---

**You're deploying to a real blockchain!** 🚀
