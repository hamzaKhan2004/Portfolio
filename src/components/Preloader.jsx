import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { profile } from '../data/portfolioData';

const BOOT_STEPS = [
  '01 // SYSTEM INITIALIZATION',
  '02 // MOUNTING RUNTIME & TOKENS',
  '03 // ARCHITECTURES READY'
];

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Fast, high-tech booting sequence (~950ms total)
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < BOOT_STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 280);

    const timer = setTimeout(() => {
      gsap.to(container, {
        yPercent: -100,
        duration: 0.55,
        ease: 'power4.inOut',
        onComplete: () => {
          onComplete();
        }
      });
    }, 980);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] select-none"
      aria-label="System booting sequence"
    >
      <div className="text-center space-y-5 px-6">
        {/* Brand Monogram */}
        <div className="flex items-center justify-center gap-3">
          <span className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tighter text-[var(--foreground)]">
            {profile.initials}
          </span>
          <span className="font-mono text-sm text-[var(--dim)] tracking-widest">
            / DEV
          </span>
        </div>

        {/* Identity */}
        <div>
          <h2 className="font-sans font-semibold text-lg sm:text-xl tracking-tight text-[var(--foreground)]">
            {profile.name.toUpperCase()}
          </h2>
          <p className="font-mono text-xs text-[var(--accent)] tracking-widest mt-1">
            {profile.role.toUpperCase()}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="pt-4 flex flex-col items-center gap-2">
          <div className="font-mono text-[11px] text-[var(--muted)] tracking-wider h-5">
            {BOOT_STEPS[stepIndex]}
          </div>

          <div className="flex items-center gap-1.5">
            {BOOT_STEPS.map((_, i) => (
              <span
                key={i}
                className={`w-6 h-[2px] transition-colors duration-200 ${
                  i <= stepIndex ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
