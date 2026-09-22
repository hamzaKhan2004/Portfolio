import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

import { TECHNOLOGY_CONFIG } from '../data/technologies';

const TECH_ITEMS = TECHNOLOGY_CONFIG;

export default function FooterPhysics() {
  const sceneRef = useRef(null);
  const elementsContainerRef = useRef(null);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const scene = sceneRef.current;
    const elementsContainer = elementsContainerRef.current;
    if (!scene || !elementsContainer) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = Matter;

    // 1. Matter Engine with balanced gravity
    const engine = Engine.create({
      enableSleeping: false,
      gravity: { x: 0, y: 0.85, scale: 0.001 }
    });

    const runner = Runner.create();
    let isRunning = false;
    const timeoutIds = [];

    const isMobile = window.innerWidth < 768;
    const width = scene.clientWidth;
    const height = scene.clientHeight;

    // 2. Invisible Physical Boundaries (Floor, Left, Right, Ceiling)
    const wallOptions = { isStatic: true, friction: 0.3, restitution: 0.4 };
    const floor = Bodies.rectangle(width / 2, height + 25, width * 2, 50, wallOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height * 2, wallOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height * 2, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -120, width * 2, 50, wallOptions);

    Composite.add(engine.world, [floor, leftWall, rightWall, ceiling]);

    // Select items from shared source of truth
    const selectedTech = isMobile ? TECH_ITEMS.slice(0, 10) : TECH_ITEMS;
    const itemWidth = isMobile ? 116 : 136;
    const itemHeight = 38;

    const bodiesWithElements = [];

    // 3. Prepare DOM elements and Rigid Bodies
    selectedTech.forEach((tech, i) => {
      const el = document.createElement('div');
      el.className =
        'absolute cursor-grab active:cursor-grabbing select-none flex items-center justify-center gap-2.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] shadow-sm transition-shadow hover:border-[var(--accent)] hover:shadow-md opacity-0';
      el.style.paddingLeft = '12px';
      el.style.paddingRight = '12px';
      el.style.paddingTop = '6px';
      el.style.paddingBottom = '6px';
      el.style.width = `${itemWidth}px`;
      el.style.height = `${itemHeight}px`;
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.willChange = 'transform, opacity';
      el.style.touchAction = 'none';

      el.innerHTML = `
        <img
          src="${tech.icon}"
          alt="${tech.name}"
          class="w-5 h-5 object-contain shrink-0 pointer-events-none filter brightness-110 saturate-150"
          style="width: 20px; height: 20px; flex-shrink: 0;"
        />
        <span class="font-mono text-[11px] font-medium tracking-wide pointer-events-none text-[var(--foreground)] whitespace-nowrap">${tech.name}</span>
      `;

      elementsContainer.appendChild(el);

      // Staggered horizontal drop distribution
      const spawnX = (width / (selectedTech.length + 1)) * (i + 1) + (Math.random() - 0.5) * 30;
      const spawnY = -50;

      const body = Bodies.rectangle(spawnX, spawnY, itemWidth, itemHeight, {
        chamfer: { radius: 17 },
        restitution: 0.45,  // Controlled bounce
        friction: 0.25,
        frictionAir: 0.02,
        density: 0.003,
        angle: 0
      });

      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 1.5,
        y: 1.5 + Math.random() * 1.5
      });

      bodiesWithElements.push({ body, el });
    });

    // 4. Mouse and Touch Drag Constraint
    const mouse = Mouse.create(scene);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.3,
        damping: 0.1,
        render: { visible: false }
      }
    });

    Composite.add(engine.world, mouseConstraint);

    // 5. Self-Righting Torque: keeps pills upright so text is never inverted!
    Events.on(engine, 'beforeUpdate', () => {
      for (let i = 0; i < bodiesWithElements.length; i++) {
        const { body } = bodiesWithElements[i];
        // Self-righting spring torque towards 0 radians (upright)
        const currentAngle = body.angle;
        const targetAngle = 0;
        const angleDiff = currentAngle - targetAngle;
        body.torque = -0.006 * angleDiff - 0.002 * body.angularVelocity;
      }
    });

    // 6. Sync DOM transforms from physics state
    Events.on(engine, 'afterUpdate', () => {
      const halfW = itemWidth / 2;
      const halfH = itemHeight / 2;

      for (let i = 0; i < bodiesWithElements.length; i++) {
        const { body, el } = bodiesWithElements[i];
        if (body.position.y > -70) {
          el.style.opacity = '1';
        }
        el.style.transform = `translate3d(${(body.position.x - halfW).toFixed(2)}px, ${(body.position.y - halfH).toFixed(2)}px, 0) rotate(${body.angle.toFixed(3)}rad)`;
      }
    });

    // 7. Trigger drop sequence when in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isRunning) {
          isRunning = true;
          Runner.run(runner, engine);

          bodiesWithElements.forEach(({ body }, idx) => {
            const tid = setTimeout(() => {
              Composite.add(engine.world, body);
              setActiveCount((prev) => prev + 1);
            }, idx * 120);
            timeoutIds.push(tid);
          });
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(scene);

    const handleResize = () => {
      const newWidth = scene.clientWidth;
      const newHeight = scene.clientHeight;

      Body.setPosition(floor, { x: newWidth / 2, y: newHeight + 25 });
      Body.setPosition(rightWall, { x: newWidth + 25, y: newHeight / 2 });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      timeoutIds.forEach(clearTimeout);
      Runner.stop(runner);
      Engine.clear(engine);
      Composite.clear(engine.world, false);

      bodiesWithElements.forEach(({ el }) => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, []);

  return (
    <div className="relative w-full" style={{ marginTop: "32px", marginBottom: "32px" }}>
      {/* Sandbox Container */}
      <div
        ref={sceneRef}
        className="relative w-full h-[220px] sm:h-[260px] rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 overflow-hidden shadow-inner"
        style={{ touchAction: 'none' }}
        aria-label="Interactive technology physics sandbox"
      >
        {/* Header Hint */}
        <div className="absolute pointer-events-none font-mono text-[11px] text-[var(--dim)] z-20 flex items-center gap-2"
          style={{ top: "14px", left: "20px" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
          <span>// 2D MATTER.JS PHYSICS: CLICK & FLING LOGOS</span>
        </div>

        {/* Floor Line */}
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-[var(--border-strong)] pointer-events-none" />

        {/* DOM elements container */}
        <div ref={elementsContainerRef} className="absolute inset-0 overflow-hidden" />
      </div>
    </div>
  );
}
