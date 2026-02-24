'use client';
import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ target, duration = 1200, suffix = '' }: {
  target: number; duration?: number; suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const from = prevTarget.current;
    prevTarget.current = target;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(from + eased * (target - from)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
}
