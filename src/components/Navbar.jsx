import React, { useState } from "react";
import { profile } from "../data/portfolioData";
import { Sun, Moon, ArrowUpRight, Menu, X } from "lucide-react";
import MagneticButton from "./MagneticButton";

export default function Navbar({ isDark, onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-12 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--border)]"
      style={{ paddingTop: "16px", paddingBottom: "16px" }}
    >
      <div className="editorial-container h-full flex items-center justify-between">
        {/* Brand Mark - Larger & More Prominent */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, "home")}
          className="group flex items-baseline gap-2.5 text-decoration-none focus:outline-none flex-shrink-0"
          aria-label="Hamza Akil Khan home"
        >
          <span className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
            {profile.initials}
          </span>
          <span className="font-mono text-xs sm:text-sm text-[var(--dim)] hidden sm:inline tracking-wider font-medium">
            / DEV
          </span>
        </a>

        {/* Minimal Editorial Desktop Navigation - Larger & Better Spaced */}
        <nav
          className="hidden md:flex items-center gap-12 lg:gap-14"
          aria-label="Main navigation"
        >
          <a
            href="#about"
            onClick={(e) => handleLinkClick(e, "about")}
            className="font-mono text-sm lg:text-sm uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors font-medium"
          >
            About
          </a>
          <a
            href="#work"
            onClick={(e) => handleLinkClick(e, "work")}
            className="font-mono text-sm lg:text-sm uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors font-medium"
          >
            Work
          </a>
          <a
            href="#stack"
            onClick={(e) => handleLinkClick(e, "stack")}
            className="font-mono text-sm lg:text-sm uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors font-medium"
          >
            Stack
          </a>
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, "contact")}
            className="font-mono text-sm lg:text-sm uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors font-medium"
          >
            Contact
          </a>
        </nav>

        {/* Right Actions: Theme Switcher & Resume & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-10 h-10 md:w-8 md:h-8 rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-all cursor-pointer flex items-center justify-center"
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Targeted Magnetic Resume CTA - More Prominent */}
          <MagneticButton
            href={profile.resumeUrl}
            download="Hamza_Akil_Khan_Resume.pdf"
            className="hidden sm:inline-flex justify-center items-center gap-2.5 font-mono text-sm lg:text-sm text-[var(--foreground)] hover:text-[var(--accent)] transition-colors w-32 h-8 text-center border border-[var(--border)] hover:border-[var(--accent)] rounded font-semibold tracking-wide"
          >
            <span>RESUME</span>
            <ArrowUpRight size={18} className="text-[var(--accent)]" />
          </MagneticButton>

          {/* Mobile Menu Button - Same dimensions as theme toggle on mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] transition-colors cursor-pointer flex items-center justify-center"
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Minimal Mobile Drawer - Better Spacing */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-full bg-[var(--background)]/98 border-b border-[var(--border)] backdrop-blur-lg shadow-2xl transition-all" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "48px", paddingBottom: "48px" }}>
          <nav className="flex flex-col gap-1">
            <a
              href="#about"
              onClick={(e) => handleLinkClick(e, "about")}
              className="font-sans text-2xl font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              style={{ paddingTop: "14px", paddingBottom: "14px" }}
            >
              About
            </a>
            <a
              href="#work"
              onClick={(e) => handleLinkClick(e, "work")}
              className="font-sans text-2xl font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              style={{ paddingTop: "14px", paddingBottom: "14px" }}
            >
              Work
            </a>
            <a
              href="#stack"
              onClick={(e) => handleLinkClick(e, "stack")}
              className="font-sans text-2xl font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              style={{ paddingTop: "14px", paddingBottom: "14px" }}
            >
              Stack
            </a>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, "contact")}
              className="font-sans text-2xl font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
              style={{ paddingTop: "14px", paddingBottom: "14px" }}
            >
              Contact
            </a>

            <div className="h-[1px] bg-[var(--border)]" style={{ marginTop: "24px", marginBottom: "24px" }} />

            <a
              href={profile.resumeUrl}
              download="Hamza_Akil_Khan_Resume.pdf"
              className="btn-primary w-full text-center text-lg font-semibold"
              style={{ paddingTop: "20px", paddingBottom: "20px" }}
            >
              DOWNLOAD RESUME
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
