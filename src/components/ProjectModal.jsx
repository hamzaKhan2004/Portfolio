import React, { useEffect, useRef } from 'react';
import { ExternalLink, Github, X } from 'lucide-react';
import { stopLenis, startLenis } from '../animations/useLenisScroll';
import MagneticButton from './MagneticButton';
import gsap from 'gsap';

export default function ProjectModal({ project, onClose }) {
  const windowRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    // 1. Lock background Lenis smooth scroll and body overflow
    stopLenis();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 2. Single smooth entrance animation
    if (windowRef.current) {
      gsap.fromTo(
        windowRef.current,
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.36, ease: 'power3.out' }
      );
    }
    if (backdropRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      startLenis();
    };
  }, []);

  const handleClose = () => {
    if (windowRef.current) {
      gsap.to(windowRef.current, {
        scale: 0.96,
        opacity: 0,
        y: 12,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  if (!project) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-8 overscroll-contain"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        ref={windowRef}
        data-lenis-prevent="true"
        className="relative w-full max-w-[1000px] max-h-[86vh] overflow-y-auto rounded-2xl bg-[var(--surface)] border border-[var(--border-strong)] shadow-2xl p-7 sm:p-10 lg:p-12 space-y-8 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-[var(--border)]">
          <div className="font-mono text-xs text-[var(--muted)] flex items-center gap-2">
            <span>PROJECT</span>
            <span className="text-[var(--dim)]">/</span>
            <span className="text-[var(--accent)]">{project.id}</span>
            <span className="text-[var(--dim)]">/</span>
            <span className="text-[var(--foreground)] uppercase font-semibold">
              {project.title}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors cursor-pointer"
            aria-label="Close project modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Headline & Overview */}
        <div className="space-y-3">
          <h2
            id="project-modal-title"
            className="font-sans font-bold text-3xl sm:text-4xl text-[var(--foreground)] tracking-tight"
          >
            {project.title}
          </h2>
          <p className="text-lg sm:text-xl text-[var(--muted)] leading-relaxed max-w-[70ch]">
            {project.description}
          </p>
        </div>

        {/* Large Screenshot Frame */}
        <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--background)] shadow-lg">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-auto max-h-[440px] object-cover object-top"
            loading="eager"
          />
        </div>

        {/* Engineering & Architectural Breakdown */}
        <div className="space-y-4 pt-2">
          <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--accent)] font-medium">
            // ARCHITECTURAL IMPLEMENTATION & SYSTEM DESIGN
          </h4>
          <p className="text-base sm:text-lg text-[var(--foreground)] leading-relaxed">
            {project.architectureDetail}
          </p>
        </div>

        {/* Technologies List */}
        <div className="space-y-3 pt-3 border-t border-[var(--border)]">
          <span className="font-mono text-xs text-[var(--dim)] block">
            // ECOSYSTEM & PROTOCOLS
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((tag) => (
              <span key={tag} className="tech-badge">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions with Targeted Magnetic Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--border)]">
          {project.demoLink && (
            <MagneticButton
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <span>LAUNCH APPLICATION</span>
              <ExternalLink size={15} />
            </MagneticButton>
          )}

          {project.repoLink && (
            <MagneticButton
              href={project.repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Github size={15} />
              <span>INSPECT REPOSITORY</span>
            </MagneticButton>
          )}
        </div>
      </div>
    </div>
  );
}
