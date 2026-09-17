import React, { useState, useRef, useEffect } from 'react';
import { projects } from '../data/portfolioData';
import { ArrowUpRight, ExternalLink, Github, Layers } from 'lucide-react';
import MagneticButton from './MagneticButton';
import gsap from 'gsap';

export default function Projects({ onSelectProject }) {
  const [hoveredProject, setHoveredProject] = useState(null);
  const followerRef = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // Smooth spring follow for preview card
    const xTo = gsap.quickTo(follower, 'x', { duration: 0.38, ease: 'power3.out' });
    const yTo = gsap.quickTo(follower, 'y', { duration: 0.38, ease: 'power3.out' });
    const rotTo = gsap.quickTo(follower, 'rotation', { duration: 0.45, ease: 'power2.out' });

    const handleMouseMove = (e) => {
      const dx = e.clientX - lastMousePos.current.x;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // Ensure the preview card stays inside the intended right-center zone
      // and NEVER covers the left project text column (min X ~ 46vw, max X inside viewport)
      const targetX = Math.max(window.innerWidth * 0.46, Math.min(window.innerWidth - 390, e.clientX + 30));
      const targetY = Math.max(90, Math.min(window.innerHeight - 280, e.clientY - 120));

      xTo(targetX);
      yTo(targetY);

      // Subtle tilt based on cursor velocity
      const tilt = Math.max(-8, Math.min(8, dx * 0.25));
      rotTo(tilt);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="work" className="section-spacing border-b border-[var(--border)] relative bg-[var(--background)]">
      <div className="editorial-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] block mb-2">
              // 03 • PRODUCTION ARCHITECTURES
            </span>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl text-[var(--foreground)] tracking-tight">
              SELECTED WORK.
            </h2>
          </div>
          <span className="font-mono text-xs text-[var(--dim)] tracking-wider">
            06 SHIPPED APPLICATIONS
          </span>
        </div>

        {/* Editorial Project List */}
        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {projects.map((proj) => {
            const isHovered = hoveredProject?.id === proj.id;

            return (
              <article
                key={proj.id}
                onMouseEnter={() => setHoveredProject(proj)}
                onMouseLeave={() => setHoveredProject(null)}
                className={`group py-12 sm:py-14 transition-colors duration-300 ${
                  isHovered ? 'bg-[var(--surface)]/35' : 'bg-transparent'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                  {/* Number */}
                  <div className="lg:col-span-1">
                    <span className="font-mono text-2xl sm:text-3xl text-[var(--dim)] group-hover:text-[var(--accent)] transition-colors">
                      {proj.id}
                    </span>
                  </div>

                  {/* Project Details (Scoped to col-span-7 so text is never overlapped) */}
                  <div className="lg:col-span-7 space-y-4">
                    <h3
                      onClick={() => onSelectProject(proj)}
                      className="font-sans font-semibold text-2xl sm:text-4xl text-[var(--foreground)] tracking-tight hover:text-[var(--accent)] transition-colors cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>{proj.title}</span>
                      <ArrowUpRight
                        size={22}
                        className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[var(--accent)]"
                      />
                    </h3>

                    <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-[54ch]">
                      {proj.description}
                    </p>

                    {/* Dot-separated tech list */}
                    <div className="font-mono text-xs sm:text-sm text-[var(--dim)] tracking-wide pt-1">
                      {proj.tags.join('   ·   ')}
                    </div>

                    {/* Mobile Project Image Frame (clean fallback for touch) */}
                    <div className="block lg:hidden mt-5 rounded-xl overflow-hidden border border-[var(--border)]">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-52 sm:h-64 object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* External Links & Deep Dive Trigger */}
                  <div className="lg:col-span-4 flex flex-wrap lg:flex-col lg:items-end gap-3.5 pt-2">
                    {proj.demoLink && (
                      <MagneticButton
                        href={proj.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--foreground)] hover:text-[var(--accent)] transition-colors px-3.5 py-2 rounded border border-[var(--border)] hover:border-[var(--accent)]"
                      >
                        <ExternalLink size={12} className="text-[var(--accent)]" />
                        <span>LIVE APPLICATION</span>
                      </MagneticButton>
                    )}

                    {proj.repoLink && (
                      <MagneticButton
                        href={proj.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-3.5 py-2 rounded border border-[var(--border)] hover:border-[var(--foreground)]"
                      >
                        <Github size={12} />
                        <span>REPOSITORY</span>
                      </MagneticButton>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectProject(proj)}
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--accent)] hover:underline cursor-pointer pt-2"
                    >
                      <Layers size={13} />
                      <span>DEEP DIVE</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Floating Project Preview Layer (Restrained to never cover text) */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 pointer-events-none z-40 transition-opacity duration-300 hidden lg:block ${
          hoveredProject ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ willChange: 'transform, opacity' }}
        aria-hidden="true"
      >
        {hoveredProject && (
          <div className="w-[340px] rounded-xl overflow-hidden border border-[var(--border-strong)] bg-[var(--surface)] shadow-2xl p-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[var(--background)]">
              <img
                src={hoveredProject.image}
                alt={hoveredProject.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="mt-3 px-1 flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--foreground)] font-semibold truncate max-w-[200px]">
                {hoveredProject.title}
              </span>
              <span className="text-[var(--accent)] shrink-0">
                {hoveredProject.id} // PRODUCTION
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
