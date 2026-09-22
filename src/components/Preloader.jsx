import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { profile } from '../data/portfolioData';

const BOOT_STEPS = [
  '01 // SYSTEM INITIALIZING',
  '02 // LOADING UI SYSTEM',
  '03 // LOADING COMPONENTS',
  '04 // SYSTEM READY'
];

export default function Preloader({ onBootComplete, onComplete }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (onBootComplete) onBootComplete();
      onComplete();
      return;
    }

    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Fast, high-tech booting sequence (~200ms per step, ~600ms to ready)
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < BOOT_STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 200);

    const timer = setTimeout(() => {
      // 1. Notify that boot is complete so ID card begins entry transition
      if (onBootComplete) onBootComplete();

      // 2. Fade out boot UI content
      gsap.to(content, {
        opacity: 0,
        scale: 0.96,
        duration: 0.22,
        ease: 'power2.in'
      });

      // 3. Smoothly dissolve preloader backdrop
      gsap.to(container, {
        opacity: 0,
        duration: 0.32,
        ease: 'power2.inOut',
        onComplete: () => {
          onComplete();
        }
      });
    }, 800);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [onBootComplete, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] select-none"
      aria-label="System booting sequence"
    >
      <div
        ref={contentRef}
        className="text-center flex flex-col items-center"
        style={{ paddingLeft: "24px", paddingRight: "24px" }}
      >
        {/* Brand Monogram */}
        <div className="flex items-center justify-center gap-3">
          <span className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tighter text-[var(--foreground)]">
            {profile.initials}
          </span>
          <span className="font-mono text-sm text-[var(--accent)] tracking-widest font-semibold">
            / DEV
          </span>
        </div>

        {/* System Boot Badge */}
        <div
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]"
          style={{
            marginTop: "10px",
            marginBottom: "16px",
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingTop: "3px",
            paddingBottom: "3px"
          }}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              stepIndex === BOOT_STEPS.length - 1
                ? 'bg-[var(--accent)] animate-pulse'
                : 'bg-[var(--accent)] animate-ping'
            }`}
          />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-[var(--muted)] uppercase font-medium">
            SYSTEM BOOT
          </span>
        </div>

        {/* Identity */}
        <div>
          <h2 className="font-sans font-semibold text-lg sm:text-xl tracking-tight text-[var(--foreground)]">
            {profile.name.toUpperCase()}
          </h2>
          <p className="font-mono text-xs text-[var(--dim)] tracking-widest" style={{ marginTop: "4px" }}>
            {profile.role.toUpperCase()}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex flex-col items-center gap-2.5" style={{ paddingTop: "20px" }}>
          <div
            className={`font-mono text-xs tracking-wider h-5 transition-colors duration-200 ${
              stepIndex === BOOT_STEPS.length - 1
                ? 'text-[var(--accent)] font-semibold'
                : 'text-[var(--muted)]'
            }`}
          >
            {BOOT_STEPS[stepIndex]}
          </div>

          <div className="flex items-center gap-1.5">
            {BOOT_STEPS.map((_, i) => (
              <span
                key={i}
                className={`w-7 h-[2px] rounded-full transition-colors duration-200 ${
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
