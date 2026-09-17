import React, { useRef, useEffect } from 'react';
import { profile } from '../data/portfolioData';
import { MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function IdCard() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const lanyardRef = useRef(null);
  const glareRef = useRef(null);
  const boundsRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const lanyard = lanyardRef.current;
    const glare = glareRef.current;
    if (!container || !card || !lanyard) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const isMobile = window.innerWidth < 1024;

    // 1. Caching card bounding box to avoid layout thrashing on mousemove
    const updateBounds = () => {
      boundsRef.current = card.getBoundingClientRect();
    };
    updateBounds();
    window.addEventListener('resize', updateBounds, { passive: true });

    // 2. Harmonic Pendulum Physics with Ambient Hanging Motion
    let angle = 0;
    let angleVelocity = 0;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    let lastMouseX = 0;
    let lastTime = performance.now();
    let animFrameId = null;

    const SPRING_K = 0.048;
    const DAMPING = 0.93;
    const FORCE_FACTOR = 0.035;

    const handleMouseMove = (e) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dx = e.clientX - lastMouseX;
      lastMouseX = e.clientX;
      lastTime = now;

      const bounds = boundsRef.current || card.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      // Impart physical momentum based on cursor velocity
      const mouseSpeedX = dx / dt;
      angleVelocity += Math.max(-2.2, Math.min(2.2, mouseSpeedX * FORCE_FACTOR * 8));

      // Specular sheen & subtle 3D tilt
      const relX = (e.clientX - centerX) / (window.innerWidth * 0.45);
      const relY = (e.clientY - centerY) / (window.innerHeight * 0.45);

      targetTiltX = Math.max(-8, Math.min(8, -relY * 10));
      targetTiltY = Math.max(-8, Math.min(8, relX * 10));

      if (glare) {
        const cardX = ((e.clientX - bounds.left) / bounds.width) * 100;
        const cardY = ((e.clientY - bounds.top) / bounds.height) * 100;
        glare.style.background = `radial-gradient(circle at ${cardX}% ${cardY}%, rgba(255,255,255,0.2) 0%, rgba(184, 255, 60, 0.08) 35%, transparent 70%)`;
      }
    };

    const handleMouseLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
      if (glare) {
        glare.style.background = 'transparent';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseenter', updateBounds, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Continuous Physics Loop with Natural Ambient Sway
    const physicsLoop = () => {
      const now = performance.now();

      // Ambient subtle sway simulating real-world air suspended hanging motion
      const ambientSway = Math.sin(now * 0.0016) * 1.5 + Math.sin(now * 0.0032) * 0.4;

      // Harmonic spring force
      const springForce = -SPRING_K * angle;
      angleVelocity += springForce;
      angleVelocity *= DAMPING;
      angle += angleVelocity;

      // Combined angle
      const totalAngle = angle + ambientSway;

      // Smooth tilt easing
      tiltX += (targetTiltX - tiltX) * 0.08;
      tiltY += (targetTiltY - tiltY) * 0.08;

      // 3D transforms applied directly to DOM
      card.style.transform = `perspective(1200px) rotateZ(${totalAngle.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      lanyard.style.transform = `rotateZ(${(totalAngle * 0.35).toFixed(2)}deg)`;

      animFrameId = requestAnimationFrame(physicsLoop);
    };

    animFrameId = requestAnimationFrame(physicsLoop);

    // 3. Signature Interaction: ID Card Scroll-Linked Travel from HOME to ABOUT Docking Zone
    let scrollTriggerInstance = null;

    if (!isMobile) {
      const calculateDeltas = () => {
        const aboutDock = document.getElementById('about-card-target');
        if (!aboutDock || !container) return { deltaX: 0, deltaY: 0 };

        const currentX = gsap.getProperty(container, 'x') || 0;
        const currentY = gsap.getProperty(container, 'y') || 0;

        const sRect = container.getBoundingClientRect();
        const tRect = aboutDock.getBoundingClientRect();

        return {
          deltaX: tRect.left - (sRect.left - currentX),
          deltaY: tRect.top - (sRect.top - currentY)
        };
      };

      const setupScrollTravel = () => {
        const aboutDock = document.getElementById('about-card-target');
        if (!aboutDock || !container) return;

        scrollTriggerInstance = ScrollTrigger.create({
          trigger: '#home',
          start: 'top top',
          endTrigger: '#about',
          end: 'center center',
          scrub: 1.2,
          invalidateOnRefresh: true,
          animation: gsap.to(container, {
            x: () => calculateDeltas().deltaX,
            y: () => calculateDeltas().deltaY,
            rotation: -3,
            scale: 0.98,
            ease: 'power1.inOut'
          }),
          onUpdate: (self) => {
            // Scroll momentum transfers to card physics
            const velocity = self.getVelocity();
            if (Math.abs(velocity) > 20) {
              angleVelocity += Math.max(-1.8, Math.min(1.8, velocity * 0.00035));
            }
          }
        });
      };

      const timer = setTimeout(setupScrollTravel, 250);
      ScrollTrigger.addEventListener('refreshInit', updateBounds);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', updateBounds);
        container.removeEventListener('mouseenter', updateBounds);
        container.removeEventListener('mouseleave', handleMouseLeave);
        if (animFrameId) cancelAnimationFrame(animFrameId);
        if (scrollTriggerInstance) scrollTriggerInstance.kill();
        ScrollTrigger.removeEventListener('refreshInit', updateBounds);
      };
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateBounds);
      container.removeEventListener('mouseenter', updateBounds);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero-id-card-wrapper"
      className="relative flex flex-col items-center justify-start select-none py-2 z-30"
      style={{ perspective: '1200px' }}
      aria-label="Hamza Akil Khan interactive physical identity card"
    >
      {/* Lanyard Ribbon hanging from top */}
      <div
        ref={lanyardRef}
        className="w-4 h-20 sm:h-24 bg-gradient-to-b from-[var(--surface-hover)] to-[var(--surface)] border-x border-[var(--border)] relative origin-top transition-transform duration-75"
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)', transformOrigin: 'top center' }}
      >
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[var(--border-strong)]" />
      </div>

      {/* Metallic Clip Hook */}
      <div className="relative z-10 -mt-1 flex flex-col items-center">
        <div className="w-5 h-5 rounded-full border-2 border-[var(--muted)]/60 bg-[var(--surface)] shadow-sm" />
        <div className="w-8 h-4 bg-gradient-to-b from-[#8a909a] to-[#4a505a] rounded-sm -mt-2 border border-white/20 shadow-md" />
      </div>

      {/* Physical Identity Card */}
      <div
        ref={cardRef}
        className="relative -mt-2 w-[290px] sm:w-[325px] rounded-2xl bg-[var(--surface)] border border-[var(--border-strong)] shadow-2xl p-6 sm:p-7 origin-top overflow-hidden transition-shadow duration-300"
        style={{
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 0 1px 1px var(--border)',
          transformStyle: 'preserve-3d',
          transformOrigin: 'top center'
        }}
      >
        {/* Specular Glare Layer */}
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
          aria-hidden="true"
        />

        {/* Top Punch Hole */}
        <div className="w-9 h-2.5 rounded-full mx-auto mb-5 bg-[var(--background)] border border-[var(--border)] shadow-inner" />

        {/* Card Header: Monogram & Verified Badge */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-sm tracking-tight text-[var(--foreground)]">
              {profile.initials}
            </span>
            <span className="font-mono text-[10px] text-[var(--dim)] tracking-wider">
              // CREATIVE TECH
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[var(--accent-dim)] border border-[var(--accent)]/35">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-mono text-[10px] font-semibold text-[var(--accent)] tracking-wider">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Portrait Photo with Balanced Crop & Padding */}
        <div className="my-5 relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm">
          <img
            src={profile.avatarUrl}
            alt="Hamza Akil Khan"
            className="w-full h-56 object-cover object-center filter grayscale contrast-105 hover:grayscale-0 transition-all duration-500"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/70 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Card Typography & Details */}
        <div className="space-y-2.5">
          <div>
            <h3 className="font-sans font-semibold text-xl text-[var(--foreground)] tracking-tight">
              {profile.name}
            </h3>
            <p className="font-mono text-xs text-[var(--accent)] font-medium tracking-wide">
              {profile.role}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--muted)] pt-1 border-t border-[var(--border)]">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] pt-1">
              <MapPin size={11} className="text-[var(--accent)]" />
              {profile.location}
            </span>
            <span className="font-mono text-[11px] text-[var(--dim)] pt-1">
              B.E. // GRAD
            </span>
          </div>
        </div>

        {/* Barcode Identifier */}
        <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
          <div className="flex items-end gap-[2px] h-4" aria-hidden="true">
            <span className="w-[1.5px] h-full bg-[var(--muted)]" />
            <span className="w-[3px] h-3 bg-[var(--muted)]" />
            <span className="w-[1px] h-full bg-[var(--muted)]" />
            <span className="w-[2px] h-2 bg-[var(--muted)]" />
            <span className="w-[1.5px] h-full bg-[var(--muted)]" />
            <span className="w-[4px] h-full bg-[var(--muted)]" />
            <span className="w-[1px] h-3 bg-[var(--muted)]" />
            <span className="w-[2.5px] h-full bg-[var(--muted)]" />
            <span className="w-[1px] h-2 bg-[var(--muted)]" />
            <span className="w-[3px] h-full bg-[var(--muted)]" />
          </div>
          <span className="font-mono text-[10px] text-[var(--dim)] tracking-widest">
            HK-2026-DEV
          </span>
        </div>
      </div>
    </div>
  );
}
