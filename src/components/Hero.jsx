import React, { useRef } from 'react';
import { profile } from '../data/portfolioData';
import GravityTechTrail from './GravityTechTrail';
import IdCard from './IdCard';
import MagneticButton from './MagneticButton';
import { ArrowDownRight, Mail } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef(null);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-[95vh] flex items-center py-28 lg:py-36 border-b border-[var(--border)]"
    >
      {/* Signature Interaction #1: Slow Deliberate Gravity Tech Trail */}
      <GravityTechTrail containerRef={heroRef} />

      <div className="editorial-container relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          {/* Editorial Left Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Status & Location Line */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 font-mono text-xs text-[var(--accent)] font-medium bg-[var(--accent-dim)] px-3 py-1 rounded-full border border-[var(--accent)]/30">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                AVAILABLE FOR OPPORTUNITIES
              </span>
              <span className="font-mono text-xs text-[var(--dim)]">/</span>
              <span className="font-mono text-xs text-[var(--muted)] tracking-wider">
                {profile.location.toUpperCase()}
              </span>
            </div>

            {/* Monumental Editorial Headline */}
            <div className="space-y-3 mb-8">
              <h1 className="font-sans font-bold text-5xl sm:text-7xl lg:text-[5.4rem] leading-[0.94] tracking-tighter text-[var(--foreground)]">
                HAMZA <br />
                <span className="text-[var(--muted)]">AKIL KHAN</span>
              </h1>
              <p className="font-mono text-sm sm:text-base text-[var(--accent)] pt-2 tracking-widest font-medium">
                {profile.role.toUpperCase()}
              </p>
            </div>

            {/* Clear, Readable Biography */}
            <p className="text-lg sm:text-xl text-[var(--muted)] leading-relaxed mb-10 max-w-[62ch]">
              {profile.bio}
            </p>

            {/* Targeted Magnetic CTA Buttons */}
            <div className="flex flex-wrap items-center gap-5">
              <MagneticButton
                href="#work"
                onClick={(e) => scrollToSection(e, 'work')}
                className="btn-primary"
              >
                <span>EXPLORE WORK</span>
                <ArrowDownRight size={16} />
              </MagneticButton>

              <MagneticButton
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="btn-secondary"
              >
                <Mail size={15} />
                <span>GET IN TOUCH</span>
              </MagneticButton>
            </div>

            {/* Subtle Pointer Hint */}
            <div className="mt-16 hidden sm:block">
              <span className="font-mono text-xs text-[var(--dim)] tracking-wider">
                // MOVE CURSOR ACROSS VIEWPORT TO RELEASE TECHNOLOGY LOGOS
              </span>
            </div>
          </div>

          {/* Editorial Right Column: Physical Lanyard ID Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <IdCard />
          </div>
        </div>
      </div>
    </section>
  );
}
