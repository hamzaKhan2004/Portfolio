import React from 'react';
import { profile } from '../data/portfolioData';
import { Layers, Sparkles, Cpu, Terminal, GraduationCap, MapPin } from 'lucide-react';

const CORE_STRENGTHS = [
  {
    num: "01",
    title: "Full-Stack Architecture",
    icon: Layers,
    summary: "End-to-end MERN architectures with indexed MongoDB schemas, modular Express middleware, secure JWT rotation, and production deployments."
  },
  {
    num: "02",
    title: "AI Product Integration",
    icon: Sparkles,
    summary: "Connecting Google Gemini multimodal models into real-world applications with structured JSON schema evaluation and sub-second feedback streaming."
  },
  {
    num: "03",
    title: "Real-Time Protocols",
    icon: Cpu,
    summary: "Architecting peer-to-peer WebRTC video calling and Socket.io bidirectional presence channels engineered for low latency."
  },
  {
    num: "04",
    title: "Tactile Creative Frontend",
    icon: Terminal,
    summary: "Crafting fluid Awwwards-grade digital interfaces with GSAP timelines, Matter.js 2D physics simulations, and 60fps compositor transforms."
  }
];

export default function About() {
  return (
    <section id="about" className="section-spacing border-b border-[var(--border)] relative bg-[var(--background)]">
      <div className="editorial-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] block mb-2">
              // 02 • ABOUT & CAPABILITIES
            </span>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl text-[var(--foreground)] tracking-tight">
              ARCHITECTING SYSTEMS FOR HUMANS.
            </h2>
          </div>
          <span className="font-mono text-xs text-[var(--dim)] tracking-wider">
            15-SECOND OVERVIEW
          </span>
        </div>

        {/* 2-Column Layout: Strengths on Left, ID Card Landing Dock on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
          {/* Left Column: Concise Narrative & 4 Strengths */}
          <div className="lg:col-span-7 space-y-10">
            {/* Concise Core Statement */}
            <div className="space-y-4">
              <p className="text-xl sm:text-2xl text-[var(--foreground)] font-medium leading-snug">
                Computer Engineering graduate and MERN Stack Developer based in Mumbai.
              </p>
              <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-[62ch]">
                I bridge robust backend systems with tactile, high-performance frontend interfaces. Every application I ship is custom-engineered with zero generic templates, verified code hygiene, and deliberate interaction craft.
              </p>
            </div>

            {/* 4 Consistent Core Strengths in a 2-Column Grid on Desktop, 1 Column on Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {CORE_STRENGTHS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.num}
                    className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 hover:border-[var(--border-strong)] transition-all group flex flex-col justify-between min-h-[190px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <IconComponent size={20} className="text-[var(--accent)]" />
                        <span className="font-mono text-xs text-[var(--dim)]">
                          {item.num} // DOMAIN
                        </span>
                      </div>
                      <h3 className="font-sans font-semibold text-lg text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Concise Education & Location Badge */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[var(--border)] font-mono text-xs text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <GraduationCap size={15} className="text-[var(--accent)]" />
                <span>B.E. IN COMPUTER ENGINEERING</span>
              </div>
              <span className="text-[var(--dim)]">/</span>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[var(--accent)]" />
                <span>MUMBAI, MAHARASHTRA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Designated Landing Dock for ID Card (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end">
            <div
              id="about-card-target"
              className="w-[290px] sm:w-[325px] h-[480px] rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/20 p-6 flex flex-col items-center justify-center text-center relative pointer-events-none"
            >
              <span className="font-mono text-xs text-[var(--dim)] tracking-wider">
                [ ID CARD DOCKING ZONE ]
              </span>
              <span className="font-mono text-[10px] text-[var(--muted)] mt-1">
                TRANSFERS MOMENTUM ON SCROLL
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
