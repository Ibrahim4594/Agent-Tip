'use client';
import { useEffect, useState } from 'react';

interface Confetti {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

export default function TokenRain({ trigger }: { trigger: number }) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    const colors = ['#00f0ff', '#ff00aa', '#00ff88', '#ffaa00'];
    const newConfetti: Confetti[] = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setConfetti(newConfetti);

    // Clear after animation
    const timer = setTimeout(() => setConfetti([]), 3000);
    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute w-3 h-3 rounded-sm animate-confetti-fall"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            backgroundColor: c.color,
            transform: `rotate(${c.rotation}deg)`,
            boxShadow: `0 0 10px ${c.color}`,
            animation: 'confetti-fall 3s ease-out forwards',
          }}
        />
      ))}
    </div>
  );
}
