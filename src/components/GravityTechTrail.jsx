import React, { useEffect, useRef } from "react";

// Technologies Hamza actually uses
const TECH_LOGOS = [
  { name: "React", icon: "/tech_icons/react.svg" },
  { name: "Node.js", icon: "/tech_icons/nodejs.svg" },
  { name: "JavaScript", icon: "/tech_icons/javascript.svg" },
  { name: "TypeScript", icon: "/tech_icons/typescript.svg" },
  { name: "MongoDB", icon: "/tech_icons/mongodb.svg" },
  { name: "Next.js", icon: "/tech_icons/nextjs.svg" },
  { name: "Tailwind CSS", icon: "/tech_icons/tailwind.svg" },
  { name: "GSAP", icon: "/tech_icons/gsap.svg" },
  { name: "Gemini AI", icon: "/tech_icons/geminiai.svg" },
  { name: "Socket.io", icon: "/tech_icons/socketio.svg" },
  { name: "WebRTC", icon: "/tech_icons/webrtc.svg" },
  { name: "Express", icon: "/tech_icons/express.svg" },
];

const TRAIL_CONFIG = {
  // Spawn control
  minDistance: 65,
  spawnCooldown: 180,
  maxActiveItems: 6,

  // Slower physics
  gravity: 0.14,
  bounce: 0.38,
  friction: 0.992,

  // Initial movement
  initialUpwardVelocity: -0.65,
  cursorVelocityInfluence: 0.08,

  // Lifetime
  lifetime: 1.0,
  decayRate: 0.006,

  // Rotation
  maxRotation: 10,
  rotationSpeed: 0.45,
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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) return;

    const spawnTechItem = (clientX, clientY, vx = 0, vy = 0) => {
      // Keep a strict limit on visible items
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

      const el = document.createElement("div");

      /*
        IMPORTANT:
        Bigger card
        Bigger icon
        Bigger text
        Slightly more padding
      */
      el.className =
        "absolute pointer-events-none select-none z-10 " +
        "flex items-center gap-3 " +
        "rounded-full border border-[var(--border-strong)] " +
        "bg-[var(--surface)]/95 backdrop-blur-md " +
        "shadow-xl text-[var(--foreground)] ";

      el.style.left = "0";
      el.style.top = "0";
      el.style.willChange = "transform, opacity";

      // Inline padding — does not depend on Tailwind spacing utilities
      el.style.paddingLeft = "20px";
      el.style.paddingRight = "20px";
      el.style.paddingTop = "12px";
      el.style.paddingBottom = "12px";
      el.innerHTML = `
        <img
          src="${tech.icon}"
          alt="${tech.name}"
          class="w-8 h-8 object-contain filter brightness-110 saturate-150"
        />

        <span
          class="font-mono text-[14px] font-semibold tracking-wide whitespace-nowrap text-[var(--foreground)]"
        >
          ${tech.name}
        </span>
      `;

      trailRoot.appendChild(el);

      /*
        Keep the random rotation subtle.
        Large rotation makes the cards feel chaotic.
      */
      const randomRot = (Math.random() - 0.5) * TRAIL_CONFIG.maxRotation;

      /*
        Cursor velocity affects the card only slightly.
        This prevents cards from shooting away too quickly.
      */
      const initialVx = Math.max(
        -1.2,
        Math.min(
          1.2,
          vx * TRAIL_CONFIG.cursorVelocityInfluence +
            (Math.random() - 0.5) * 0.35,
        ),
      );

      const initialVy = Math.min(
        -0.3,
        vy * 0.03 + TRAIL_CONFIG.initialUpwardVelocity,
      );

      const item = {
        el,
        x,
        y,
        vx: initialVx,
        vy: initialVy,

        rotation: randomRot,

        rotSpeed: (Math.random() - 0.5) * TRAIL_CONFIG.rotationSpeed,

        life: TRAIL_CONFIG.lifetime,

        bounces: 0,
      };

      itemsRef.current.push(item);
    };

    const handleMouseMove = (e) => {
      const now = performance.now();

      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;

      const distance = Math.hypot(dx, dy);

      lastPosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };

      accumulatedDistRef.current += distance;

      /*
        THROTTLING

        A new item appears only when:
        1. Cursor moved enough distance
        2. Enough time passed since previous item

        This prevents excessive spawning.
      */
      if (
        accumulatedDistRef.current >= TRAIL_CONFIG.minDistance &&
        now - lastSpawnTimeRef.current >= TRAIL_CONFIG.spawnCooldown
      ) {
        spawnTechItem(e.clientX, e.clientY, dx, dy);

        accumulatedDistRef.current = 0;
        lastSpawnTimeRef.current = now;
      }
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    const renderLoop = () => {
      const rect = container.getBoundingClientRect();

      /*
        Keep cards slightly above the bottom
        instead of allowing them to touch the edge.
      */
      const floorY = rect.height - 75;

      const activeItems = [];

      for (let i = 0; i < itemsRef.current.length; i++) {
        const item = itemsRef.current[i];

        /*
          PHYSICS
        */

        // Gravity
        item.vy += TRAIL_CONFIG.gravity;

        // Horizontal friction
        item.vx *= TRAIL_CONFIG.friction;

        // Position
        item.x += item.vx;
        item.y += item.vy;

        // Rotation
        item.rotation += item.rotSpeed;

        /*
          FLOOR COLLISION
        */
        if (item.y >= floorY) {
          item.y = floorY;

          item.vy = -item.vy * TRAIL_CONFIG.bounce;

          item.vx *= 0.82;

          item.rotSpeed *= 0.55;

          item.bounces++;
        }

        /*
          LIFE DECAY

          Slower decay = cards remain visible
          for longer.
        */
        const decay =
          item.bounces >= 2
            ? TRAIL_CONFIG.decayRate * 1.5
            : TRAIL_CONFIG.decayRate;

        item.life -= decay;

        /*
          SCALE

          Bigger initial size.
          Slightly shrinks while disappearing.
        */
        const scale = Math.max(0.88, Math.min(1, item.life * 1.08));

        /*
          FADE
        */
        const opacity = Math.max(0, item.life);

        /*
          DOM TRANSFORM
        */
        item.el.style.transform = `translate3d(
            ${item.x}px,
            ${item.y}px,
            0
          )
          rotate(${item.rotation.toFixed(2)}deg)
          scale(${scale})`;

        item.el.style.opacity = opacity.toFixed(3);

        /*
          Remove dead elements
        */
        if (item.life > 0) {
          activeItems.push(item);
        } else {
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
      container.removeEventListener("mousemove", handleMouseMove);

      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }

      for (let i = 0; i < itemsRef.current.length; i++) {
        const item = itemsRef.current[i];

        if (item.el && item.el.parentNode) {
          item.el.parentNode.removeChild(item.el);
        }
      }

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
