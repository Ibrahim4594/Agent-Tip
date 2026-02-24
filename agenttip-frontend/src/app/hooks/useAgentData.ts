'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { AgentData, ServiceData, TxData, FeedPost } from '../lib/types';
import { API_URL, DEMO_AGENT, DEMO_SERVICES, DEMO_TRANSACTIONS, DEMO_FEED } from '../lib/constants';

export function useAgentData() {
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [transactions, setTransactions] = useState<TxData[]>([]);
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [lastEvent, setLastEvent] = useState<number>(0);

  const sseActive = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      const [agentRes, servicesRes, txRes, feedRes] = await Promise.all([
        fetch(`${API_URL}/api/agent`),
        fetch(`${API_URL}/api/services`),
        fetch(`${API_URL}/api/transactions`),
        fetch(`${API_URL}/api/moltbook/feed`),
      ]);
      if (agentRes.ok) { setAgent(await agentRes.json()); setApiOnline(true); }
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (txRes.ok) setTransactions(await txRes.json());
      if (feedRes.ok) setFeed(await feedRes.json());
    } catch {
      setApiOnline(false);
      setAgent(DEMO_AGENT);
      setServices(DEMO_SERVICES);
      setTransactions(DEMO_TRANSACTIONS);
      setFeed(DEMO_FEED);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => { fetchData(); }, [fetchData]);

  // SSE connection + polling fallback
  useEffect(() => {
    let es: EventSource | null = null;
    let pollInterval: ReturnType<typeof setInterval>;

    try {
      es = new EventSource(`${API_URL}/api/events`);

      es.onopen = () => {
        sseActive.current = true;
        // Slow poll as safety net when SSE is active
        clearInterval(pollInterval);
        pollInterval = setInterval(fetchData, 30000);
      };

      es.addEventListener('purchase', (e) => {
        const data = JSON.parse(e.data);
        setLastEvent(Date.now());

        // Update agent stats in-place
        setAgent(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            earnings: data.earnings,
            reputation: data.reputation,
            servicesCompleted: data.servicesCompleted,
          };
        });

        // Prepend new transaction
        setTransactions(prev => {
          const exists = prev.some(tx => tx.id === data.transaction.id);
          if (exists) return prev;
          return [data.transaction, ...prev];
        });

        // Update service completions
        setServices(prev =>
          prev.map(s =>
            s.name === data.serviceName
              ? { ...s, completions: s.completions + 1 }
              : s
          )
        );
      });

      es.onerror = () => {
        sseActive.current = false;
        // Fall back to fast polling
        clearInterval(pollInterval);
        pollInterval = setInterval(fetchData, 5000);
      };
    } catch {
      // EventSource not supported or failed — use polling
      sseActive.current = false;
      pollInterval = setInterval(fetchData, 5000);
    }

    return () => {
      es?.close();
      clearInterval(pollInterval);
      sseActive.current = false;
    };
  }, [fetchData]);

  const purchaseService = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/services/${id}/purchase`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setNotification(`${data.message} (+${data.earned} ATIP)`);
        setTimeout(() => setNotification(''), 3000);
        // If SSE is active, the update arrives via SSE — no need to refetch
        if (!sseActive.current) {
          fetchData();
        }
      }
    } catch {
      const service = services.find(s => s.id === id);
      if (service && agent) {
        const newEarnings = agent.earnings + service.price;
        setAgent({ ...agent, earnings: newEarnings, servicesCompleted: agent.servicesCompleted + 1 });
        setNotification(`${service.name} completed! (+${service.price} ATIP)`);
        setTimeout(() => setNotification(''), 3000);
      }
    }
  };

  return { agent, services, transactions, feed, apiOnline, loading, notification, lastEvent, purchaseService };
}
