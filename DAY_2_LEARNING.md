# Day 2 - Web3 Fundamentals & Token Creation

## 🎯 Today's Goals

By the end of Day 2, you will:
1. ✅ Understand how blockchain works
2. ✅ Learn Solidity basics
3. ✅ Create your first ERC-20 token (ATIP)
4. ✅ Deploy it to testnet
5. ✅ See it on the block explorer

**Time Required**: 6-8 hours

---

## 📚 Part 1: Web3 Fundamentals (2 hours)

### What is Blockchain? (30 min)

**Simple Explanation**:
- A blockchain is like a shared Google Doc that:
  - Everyone can read
  - Nobody can delete
  - Has rules about who can write
  - Keeps history of all changes forever

**Key Concepts**:
1. **Decentralized**: No single company controls it
2. **Immutable**: Once written, can't be changed
3. **Transparent**: Everyone can see all transactions
4. **Secure**: Uses cryptography to protect data

**Watch** (choose one):
- "Blockchain Explained in 7 Minutes" - Simply Explained (YouTube)
- "What is Blockchain?" - Binance Academy

### What are Smart Contracts? (30 min)

**Simple Explanation**:
- Code that runs on the blockchain
- Like a vending machine: put money in, get product out
- No middleman needed
- Rules are automatic and can't be changed

**Example Use Cases**:
- Token transfers (like ATIP)
- Voting systems
- Automatic payments
- NFTs

**Watch**:
- "Smart Contracts Explained" - Whiteboard Crypto (YouTube)

### What are Tokens? (30 min)

**Types of Tokens**:
1. **ERC-20**: Fungible tokens (like dollars, all equal)
   - ATIP token (what we're building!)
   - USDC, DAI, etc.
2. **ERC-721**: NFTs (unique items)
3. **ERC-1155**: Multi-token standard

**Our Token (ATIP)**:
- Name: AgentTip
- Symbol: ATIP
- Purpose: Pay AI agents for services
- Supply: 1,000,000 tokens

### How Wallets Work (30 min)

**Key Concepts**:
1. **Public Address**: Like your email (safe to share)
2. **Private Key**: Like your password (NEVER share!)
3. **Seed Phrase**: Backup of private key (12-24 words)

**Gas Fees**:
- Payment to process transactions
- Like postage for sending mail
- Paid in ETH (even on Base network)
- Testnet: Free test ETH
- Mainnet: Real money

---

## 📚 Part 2: Solidity Basics (2-3 hours)

### Interactive Learning (2 hours)

**Option 1: CryptoZombies** (Recommended)
1. Visit: https://cryptozombies.io
2. Complete Lesson 1: "Making the Zombie Factory"
3. Complete Lesson 2: "Zombies Attack Their Victims"

**Why this is great**:
- Gamified and fun
- Hands-on coding
- Instant feedback
- Builds a real project

**Option 2: Solidity by Example**
Visit: https://solidity-by-example.org
Read these sections:
1. Hello World
2. First App
3. Primitive Data Types
4. Variables
5. Functions

### Key Solidity Concepts (1 hour)

#### 1. Contract Structure
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyContract {
    // State variables (stored on blockchain)
    uint256 public myNumber;

    // Constructor (runs once when deployed)
    constructor() {
        myNumber = 42;
    }

    // Function
    function setNumber(uint256 _newNumber) public {
        myNumber = _newNumber;
    }
}
```

#### 2. Data Types
```solidity
// Numbers
uint256 public age = 25;        // Unsigned integer (positive only)
int256 public temperature = -5;  // Signed integer (can be negative)

// Boolean
bool public isActive = true;

// Address (wallet/contract address)
address public owner = 0x1234...;

// String
string public name = "AgentTip";

// Mapping (like a dictionary)
mapping(address => uint256) public balances;
```

#### 3. Functions
```solidity
// Public - anyone can call
function publicFunction() public { }

// Private - only this contract can call
function privateFunction() private { }

// View - reads data, doesn't change anything
function getBalance() public view returns (uint256) {
    return balance;
}

// Pure - doesn't read or write data
function add(uint a, uint b) public pure returns (uint) {
    return a + b;
}
```

#### 4. Events
```solidity
// Define event
event Transfer(address indexed from, address indexed to, uint256 amount);

// Emit event
function transfer(address to, uint256 amount) public {
    emit Transfer(msg.sender, to, amount);
}
```

#### 5. Modifiers
```solidity
address public owner;

modifier onlyOwner() {
    require(msg.sender == owner, "Not the owner");
    _;
}

function sensitiveFunction() public onlyOwner {
    // Only owner can call this
}
```

---

## 📚 Part 3: Create ATIP Token (2-3 hours)

### Understanding ERC-20 Standard

**What is ERC-20?**
- Standard interface for tokens
- All ERC-20 tokens work the same way
- Wallets and exchanges know how to handle them

**Required Functions**:
- `totalSupply()` - Total tokens in existence
- `balanceOf(address)` - Check balance
- `transfer(address, amount)` - Send tokens
- `approve(address, amount)` - Allow spending
- `transferFrom(address, address, amount)` - Spend approved tokens

### Using OpenZeppelin Templates

**Why OpenZeppelin?**
- ✅ Battle-tested (used by millions)
- ✅ Security audited
- ✅ Easy to use
- ✅ Industry standard

### Create AgentTipToken.sol

We'll create this file together with these features:
1. ERC-20 standard token
2. Mintable (can create more tokens)
3. Burnable (can destroy tokens)
4. Access control (only owner can mint)

---

## 📚 Part 4: Testing & Deployment (1-2 hours)

### Write Tests

You'll learn to:
- Test token deployment
- Test token transfers
- Test access control
- Use Hardhat's testing tools

### Deploy to Testnet

Step by step:
1. Make sure you have test ETH
2. Run deployment script
3. See transaction on BaseScan
4. Add token to MetaMask
5. Celebrate! 🎉

---

## 📖 Recommended Learning Resources

### Videos (Total: ~2 hours)
1. **"Blockchain Explained"** - Simply Explained (7 min)
   - https://youtube.com/watch?v=SSo_EIwHSd4

2. **"Smart Contracts Explained"** - Whiteboard Crypto (10 min)
   - https://youtube.com/watch?v=ZE2HxTmxfrI

3. **"Solidity Tutorial for Beginners"** - FreeCodeCamp (2 hours)
   - https://youtube.com/watch?v=gyMwXuJrbJQ

### Interactive Tutorials
1. **CryptoZombies** - Learn Solidity by building a game
   - https://cryptozombies.io
   - Start with Lessons 1-2

2. **Solidity by Example** - Quick reference
   - https://solidity-by-example.org

3. **Ethereum.org Docs** - Official documentation
   - https://ethereum.org/en/developers/docs/

### Reading Materials
1. **"What is Ethereum?"** - Beginner's guide
   - https://ethereum.org/en/what-is-ethereum/

2. **"Introduction to Smart Contracts"**
   - https://ethereum.org/en/developers/docs/smart-contracts/

3. **"ERC-20 Token Standard"**
   - https://ethereum.org/en/developers/docs/standards/tokens/erc-20/

---

## 🎯 Day 2 Learning Path

### Morning Session (3-4 hours)
**9:00 - 10:00**: Watch videos on blockchain & smart contracts
**10:00 - 12:00**: Complete CryptoZombies Lesson 1-2
**12:00 - 12:30**: Review Solidity concepts

### Afternoon Session (3-4 hours)
**13:00 - 14:00**: Study ERC-20 standard
**14:00 - 16:00**: Create AgentTipToken contract with me
**16:00 - 17:00**: Write tests and deploy to testnet

---

## 💡 Key Takeaways (Read at End of Day)

After Day 2, you should understand:

### Blockchain Basics
- ✅ What blockchain is and why it matters
- ✅ How transactions work
- ✅ What makes blockchain secure
- ✅ Difference between testnet and mainnet

### Smart Contracts
- ✅ What smart contracts are
- ✅ How they run on blockchain
- ✅ Why they're trustless
- ✅ Gas fees and why they exist

### Solidity
- ✅ Basic syntax and structure
- ✅ Data types (uint, address, string)
- ✅ Functions (public, private, view, pure)
- ✅ Events and why they matter
- ✅ Modifiers for access control

### ERC-20 Tokens
- ✅ What ERC-20 standard is
- ✅ Required functions
- ✅ How to create tokens
- ✅ How to transfer tokens

### Development
- ✅ How to write Solidity contracts
- ✅ How to test contracts
- ✅ How to deploy to testnet
- ✅ How to verify on block explorer

---

## 🎓 Quiz Yourself

Test your understanding:

1. What makes blockchain different from a regular database?
2. What is a smart contract?
3. What's the difference between public and private functions?
4. What does ERC-20 mean?
5. Why do we need gas fees?
6. What's the difference between view and pure functions?
7. What is msg.sender?
8. Why use OpenZeppelin contracts?

**Answers are in the learning resources above!**

---

## 🚀 Bonus Challenges (Optional)

If you finish early or want extra practice:

1. **Modify Lock.sol**
   - Add a function to check time remaining
   - Add an event when withdrawal happens
   - Add a second beneficiary

2. **Research**
   - Look up other ERC-20 tokens on BaseScan
   - Read about ERC-721 (NFTs)
   - Explore DeFi protocols

3. **Experiment**
   - Deploy your test contract multiple times
   - Try different Solidity features
   - Break things and learn from errors

---

## 📝 Day 2 Checklist

### Learning
- [ ] Watched blockchain explainer video
- [ ] Watched smart contracts video
- [ ] Completed CryptoZombies Lesson 1
- [ ] Read Solidity basics
- [ ] Understand ERC-20 standard

### Coding
- [ ] Created AgentTipToken.sol
- [ ] Contract compiles successfully
- [ ] Wrote tests for token
- [ ] All tests passing
- [ ] Deployed to testnet
- [ ] Verified on BaseScan
- [ ] Added token to MetaMask

### Understanding
- [ ] Can explain what blockchain is
- [ ] Can explain what smart contracts do
- [ ] Understand basic Solidity syntax
- [ ] Know what ERC-20 tokens are
- [ ] Understand gas fees

---

## 🎉 End of Day 2 Achievement

If you complete Day 2, you will have:
- ✅ Created your own cryptocurrency
- ✅ Deployed it to a real blockchain
- ✅ Anyone can see it on the internet
- ✅ You can send it to others
- ✅ It's a real achievement!

**This is genuinely impressive for a beginner! 💪**

---

## 🤝 Learning Together

Remember:
- 🐌 It's okay to go slow
- ❓ Ask questions (no stupid questions!)
- 🔄 Review concepts multiple times
- ✍️ Take notes in your own words
- 💪 Practice makes progress
- 🎯 Focus on understanding, not memorizing

**I'll be with you every step of the way!**

---

**Ready to start Day 2? Let me know when you want to begin! 🚀**
