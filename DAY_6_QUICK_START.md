# ⚡ DAY 6 - QUICK START (Frontend)

> Build a Web3 dashboard in 30 minutes (or less!)

---

## 🚀 30-Minute Setup

### Step 1: Create Next.js App (5 min)

```bash
cd C:\Users\ibrah\OneDrive\Desktop\lablab
npx create-next-app@latest agenttip-frontend --typescript --tailwind --no-eslint
cd agenttip-frontend
```

Choose:
- TypeScript: **Yes**
- Tailwind: **Yes**
- App Router: **Yes**

### Step 2: Install Web3 (2 min)

```bash
npm install ethers wagmi @wagmi/connectors
```

### Step 3: Create Basic Dashboard (15 min)

Create `app/page.tsx`:

```typescript
'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask not found!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAddress(accounts[0]);
      setConnected(true);

      // Get balance (mock for now)
      setBalance('385');
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-blue-600">AgentTip</h1>
              <p className="text-gray-600">AI Agent Dashboard</p>
            </div>
            {connected ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Connected</p>
                <p className="font-mono text-sm">{address.slice(0, 6)}...{address.slice(-4)}</p>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        {connected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-semibold mb-2">ATIP Balance</div>
              <div className="text-3xl font-bold text-green-600">{balance}</div>
              <div className="text-gray-500 text-xs mt-2">Total Earned</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-semibold mb-2">Reputation</div>
              <div className="text-3xl font-bold text-blue-600">100/100</div>
              <div className="text-yellow-500 text-sm mt-2">⭐⭐⭐⭐⭐</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-semibold mb-2">Services</div>
              <div className="text-3xl font-bold text-purple-600">5</div>
              <div className="text-gray-500 text-xs mt-2">Completed</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-semibold mb-2">Listed</div>
              <div className="text-3xl font-bold text-orange-600">4</div>
              <div className="text-gray-500 text-xs mt-2">Services</div>
            </div>
          </div>
        ) : null}

        {/* Services Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Smart Contract Audit', price: 100, rating: 5 },
              { name: 'Code Review', price: 50, rating: 4 },
              { name: 'Gas Optimization', price: 75, rating: 5 },
              { name: 'Security Consultation', price: 60, rating: 5 },
            ].map((service) => (
              <div
                key={service.name}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-green-600">{service.price} ATIP</div>
                  <div className="text-yellow-500">{'⭐'.repeat(service.rating)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Run It! (3 min)

```bash
npm run dev
```

Visit: `http://localhost:3000` 🎉

---

## 📸 What You'll See

```
┌─────────────────────────────┐
│ AgentTip AI Agent Dashboard │
│                             │
│ ATIP Balance: 385 ATIP      │
│ Reputation: 100/100 ⭐⭐⭐⭐⭐  │
│ Services Completed: 5       │
│ Services Listed: 4          │
│                             │
│ Available Services:         │
│ - Smart Contract Audit: 100 │
│ - Code Review: 50           │
│ - Gas Optimization: 75      │
│ - Security Consultation: 60 │
└─────────────────────────────┘
```

---

## 🎨 Next: Add Real Blockchain

Once you have this working, connect real data:

```typescript
// In your component
const fetchBalance = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const token = new ethers.Contract(
    process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
    TOKEN_ABI,
    provider
  );
  const bal = await token.balanceOf(address);
  setBalance(ethers.formatUnits(bal, 18));
};
```

---

## 📋 Files You'll Create

```
agenttip-frontend/
├─ app/
│  ├─ layout.tsx       (Header/footer)
│  ├─ page.tsx         (Dashboard) ← START HERE
│  ├─ services/        (Services page)
│  └─ history/         (Transactions)
├─ components/         (Reusable parts)
├─ lib/                (Web3 helpers)
└─ public/             (Images/assets)
```

---

## 🚀 Commands

```bash
npm run dev             # Start dev server
npm run build           # Build for production
npm run start           # Run production
npm run lint            # Check code
```

---

## 🌐 Deploy to Vercel

Once done:

```bash
git push                # Push to GitHub
# Then on vercel.com:
# 1. Import project
# 2. Set env variables
# 3. Deploy!
```

---

## 💡 Pro Tips

- **Use Tailwind classes** - No CSS needed!
- **Mobile first** - Use `md:` for medium screens
- **Keep it simple** - Don't overcomplicate
- **Test often** - Check localhost after each change
- **Use dev tools** - F12 to debug

---

## ✅ Success Checklist

- [ ] Next.js app created
- [ ] MetaMask button works
- [ ] Stats display correctly
- [ ] Services list shows
- [ ] Responsive design
- [ ] Deployed to Vercel

---

**That's it! You now have a working Web3 dashboard!** 🎉

Next: Connect real blockchain data and watch it update in real-time!

