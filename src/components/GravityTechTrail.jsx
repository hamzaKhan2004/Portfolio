import React, { useEffect, useRef } from 'react';

// Technologies Hamza actually uses
const TECH_LOGOS = [
  { name: 'React', icon: '/tech_icons/react.svg' },
  { name: 'Node.js', icon: '/tech_icons/nodejs.svg' },
  { name: 'JavaScript', icon: '/tech_icons/javascript.svg' },
  { name: 'TypeScript', icon: '/tech_icons/typescript.svg' },
  { name: 'MongoDB', icon: '/tech_icons/mongodb.svg' },
  { name: 'Next.js', icon: '/tech_icons/nextjs.svg' },
  { name: 'Tailwind CSS', icon: '/tech_icons/tailwind.svg' },
  { name: 'GSAP', icon: '/tech_icons/gsap.svg' },
  { name: 'Gemini AI', icon: '/tech_icons/geminiai.svg' },
  { name: 'Socket.io', icon: '/tech_icons/socketio.svg' },
  { name: 'WebRTC', icon: '/tech_icons/webrtc.svg' },
  { name: 'Express', icon: '/tech_icons/express.svg' }
];

const TRAIL_CONFIG = {
  minDistance: 95,       // Minimum cursor movement distance in pixels before spawning
  maxActiveItems: 8,     // Strict budget for compositor performance
  spawnCooldown: 130,    // Minimum ms between spawns
  gravity: 0.32,         // Deliberate, smooth downward acceleration
  bounce: 0.48,          // Restitution on floor collision
  friction: 0.985,       // Horizontal deceleration
  maxBounces: 2,         // Bounces before settling quickly
  decayRate: 0.010       // Smooth lifetime decay (~1.8 - 2.2 seconds)
};

export default function GravityTechTrail({ containerRef }) {
  const trailContainerRef = useRef(null);
  const itemsRef = useRef([]);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const accumulatedDistRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const techIndexRef = useRef(0);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    const container = containerRef?.current;
    const trailRoot = trailContainerRef.current;
    if (!container || !trailRoot) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return; // Desktop signature interaction; clean fallback on touch

    const spawnTechItem = (clientX, clientY, vx = 0, vy = 0) => {
      // Evict oldest if reaching max limit
      if (itemsRef.current.length >= TRAIL_CONFIG.maxActiveItems) {
        const oldest = itemsRef.current.shift();
        if (oldest?.el && oldest.el.parentNode) {
          oldest.el.parentNode.removeChild(oldest.el);
        }
      }

      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const tech = TECH_LOGOS[techIndexRef.current % TECH_LOGOS.length];
      techIndexRef.current++;

      // Create DOM element with cohesive 60/30/10 styling
      const el = document.createElement('div');
      el.className = 'absolute pointer-events-none select-none z-10 flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface)]/90 backdrop-blur-sm shadow-lg text-[var(--foreground)]';
      el.style.left = '0';
      el.style.top = '0';
      el.style.willChange = 'transform, opacity';

      el.innerHTML = `
        <img src="${tech.icon}" alt="${tech.name}" class="w-4 h-4 object-contain filter grayscale contrast-125" />
        <span class="font-mono text-[11px] font-medium tracking-wide text-[var(--foreground)]">${tech.name}</span>
      `;

      trailRoot.appendChild(el);

      const randomRot = (Math.random() - 0.5) * 16;
      const initialVx = Math.max(-2, Math.min(2, vx * 0.2 + (Math.random() - 0.5) * 0.8));
      const initialVy = Math.min(-1.5, vy * 0.15 - 1.2); // Gentle upward arc before gravity takes over

      const item = {
        el,
        x,
        y,
        vx: initialVx,
        vy: initialVy,
        rotation: randomRot,
        rotSpeed: (Math.random() - 0.5) * 0.8,
        life: 1.0,
        bounces: 0
      };

      itemsRef.current.push(item);
    };

    const handleMouseMove = (e) => {
      const now = performance.now();
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      lastPosRef.current = { x: e.clientX, y: e.clientY };
      accumulatedDistRef.current += dist;

      // Distance-based throttling with cooldown
      if (
        accumulatedDistRef.current >= TRAIL_CONFIG.minDistance &&
        now - lastSpawnTimeRef.current >= TRAIL_CONFIG.spawnCooldown
      ) {
        spawnTechItem(e.clientX, e.clientY, dx, dy);
        accumulatedDistRef.current = 0;
        lastSpawnTimeRef.current = now;
      }
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Physics update loop
    const renderLoop = () => {
      const rect = container.getBoundingClientRect();
      const floorY = rect.height - 40; // Floor threshold within Hero section

      const activeItems = [];

      for (let i = 0; i < itemsRef.current.length; i++) {
        const item = itemsRef.current[i];

        // Apply physical forces
        item.vy += TRAIL_CONFIG.gravity;
        item.vx *= TRAIL_CONFIG.friction;
        item.x += item.vx;
        item.y += item.vy;
        item.rotation += item.rotSpeed;

        // Realistic floor bounce
        if (item.y >= floorY) {
          item.y = floorY;
          item.vy = -item.vy * TRAIL_CONFIG.bounce;
          item.vx *= 0.85;
          item.rotSpeed *= 0.6;
          item.bounces++;
        }

        // Decay life faster after maximum bounces
        const currentDecay = item.bounces >= TRAIL_CONFIG.maxBounces ? TRAIL_CONFIG.decayRate * 2.5 : TRAIL_CONFIG.decayRate;
        item.life -= currentDecay;

        // Apply DOM transform directly (no React state re-renders)
        if (item.el) {
          const scale = Math.max(0.75, Math.min(1, item.life * 1.15));
          item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.rotation.toFixed(2)}deg) scale(${scale})`;
          item.el.style.opacity = Math.max(0, item.life).toFixed(3);
        }

        if (item.life > 0) {
          activeItems.push(item);
        } else {
          // Clean up DOM node
          if (item.el && item.el.parentNode) {
            item.el.parentNode.removeChild(item.el);
          }
        }
      }

      itemsRef.current = activeItems;
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);

      // Clean up all DOM nodes
      itemsRef.current.forEach((item) => {
        if (item.el && item.el.parentNode) {
          item.el.parentNode.removeChild(item.el);
        }
      });
      itemsRef.current = [];
    };
  }, [containerRef]);

  return (
    <div
      ref={trailContainerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    />
  );
}
