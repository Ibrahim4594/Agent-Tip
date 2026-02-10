# GitHub Setup Guide

## 🎯 Why Use GitHub?

- ✅ Backup your code safely
- ✅ Required for hackathon submission
- ✅ Show your work publicly
- ✅ Track changes over time
- ✅ Collaborate with others

---

## 📦 Step 1: Create GitHub Account

1. Visit: https://github.com
2. Click "Sign up"
3. Choose username (professional, lowercase)
   - Good: `yourname-dev`, `yourname`
   - Avoid: `coolkid123`, `xxx_destroyer`
4. Enter email and create password
5. Verify your email

---

## 📦 Step 2: Create Repository

### Option A: Via GitHub Website (Easier)

1. Log into GitHub
2. Click "+" (top right) → "New repository"
3. Fill in details:
   - **Name**: `agenttip`
   - **Description**: `AI Agent Economy Platform - Moltbook x SURGE Hackathon 2026`
   - **Public** ✓ (required for hackathon)
   - **DON'T** check "Add README" (we already have one)
4. Click "Create repository"

### Option B: Via Command Line

```bash
# We'll do this together in a moment
```

---

## 📦 Step 3: Connect Local Project to GitHub

After creating the repository on GitHub, you'll see instructions. Here's what to do:

### Copy Your Repository URL

It will look like:
```
https://github.com/YOUR-USERNAME/agenttip.git
```

### Run These Commands

Open PowerShell in your project folder and run:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR-USERNAME/agenttip.git

# Rename branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Replace `YOUR-USERNAME` with your actual GitHub username!**

---

## 📦 Step 4: Verify It Worked

1. Refresh your GitHub repository page
2. You should see all your files
3. Check that `.env` is **NOT** there (protected by .gitignore)

---

## 🔐 Security Checklist

Before pushing to GitHub, verify:

- [ ] `.env` file is in `.gitignore`
- [ ] `.env` file doesn't appear in git status
- [ ] No private keys in any files
- [ ] No API keys committed

### Check What Will Be Pushed

```bash
# See what will be pushed
git status

# If you see .env listed, something is wrong!
# It should be ignored
```

---

## 📝 Making Updates (Daily Workflow)

Every time you make changes:

```bash
# 1. Check what changed
git status

# 2. Add files (be specific, don't use git add .)
git add contracts/
git add test/
git add README.md

# 3. Commit with descriptive message
git commit -m "feat: add AgentTipToken contract"

# 4. Push to GitHub
git push
```

### Good Commit Messages

✅ **Good**:
- `feat: add AgentTipToken ERC-20 contract`
- `fix: resolve deployment script error`
- `docs: update README with setup instructions`
- `test: add unit tests for marketplace`

❌ **Bad**:
- `update`
- `fixed stuff`
- `asdf`
- `work in progress`

---

## 🎯 Commit Message Prefixes

Use these prefixes for clarity:

| Prefix | Meaning | Example |
|--------|---------|---------|
| `feat:` | New feature | `feat: add token minting` |
| `fix:` | Bug fix | `fix: resolve gas estimation` |
| `docs:` | Documentation | `docs: add API documentation` |
| `test:` | Tests | `test: add marketplace tests` |
| `chore:` | Maintenance | `chore: update dependencies` |
| `refactor:` | Code cleanup | `refactor: improve contract structure` |

---

## 📦 Repository Structure

Your GitHub repo should look like:

```
agenttip/
├── contracts/          # Smart contracts
├── test/              # Test files
├── scripts/           # Deployment scripts
├── .gitignore         # Protected files list
├── hardhat.config.js  # Configuration
├── package.json       # Dependencies
├── README.md          # Main documentation
├── SETUP_GUIDE.md     # Setup instructions
├── DAY_2_LEARNING.md  # Learning resources
└── GITHUB_SETUP.md    # This file
```

**Files NOT in GitHub** (protected by .gitignore):
- `.env` (your secrets)
- `node_modules/` (dependencies - too large)
- `cache/` (build cache)
- `artifacts/` (compiled contracts - regenerated)

---

## 🚨 What If I Accidentally Committed .env?

**Don't panic!** Here's how to fix it:

### If you haven't pushed yet:
```bash
# Remove from git (keeps local file)
git rm --cached .env

# Commit the removal
git commit -m "fix: remove .env from git"

# Now push
git push
```

### If you already pushed:
1. **IMMEDIATELY** change all secrets in `.env`:
   - Generate new MetaMask private key
   - Create new API keys
2. Then remove the file:
```bash
git rm --cached .env
git commit -m "fix: remove exposed .env"
git push
```
3. Consider the old keys compromised forever

---

## 📊 GitHub Features to Use

### 1. README.md
- First thing people see
- Explain your project
- Show how to use it

### 2. Releases
- Tag important versions
- Useful for hackathon submission

### 3. Issues
- Track bugs
- Plan features
- Note ideas

### 4. Projects (Optional)
- Kanban board for tasks
- Track progress

---

## 🎯 Hackathon Submission Requirements

For the hackathon, your GitHub must have:

- [ ] Public repository
- [ ] Clear README with:
  - [ ] Project description
  - [ ] Installation instructions
  - [ ] Tech stack
  - [ ] Demo link
  - [ ] Tokenomics explanation
- [ ] All source code
- [ ] License (MIT recommended)
- [ ] Deployed contracts section

---

## 📝 README Template for Hackathon

Your README.md should include:

```markdown
# AgentTip

> AI Agent Economy Platform built for Moltbook x SURGE Hackathon 2026

## 🎯 Problem
[Describe the problem your project solves]

## 💡 Solution
[Explain your solution]

## 🎬 Demo
[Link to demo video and live app]

## 🛠 Tech Stack
- Solidity + Hardhat
- Eliza AI Framework
- Next.js + Ethers.js
- Base Sepolia

## 💰 Tokenomics
[Explain ATIP token and economics]

## 🚀 Installation
[Step by step instructions]

## 📝 Smart Contracts
- Token: 0x... [BaseScan link]
- Marketplace: 0x... [BaseScan link]

## 👨‍💻 Team
Built by [Your Name]

## 📄 License
MIT
```

---

## 🎯 Quick Commands Reference

```bash
# Check status
git status

# Add specific files
git add filename.js

# Commit changes
git commit -m "feat: description"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

---

## 🆘 Common Issues

### "Permission denied"
```bash
# Use HTTPS URL instead of SSH
git remote set-url origin https://github.com/USERNAME/agenttip.git
```

### "Repository not found"
- Check URL is correct
- Check repository is public
- Check you're logged into correct account

### "Failed to push"
```bash
# Pull first, then push
git pull origin main --rebase
git push
```

### "Merge conflict"
- Open conflicted file
- Choose which changes to keep
- Remove conflict markers (<<<<, ====, >>>>)
- Save file
- `git add filename`
- `git commit -m "fix: resolve merge conflict"`

---

## 🎉 Benefits of Good GitHub Practices

1. **Judges can see your progress** - Shows you actually built it
2. **Proof of work** - Clear history of development
3. **Professional portfolio** - Impressive for future jobs
4. **Easy collaboration** - Others can contribute
5. **Backup** - Never lose your work

---

## 📚 Learning Resources

- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [GitHub Skills](https://skills.github.com) - Interactive tutorials

---

## ✅ Final Checklist

Before moving to Day 2:

- [ ] GitHub account created
- [ ] Repository created and public
- [ ] Local project connected to GitHub
- [ ] First push successful
- [ ] `.env` NOT in repository
- [ ] README looks good
- [ ] Repository URL saved

---

**Your GitHub Profile**: `https://github.com/YOUR-USERNAME`
**Your Repository**: `https://github.com/YOUR-USERNAME/agenttip`

Save these links - you'll need them for the hackathon submission!

---

## 🤝 Ready to Continue?

Once your GitHub is set up, we can move forward with confidence knowing your work is backed up and shareable!

**Next**: Start Day 2 learning resources together! 🚀
