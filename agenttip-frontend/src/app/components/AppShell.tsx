'use client';
import { useState } from 'react';
import NavBar from './NavBar';
import ParticleField from './ParticleField';
import Footer from './Footer';

export default function AppShell({ children, apiOnline, network }: {
  children: React.ReactNode;
  apiOnline: boolean;
  network: string;
}) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const ethereum = (window as any).ethereum;

        // Check if MetaMask is locked
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          console.log('🔒 MetaMask is locked or no accounts found, requesting access...');
        }

        // Request account access - this opens MetaMask popup
        const requestedAccounts = await ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (requestedAccounts && requestedAccounts[0]) {
          setAddress(requestedAccounts[0]);
          setConnected(true);
          showNotification('✅ Wallet connected successfully!', 'success');
          console.log('✅ Wallet connected:', requestedAccounts[0]);

          // Listen for account changes
          ethereum.on('accountsChanged', (newAccounts: string[]) => {
            if (newAccounts.length === 0) {
              setConnected(false);
              setAddress('');
              showNotification('⚠️ Wallet disconnected', 'info');
            } else {
              setAddress(newAccounts[0]);
              showNotification('✅ Account switched', 'success');
            }
          });
        }
      } catch (error: any) {
        // Handle different error types silently
        if (error.code === 4001) {
          // User rejected the connection
          showNotification('❌ Connection rejected. Please approve MetaMask to continue.', 'error');
        } else if (error.code === -32002) {
          // Request already pending
          showNotification('⚠️ Connection request pending. Please check MetaMask extension.', 'info');
        } else if (error.code === -32603) {
          // Internal error
          showNotification('❌ MetaMask internal error. Please unlock MetaMask and try again.', 'error');
        } else if (error.message && error.message.includes('Already processing')) {
          showNotification('⚠️ Request already processing. Please check MetaMask.', 'info');
        } else {
          // Generic error - check if MetaMask is locked
          const errorMsg = error.message || 'Unknown error';
          if (errorMsg.toLowerCase().includes('locked') || errorMsg.toLowerCase().includes('unlock')) {
            showNotification('🔒 Please unlock MetaMask and try again.', 'info');
          } else {
            showNotification('❌ Connection failed. Make sure MetaMask is unlocked and try again.', 'error');
          }
        }
      }
    } else {
      // MetaMask not installed - show installation prompt
      showNotification('⚠️ MetaMask not found! Please install MetaMask extension from metamask.io', 'info');
      console.log('⚠️ MetaMask not installed');

      // Open MetaMask website after 2 seconds
      setTimeout(() => {
        window.open('https://metamask.io/download/', '_blank');
      }, 2000);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ zIndex: 1 }}>
      <ParticleField />
      {/* Enhanced Premium Background Blobs */}
      <div className="fixed pointer-events-none animate-pulse" style={{ top: '-25%', left: '-15%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,240,255,0.08), transparent 70%)', filter: 'blur(100px)', animation: 'float 20s ease-in-out infinite' }} />
      <div className="fixed pointer-events-none animate-pulse" style={{ bottom: '-25%', right: '-15%', width: 650, height: 650, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,0,170,0.08), transparent 70%)', filter: 'blur(100px)', animation: 'float 25s ease-in-out infinite reverse', animationDelay: '5s' }} />
      <div className="fixed pointer-events-none" style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,136,0.05), transparent 70%)', filter: 'blur(120px)', animation: 'pulse-glow 10s ease-in-out infinite' }} />

      {/* Notification Toast */}
      {notification && (
        <div
          className="fixed top-6 right-6 z-50 animate-fade-in-up panel rounded-2xl px-6 py-4 max-w-md shadow-2xl"
          style={{
            border: `1.5px solid ${
              notification.type === 'success' ? 'rgba(0,255,136,0.4)' :
              notification.type === 'error' ? 'rgba(255,0,170,0.4)' :
              'rgba(0,240,255,0.4)'
            }`,
            background: `linear-gradient(135deg, ${
              notification.type === 'success' ? 'rgba(0,255,136,0.15)' :
              notification.type === 'error' ? 'rgba(255,0,170,0.15)' :
              'rgba(0,240,255,0.15)'
            }, rgba(10,14,30,0.95))`,
            boxShadow: `0 0 40px ${
              notification.type === 'success' ? 'rgba(0,255,136,0.2)' :
              notification.type === 'error' ? 'rgba(255,0,170,0.2)' :
              'rgba(0,240,255,0.2)'
            }, 0 10px 30px rgba(0,0,0,0.3)`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${
                  notification.type === 'success' ? 'rgba(0,255,136,0.2)' :
                  notification.type === 'error' ? 'rgba(255,0,170,0.2)' :
                  'rgba(0,240,255,0.2)'
                }, transparent)`,
                border: `1px solid ${
                  notification.type === 'success' ? 'rgba(0,255,136,0.3)' :
                  notification.type === 'error' ? 'rgba(255,0,170,0.3)' :
                  'rgba(0,240,255,0.3)'
                }`,
              }}
            >
              <span className="text-xl">
                {notification.type === 'success' ? '✓' :
                 notification.type === 'error' ? '✕' :
                 'ℹ'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-relaxed" style={{
                color: notification.type === 'success' ? '#00ff88' :
                       notification.type === 'error' ? '#ff00aa' :
                       '#00f0ff'
              }}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: 'rgba(224,228,240,0.6)' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 py-8" style={{ zIndex: 2 }}>
        <NavBar
          connected={connected}
          address={address}
          onConnect={connectWallet}
          apiOnline={apiOnline}
          network={network}
        />
        {children}
        <Footer />
      </div>
    </div>
  );
}
