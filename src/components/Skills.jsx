import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Terminal, ArrowUpRight } from 'lucide-react';

const TECH_STACK = [
  {
    id: "01",
    name: "React",
    icon: "/tech_icons/react.svg",
    category: "FRONTEND ARCHITECTURE",
    description: "Component-driven UI architecture with custom hooks, state reconciliation, and modern React 19 paradigms.",
    highlight: "Virtual DOM reconciliation & clean modular components"
  },
  {
    id: "02",
    name: "JavaScript",
    icon: "/tech_icons/javascript.svg",
    category: "CORE LANGUAGE",
    description: "Deep ESNext fundamentals, asynchronous event loop, microtask queues, and web performance optimization.",
    highlight: "Language fundamentals & performant DOM manipulation"
  },
  {
    id: "03",
    name: "Node.js",
    icon: "/tech_icons/nodejs.svg",
    category: "BACKEND RUNTIME",
    description: "Event-driven asynchronous runtime, worker threads, stream processing, and high-concurrency micro-services.",
    highlight: "Non-blocking I/O & asynchronous service layers"
  },
  {
    id: "04",
    name: "Express.js",
    icon: "/tech_icons/express.svg",
    category: "API FRAMEWORK",
    description: "Modular middleware pipelines, route controller architecture, and robust RESTful API contracts.",
    highlight: "Secure routing, rate limiting & error handling"
  },
  {
    id: "05",
    name: "MongoDB",
    icon: "/tech_icons/mongodb.svg",
    category: "DATA PERSISTENCE",
    description: "Document schema modeling, complex aggregation pipelines, compound indexing, and NoSQL scalability.",
    highlight: "Schema design & indexed query performance"
  },
  {
    id: "06",
    name: "TypeScript",
    icon: "/tech_icons/typescript.svg",
    category: "TYPE CONTRACTS",
    description: "Static type contracts, generics, utility types, and strict compile-time contract validation across the stack.",
    highlight: "End-to-end type safety & reduced runtime failures"
  },
  {
    id: "07",
    name: "Tailwind CSS",
    icon: "/tech_icons/tailwind.svg",
    category: "STYLING SYSTEM",
    description: "Utility-first design token customization, fluid responsive clamp typography, and lightweight UI architecture.",
    highlight: "Consistent design tokens & zero CSS bloat"
  },
  {
    id: "08",
    name: "GSAP",
    icon: "/tech_icons/gsap.svg",
    category: "CREATIVE MOTION",
    description: "ScrollTrigger timelines, compositor-thread choreographies, and high-performance creative web animation.",
    highlight: "Scroll-bound kinetics & fluid micro-interactions"
  },
  {
    id: "09",
    name: "Socket.io",
    icon: "/tech_icons/socketio.svg",
    category: "REAL-TIME PROTOCOL",
    description: "Bidirectional WebSocket channels, presence rooms, and instantaneous real-time state synchronization.",
    highlight: "Low-latency broadcast & collaborative streaming"
  },
  {
    id: "10",
    name: "WebRTC",
    icon: "/tech_icons/webrtc.svg",
    category: "MEDIA PROTOCOL",
    description: "RTCPeerConnection mesh protocols, ICE/SDP negotiation, and low-latency peer-to-peer media streaming.",
    highlight: "P2P video/audio communication pipelines"
  },
  {
    id: "11",
    name: "Gemini AI",
    icon: "/tech_icons/geminiai.svg",
    category: "MULTIMODAL INTELLIGENCE",
    description: "Multimodal prompt engineering, structured JSON schema evaluation, and AI-assisted workflow engines.",
    highlight: "Structured LLM extraction & prompt orchestration"
  }
];

export default function Skills() {
  const [activeTech, setActiveTech] = useState(TECH_STACK[0]);
  const activeTechIdRef = useRef(activeTech.id);
  activeTechIdRef.current = activeTech.id;
  const itemRefs = useRef({});
  const cardRef = useRef(null);

  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      // Only execute scroll detection on mobile/tablet screens (< 1024px)
      if (typeof window === 'undefined' || window.innerWidth >= 1024) return;

      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (window.innerWidth >= 1024) return;

        // Calculate focal trigger line just below the sticky featured card
        let focalY = window.innerHeight * 0.42;
        let cardRect = null;
        if (cardRef.current) {
          cardRect = cardRef.current.getBoundingClientRect();
          focalY = Math.max(cardRect.bottom + 32, window.innerHeight * 0.35);
        }

        let closestTech = null;
        let minDistance = Infinity;

        for (const tech of TECH_STACK) {
          const el = itemRefs.current[tech.id];
          if (!el) continue;

          const rect = el.getBoundingClientRect();

          // Hide items that have scrolled behind or above the sticky card on mobile to prevent peeking
          if (cardRect && rect.top <= cardRect.top + 32) {
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
          } else {
            el.style.opacity = '';
            el.style.pointerEvents = '';
          }

          // Track the item whose center is closest to focal line
          const itemCenter = (rect.top + rect.bottom) / 2;
          const distance = Math.abs(itemCenter - focalY);
          if (distance < minDistance) {
            minDistance = distance;
            closestTech = tech;
          }
        }

        if (closestTech && closestTech.id !== activeTechIdRef.current) {
          activeTechIdRef.current = closestTech.id;
          setActiveTech(closestTech);
        }
      });
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        for (const tech of TECH_STACK) {
          const el = itemRefs.current[tech.id];
          if (el) {
            el.style.opacity = '';
            el.style.pointerEvents = '';
          }
        }
      } else {
        handleScroll();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial check on mount
    handleScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section id="stack" className="section-spacing border-b border-[var(--border)] relative bg-[var(--background)]">
      <div className="editorial-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4" style={{ marginBottom: "48px" }}>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] block" style={{ marginBottom: "8px" }}>
              // 04 • TECHNICAL CAPABILITIES
            </span>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl text-[var(--foreground)] tracking-tight">
              ECOSYSTEM & STACK.
            </h2>
          </div>
          <span className="font-mono text-xs text-[var(--dim)] tracking-wider">
            11 CORE ARCHITECTURAL TOOLS
          </span>
        </div>

        {/* 2-Column Split: Left = Technology Index, Right = Sticky Dynamic Description */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-14 lg:items-start relative">
          {/* Description Card — on mobile stays sticky near the top of the viewport */}
          <div ref={cardRef} className="mobile-sticky-tech lg:col-span-5 order-first lg:order-last">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl flex flex-col gap-6" style={{ padding: "28px" }}>
              {/* Header with Icon & Category */}
              <div className="flex items-center justify-between border-b border-[var(--border)]" style={{ paddingBottom: "20px" }}>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center shadow-inner" style={{ padding: "10px" }}>
                    <img
                      src={activeTech.icon}
                      alt={activeTech.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-2xl text-[var(--foreground)] tracking-tight">
                      {activeTech.name}
                    </h3>
                    <span className="font-mono text-xs text-[var(--accent)] tracking-wider">
                      {activeTech.category}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs text-[var(--dim)]">
                  {activeTech.id} // VERIFIED
                </span>
              </div>

              {/* Dynamic Concise Description */}
              <div className="flex flex-col gap-4">
                <p className="font-sans text-base sm:text-lg text-[var(--muted)] leading-relaxed">
                  {activeTech.description}
                </p>

                <div className="rounded-xl bg-[var(--background)] border border-[var(--border)] font-mono text-xs text-[var(--foreground)] flex items-start gap-3" style={{ padding: "16px" }}>
                  <Terminal size={15} className="text-[var(--accent)] shrink-0" style={{ marginTop: "2px" }} />
                  <span className="leading-relaxed">{activeTech.highlight}</span>
                </div>
              </div>

              {/* Status footer */}
              <div className="border-t border-[var(--border)] flex items-center justify-between font-mono text-[11px] text-[var(--dim)]" style={{ paddingTop: "12px" }}>
                <span>SYSTEM STATUS: ACTIVE</span>
                <span className="text-[var(--accent)] font-medium">READY FOR PRODUCTION</span>
              </div>
            </div>
          </div>

          {/* Tech list — on mobile shows BELOW description (order-last) */}
          <div className="lg:col-span-7 divide-y divide-[var(--border)] border-y border-[var(--border)] order-last lg:order-first">
            {TECH_STACK.map((tech) => {
              const isActive = activeTech.id === tech.id;
              return (
                <div
                  key={tech.id}
                  ref={(el) => (itemRefs.current[tech.id] = el)}
                  onMouseEnter={() => {
                    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                      activeTechIdRef.current = tech.id;
                      setActiveTech(tech);
                    }
                  }}
                  onClick={() => {
                    activeTechIdRef.current = tech.id;
                    setActiveTech(tech);
                  }}
                  className={`flex items-center justify-between cursor-pointer transition-colors duration-200 group rounded-lg ${
                    isActive ? 'bg-[var(--surface)] text-[var(--accent)]' : 'lg:hover:bg-[var(--surface)]/40'
                  }`}
                  style={{ paddingTop: "20px", paddingBottom: "20px", paddingLeft: "12px", paddingRight: "12px" }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      activeTechIdRef.current = tech.id;
                      setActiveTech(tech);
                    }
                  }}
                  aria-label={`View details for ${tech.name}`}
                >
                  <div className="flex items-center gap-5 sm:gap-7">
                    <span className="font-mono text-xs sm:text-sm text-[var(--dim)] lg:group-hover:text-[var(--accent)] transition-colors">
                      {tech.id}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center" style={{ padding: "4px" }}>
                        <img src={tech.icon} alt="" className="w-4 h-4 object-contain" />
                      </div>
                      <span
                        className={`font-sans font-medium text-xl sm:text-2xl tracking-tight transition-transform duration-200 lg:group-hover:translate-x-1.5 ${
                          isActive ? 'text-[var(--accent)] font-semibold' : 'text-[var(--foreground)]'
                        }`}
                      >
                        {tech.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="font-mono text-[11px] text-[var(--dim)] hidden sm:inline">
                      {tech.category}
                    </span>
                    <ArrowUpRight
                      size={18}
                      className={`transition-opacity duration-200 ${
                        isActive ? 'opacity-100 text-[var(--accent)]' : 'opacity-0 lg:group-hover:opacity-100 text-[var(--muted)]'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Bottom Runway Spacer: Ensures the last items (WebRTC, Gemini AI) can scroll fully into view below the sticky model */}
          <div className="block lg:hidden" style={{ height: "140px" }} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
