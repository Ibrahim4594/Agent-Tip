# MetaMask Setup & Private Key Guide

## 🦊 MetaMask Setup (If Not Done Yet)
4. Ask for help in the community
### Step 1: Install MetaMask
1. Visit: https://metamask.io/download
2. Click "Install MetaMask for Chrome" (or your browser)
3. Add extension to browser
4. Click the fox icon 🦊

### Step 2: Create Wallet
1. Click "Create a new wallet"
2. Agree to terms
3. Create a strong password
4. **CRITICAL**: Write down your 12-word Secret Recovery Phrase
   - Write it on PAPER (not digitally!)
   - Store it somewhere safe
   - Never share it with anyone
   - This is the ONLY way to recover your wallet

### Step 3: Add Base Sepolia Network
1. Click network dropdown (top left)
2. Click "Add network" → "Add a network manually"
3. Enter these details:

```
Network Name: Base Sepolia
RPC URL: https://sepolia.base.org
Chain ID: 84532
Currency Symbol: ETH
Block Explorer: https://sepolia.basescan.org
```

4. Click "Save"
5. Switch to "Base Sepolia" network

### Step 4: Get Test ETH
1. Copy your wallet address (click account name)
2. Visit: https://www.coinbase.com/faucets/base-sepolia-faucet
3. Paste your address
4. Click "Get test ETH"
5. Wait 1-2 minutes
6. Check MetaMask - you should see ETH!

---

## 🔑 Getting Your Private Key

⚠️ **SECURITY WARNING**:
- Only use this for TESTNET wallets!
- Never share your private key
- Don't use this wallet for real money

### Steps to Export Private Key:

1. Open MetaMask
2. Click the three dots (⋮) next to your account name
3. Click "Account details"
4. Click "Show private key"
5. Enter your MetaMask password
6. Click and hold "Hold to reveal Private Key"
7. Copy the private key (it's a long string starting with 0x)

---

## 📝 Adding Private Key to .env File

### Method 1: Manual Edit (Recommended)
1. Open VS Code
2. Open the `.env` file in your project
3. Find the line: `PRIVATE_KEY=`
4. Paste your private key after the equals sign
5. It should look like:
   ```
   PRIVATE_KEY=0x1234567890abcdef...
   ```
6. Save the file (Ctrl+S)

### Method 2: Command Line
```bash
# Open .env in notepad
notepad .env
```
Then add your private key and save.

---

## ✅ Verify Everything Works

Run this command to test your setup:

```bash
npm run deploy:local
```

You should see:
- ✅ Contract deploying
- ✅ Contract address printed
- ✅ No errors

---

## 🎯 Day 1 Completion Checklist

### Environment Setup
- [ ] Node.js installed
- [ ] VS Code installed
- [ ] Git installed
- [ ] Project created (`agenttip`)
- [ ] Dependencies installed
- [ ] Tests passing (6/6)

### MetaMask Setup
- [ ] MetaMask extension installed
- [ ] Wallet created
- [ ] Seed phrase written down (on paper!)
- [ ] Base Sepolia network added
- [ ] Test ETH received
- [ ] Private key exported
- [ ] Private key added to .env file

### Git Setup
- [ ] Project initialized with git
- [ ] Initial commit made
- [ ] .gitignore protecting secrets

### Testing
- [ ] Can compile contracts (`npm run compile`)
- [ ] Can run tests (`npm test`)
- [ ] Can deploy locally (`npm run deploy:local`)

---

## 🚨 Common Issues & Solutions

### "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### "Error: invalid private key"
- Make sure private key starts with `0x`
- No spaces before or after
- Include the full key

### "Insufficient funds"
- Make sure you're on Base Sepolia network
- Check you have test ETH in MetaMask
- Visit faucet again if needed

### "Network not configured"
- Check hardhat.config.js has baseSepolia network
- Make sure .env file has BASE_SEPOLIA_RPC

---

## 📚 What You've Accomplished Today

1. ✅ Set up professional development environment
2. ✅ Learned basic Web3 project structure
3. ✅ Compiled your first smart contract
4. ✅ Ran automated tests
5. ✅ Created secure wallet
6. ✅ Connected to blockchain testnet
7. ✅ Ready to deploy contracts!

---

## 🎉 You're Ready for Day 2!

Tomorrow you'll learn:
- How blockchain and smart contracts work
- Solidity programming basics
- Creating your own token (ATIP)
- Deploying to testnet

**Get some rest - you crushed Day 1! 💪**

---

## 🆘 Need Help?

If something isn't working:
1. Check error message carefully
2. Google the exact error
3. Check this guide again
4. Ask Claude for help
5. Join LabLab Discord

---

**Next Session**: Day 2 - Web3 Fundamentals & Token Creation
