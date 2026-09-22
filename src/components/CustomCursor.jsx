import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer fine devices, hover capable, screen >= 1024px, and when reduced motion is off
    const checkEnabled = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const canHover = window.matchMedia('(hover: hover)').matches;
      const isDesktop = window.innerWidth >= 1024;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      return !isCoarse && canHover && isDesktop && !reducedMotion;
    };

    if (!checkEnabled()) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    const handleResize = () => {
      setIsEnabled(checkEnabled());
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });

    const xRing = gsap.quickTo(ring, 'x', { duration: 0.32, ease: 'power3.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.32, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const handleMouseDown = () => {
      gsap.to(ring, { scale: 0.75, duration: 0.15 });
    };

    const handleMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[99999] hidden lg:block"
        style={{ backgroundColor: 'var(--accent)' }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[99998] hidden lg:block border border-[var(--accent)]/40"
        aria-hidden="true"
      />
    </>
  );
}

