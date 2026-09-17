import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageTransition({ isActive, onTransitionComplete }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tiles = container.querySelectorAll('.transition-tile');
    if (tiles.length === 0) return;

    if (isActive) {
      // Snappy, GPU-accelerated wipe in and wipe out (total ~500-600ms)
      const tl = gsap.timeline({
        onComplete: () => {
          if (onTransitionComplete) onTransitionComplete();
        },
      });

      tl.set(container, { display: 'flex', pointerEvents: 'all' })
        .fromTo(
          tiles,
          { scaleY: 0, transformOrigin: 'top' },
          {
            scaleY: 1,
            duration: 0.24,
            stagger: 0.025,
            ease: 'power3.inOut',
          }
        )
        .to(tiles, {
          scaleY: 0,
          transformOrigin: 'bottom',
          duration: 0.24,
          stagger: 0.025,
          ease: 'power3.inOut',
          delay: 0.04,
        })
        .set(container, { display: 'none', pointerEvents: 'none' });

      return () => {
        tl.kill();
      };
    }
  }, [isActive, onTransitionComplete]);

  // Optimal 5 tiles for desktop, 3 for mobile to minimize DOM overhead
  const tileCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 5;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none hidden flex-row"
      aria-hidden="true"
    >
      {Array.from({ length: tileCount }).map((_, i) => (
        <div
          key={i}
          className="transition-tile flex-1 h-full bg-[var(--background)] border-r border-[var(--border)]"
          style={{ willChange: 'transform' }}
        />
      ))}
    </div>
  );
}
