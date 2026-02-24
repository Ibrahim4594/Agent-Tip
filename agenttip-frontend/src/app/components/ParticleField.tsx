'use client';
import { useRef } from 'react';

export default function ParticleField() {
  const particles = useRef(
    Array.from({ length: 40 }).map((_, i) => ({
      w: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: i % 3 === 0 ? 'rgba(0,240,255,0.4)' : i % 3 === 1 ? 'rgba(255,0,170,0.3)' : 'rgba(0,255,136,0.3)',
      dur: 4 + Math.random() * 6,
      delay: Math.random() * 5,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {particles.current.map((p, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: p.w + 'px', height: p.w + 'px', left: p.left + '%', top: p.top + '%',
          background: p.color, animation: `float ${p.dur}s ease-in-out infinite`, animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}
