import React from 'react';
import { profile } from '../data/portfolioData';
import FooterPhysics from './FooterPhysics';
import MagneticButton from './MagneticButton';
import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';

export default function GravityFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="section-spacing border-t border-[var(--border)] bg-[var(--background)] scroll-mt-24"
      style={{ paddingTop: "96px", paddingBottom: "56px" }}>
      <div className="editorial-container">
        {/* Contact Narrative matching Screenshot 3 */}
        <div className="max-w-2xl" style={{ marginBottom: "48px" }}>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] block" style={{ marginBottom: "12px" }}>
            // 05 • GET IN TOUCH
          </span>
          <h2 className="font-sans font-bold text-4xl sm:text-6xl text-[var(--foreground)] tracking-tight" style={{ marginBottom: "16px" }}>
            LET'S BUILD <br />
            SOMETHING THOUGHTFUL.
          </h2>
          <p className="text-lg sm:text-xl text-[var(--muted)] leading-relaxed max-w-[60ch]" style={{ marginBottom: "32px" }}>
            Whether you have an engineering role, a full-stack product challenge, or want to discuss architectural patterns, my inbox is open.
          </p>

          <MagneticButton
            href={`mailto:${profile.email}`}
            className="btn-primary inline-flex items-center gap-2.5 text-sm"
          >
            <Mail size={16} />
            <span>{profile.email.toUpperCase()}</span>
          </MagneticButton>
        </div>

        {/* Integrated Signature 2D Physics Playground (Matter.js) */}
        <FooterPhysics />

        {/* Minimal Bottom Editorial Bar */}
        <div className="border-t border-[var(--border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ paddingTop: "48px", marginTop: "48px" }}>
          <div>
            <span className="font-sans font-bold text-xl text-[var(--foreground)] tracking-tight block">
              {profile.name}
            </span>
            <span className="font-mono text-xs text-[var(--dim)] tracking-wide">
              {profile.role.toUpperCase()} · MUMBAI, MAHARASHTRA
            </span>
            <div className="font-mono text-[11px] text-[var(--dim)]" style={{ marginTop: "8px" }}>
              © {new Date().getFullYear()} {profile.name.toUpperCase()}. CRAFTED WITH REACT, TAILWIND, GSAP & MATTER.JS.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[var(--muted)]">
            <MagneticButton
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5"
            >
              <Github size={13} />
              <span>GITHUB</span>
            </MagneticButton>

            <MagneticButton
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5"
            >
              <Linkedin size={13} />
              <span>LINKEDIN</span>
            </MagneticButton>

            <MagneticButton
              href={profile.resumeUrl}
              download="Hamza_Akil_Khan_Resume.pdf"
              className="hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowUpRight size={13} />
              <span>RESUME</span>
            </MagneticButton>

            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-[var(--foreground)] transition-colors inline-flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
              aria-label="Back to top of page"
            >
              <span>TOP</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
