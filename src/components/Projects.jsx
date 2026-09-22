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

      const followerWidth = follower.offsetWidth || 340;
      const container = document.querySelector('#work .editorial-container');

      let minX = 100;
      let maxX = window.innerWidth - followerWidth - 100;

      if (container) {
        const cRect = container.getBoundingClientRect();
        // Prevent follower from moving too far to the left or right ends:
        // Left margin keeps it clear of the project index / left edge
        const leftMargin = Math.max(120, cRect.width * 0.3);
        // Right margin keeps it clear of the action buttons on the right
        const rightMargin = Math.max(160, cRect.width * 0.2);

        minX = cRect.left + leftMargin;
        maxX = cRect.right - followerWidth - rightMargin;

        if (minX > maxX) {
          const center = cRect.left + (cRect.width - followerWidth) / 2;
          minX = center;
          maxX = center;
        }
      }

      const desiredX = e.clientX - followerWidth / 2;
      const targetX = Math.max(minX, Math.min(maxX, desiredX));
      const targetY = Math.max(60, Math.min(window.innerHeight - 320, e.clientY - 140));

      xTo(targetX);
      yTo(targetY);

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
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4" style={{ marginBottom: "64px" }}>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] block" style={{ marginBottom: "8px" }}>
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

        {/* Desktop View: Editorial Project List with Clamped Hover Preview */}
        <div className="hidden lg:block divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {projects.map((proj) => {
            const isHovered = hoveredProject?.id === proj.id;

            return (
              <article
                key={proj.id}
                onMouseEnter={() => setHoveredProject(proj)}
                onMouseLeave={(e) => {
                  // Keep preview active if moving into the floating card or another project row
                  if (followerRef.current && e.relatedTarget && followerRef.current.contains(e.relatedTarget)) {
                    return;
                  }
                  if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('#work article')) {
                    return;
                  }
                  setHoveredProject(null);
                }}
                className={`group transition-colors duration-300 ${isHovered ? 'bg-[var(--surface)]/35' : 'bg-transparent'
                  }`}
                style={{ paddingTop: "48px", paddingBottom: "48px" }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                  {/* Number */}
                  <div className="lg:col-span-1">
                    <span className="font-mono text-2xl sm:text-3xl text-[var(--dim)] group-hover:text-[var(--accent)] transition-colors">
                      {proj.id}
                    </span>
                  </div>

                  {/* Project Details (Scoped to col-span-7 so text is never overlapped) */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
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
                    <div className="font-mono text-xs sm:text-sm text-[var(--dim)] tracking-wide" style={{ paddingTop: "4px" }}>
                      {proj.tags.join('   ·   ')}
                    </div>
                  </div>

                  {/* External Links & Deep Dive Trigger (Action Area) */}
                  <div className="lg:col-span-4 flex flex-wrap lg:flex-col lg:items-end gap-3.5" style={{ paddingTop: "8px" }}>
                    {proj.demoLink && (
                      <MagneticButton
                        href={proj.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--foreground)] hover:text-[var(--accent)] transition-colors rounded border border-[var(--border)] hover:border-[var(--accent)]"
                        style={{ paddingLeft: "14px", paddingRight: "14px", paddingTop: "8px", paddingBottom: "8px" }}
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
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded border border-[var(--border)] hover:border-[var(--foreground)]"
                        style={{ paddingLeft: "14px", paddingRight: "14px", paddingTop: "8px", paddingBottom: "8px" }}
                      >
                        <Github size={12} />
                        <span>REPOSITORY</span>
                      </MagneticButton>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectProject(proj)}
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--accent)] hover:underline cursor-pointer"
                      style={{ paddingTop: "8px" }}
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

        {/* Mobile View: Rolling Stacked Cards (Physical stack shuffle with complete screenshots) */}
        <div className="block lg:hidden relative" style={{ marginTop: "24px" }}>
          {projects.map((proj, idx) => {
            return (
              <article
                key={proj.id}
                className="w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-2xl overflow-hidden transition-all duration-300"
                style={{
                  position: "sticky",
                  top: `${72 + idx * 8}px`,
                  zIndex: idx + 10,
                  marginBottom: idx === projects.length - 1 ? "0px" : "32px",
                  padding: "20px",
                  boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.5), 0 0 1px 1px var(--border-strong)"
                }}
              >
                {/* Header: Project Number, Title & Deep Dive Button */}
                <div className="flex items-center justify-between border-b border-[var(--border)]" style={{ paddingBottom: "14px" }}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg font-bold text-[var(--accent)]">
                      {proj.id}
                    </span>
                    <h3
                      onClick={() => onSelectProject(proj)}
                      className="font-sans font-bold text-xl text-[var(--foreground)] tracking-tight cursor-pointer"
                    >
                      {proj.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProject(proj)}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--accent)] hover:underline cursor-pointer"
                    style={{ padding: "4px 8px" }}
                  >
                    <Layers size={13} />
                    <span>DEEP DIVE</span>
                  </button>
                </div>

                {/* Complete Project Screenshot Frame (Full image visible, aspect ratio preserved, no crop) */}
                <div
                  className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--background)] w-full flex items-center justify-center cursor-pointer"
                  style={{ marginTop: "16px", marginBottom: "16px", minHeight: "180px", maxHeight: "280px" }}
                  onClick={() => onSelectProject(proj)}
                >
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: "280px", display: "block" }}
                    loading="lazy"
                  />
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--muted)] leading-relaxed" style={{ marginBottom: "14px" }}>
                  {proj.description}
                </p>

                {/* Tags */}
                <div className="font-mono text-[11px] text-[var(--dim)] tracking-wide" style={{ marginBottom: "18px" }}>
                  {proj.tags.join('   ·   ')}
                </div>

                {/* Action Buttons (Always accessible, clear inline-style spacing, never covered) */}
                <div className="flex flex-wrap items-center gap-2.5 border-t border-[var(--border)]" style={{ paddingTop: "14px" }}>
                  {proj.demoLink && (
                    <MagneticButton
                      href={proj.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--foreground)] hover:text-[var(--accent)] transition-colors rounded border border-[var(--border)] hover:border-[var(--accent)]"
                      style={{ paddingLeft: "12px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px" }}
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
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded border border-[var(--border)] hover:border-[var(--foreground)]"
                      style={{ paddingLeft: "12px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px" }}
                    >
                      <Github size={12} />
                      <span>REPOSITORY</span>
                    </MagneticButton>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Floating Project Preview Layer (Restrained to never cover text) */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 pointer-events-none z-40 transition-opacity duration-300 hidden lg:block ${hoveredProject ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        style={{ willChange: 'transform, opacity' }}
        aria-hidden={!hoveredProject}
      >
        {hoveredProject && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject(hoveredProject);
              setHoveredProject(null);
            }}
            onMouseLeave={(e) => {
              if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('#work article')) {
                return;
              }
              setHoveredProject(null);
            }}
            className="w-[340px] rounded-xl overflow-hidden border border-[var(--border-strong)] bg-[var(--surface)] shadow-2xl pointer-events-auto cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] select-none group/preview"
            style={{ padding: "12px" }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectProject(hoveredProject);
                setHoveredProject(null);
              }
            }}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[var(--background)] pointer-events-none">
              <img
                src={hoveredProject.image}
                alt={hoveredProject.title}
                className="w-full h-full object-cover object-top pointer-events-none"
                draggable={false}
              />
            </div>
            <div className="flex items-center justify-between font-mono text-xs pointer-events-none" style={{ marginTop: "12px", paddingLeft: "4px", paddingRight: "4px" }}>
              <span className="text-[var(--foreground)] group-hover/preview:text-[var(--accent)] font-semibold truncate max-w-[200px] transition-colors">
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
