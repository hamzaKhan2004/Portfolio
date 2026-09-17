import React, { useState, useEffect } from 'react';
import { profile } from '../data/portfolioData';
import { Sun, Moon, ArrowUpRight, Menu, X } from 'lucide-react';
import MagneticButton from './MagneticButton';

export default function Navbar({ isDark, onToggleTheme, onNavigateWithTransition }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigateWithTransition) {
      onNavigateWithTransition(() => {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--border)] py-3.5'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="editorial-container flex items-center justify-between">
        {/* Brand Mark */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="group flex items-baseline gap-2 text-decoration-none focus:outline-none"
          aria-label="Hamza Akil Khan home"
        >
          <span className="font-sans font-bold text-xl tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
            {profile.initials}
          </span>
          <span className="font-mono text-xs text-[var(--dim)] hidden sm:inline tracking-wider">
            / DEV
          </span>
        </a>

        {/* Minimal Editorial Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-9" aria-label="Main navigation">
          <a
            href="#about"
            onClick={(e) => handleLinkClick(e, 'about')}
            className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            About
          </a>
          <a
            href="#work"
            onClick={(e) => handleLinkClick(e, 'work')}
            className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Work
          </a>
          <a
            href="#stack"
            onClick={(e) => handleLinkClick(e, 'stack')}
            className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Stack
          </a>
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, 'contact')}
            className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Right Actions: Theme Switcher & Resume & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all cursor-pointer"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Targeted Magnetic Resume CTA */}
          <MagneticButton
            href={profile.resumeUrl}
            download="Hamza_Akil_Khan_Resume.pdf"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-[var(--foreground)] hover:text-[var(--accent)] transition-colors py-2 px-3.5 border border-[var(--border)] hover:border-[var(--accent)] rounded"
          >
            <span>RESUME</span>
            <ArrowUpRight size={13} className="text-[var(--accent)]" />
          </MagneticButton>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Minimal Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-full bg-[var(--background)]/98 border-b border-[var(--border)] backdrop-blur-lg px-6 py-8 shadow-2xl transition-all">
          <nav className="flex flex-col gap-6">
            <a
              href="#about"
              onClick={(e) => handleLinkClick(e, 'about')}
              className="font-sans text-2xl font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
            >
              About
            </a>
            <a
              href="#work"
              onClick={(e) => handleLinkClick(e, 'work')}
              className="font-sans text-2xl font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
            >
              Work
            </a>
            <a
              href="#stack"
              onClick={(e) => handleLinkClick(e, 'stack')}
              className="font-sans text-2xl font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
            >
              Stack
            </a>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="font-sans text-2xl font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
            >
              Contact
            </a>

            <div className="h-[1px] bg-[var(--border)] my-2" />

            <a
              href={profile.resumeUrl}
              download="Hamza_Akil_Khan_Resume.pdf"
              className="btn-primary w-full text-center py-3"
            >
              DOWNLOAD RESUME
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
