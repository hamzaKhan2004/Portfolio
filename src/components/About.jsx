import React from 'react';
import { profile } from '../data/portfolioData';
import { GraduationCap, MapPin } from 'lucide-react';

const HIGHLIGHTS = [
  { label: "FULL-STACK", detail: "MERN · REST · JWT · Production Deployments" },
  { label: "AI INTEGRATION", detail: "Gemini Multimodal · Structured Extraction" },
  { label: "REAL-TIME", detail: "WebRTC · Socket.io · P2P Video Mesh" },
];

export default function About() {
  return (
    <section id="about" className="section-spacing border-b border-[var(--border)] relative bg-[var(--background)]">
      <div className="editorial-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4" style={{ marginBottom: "48px" }}>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] block" style={{ marginBottom: "8px" }}>
              // 02 • ABOUT
            </span>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl text-[var(--foreground)] tracking-tight">
              WHO I AM.
            </h2>
          </div>
          <span className="font-mono text-xs text-[var(--dim)] tracking-wider">
            15-SECOND READ
          </span>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Core Statement */}
            <p className="text-xl sm:text-2xl text-[var(--foreground)] font-medium leading-snug">
              {profile.bio}
            </p>

            {/* 3 compact highlights */}
            <div className="flex flex-col gap-0 border-t border-[var(--border)]">
              {HIGHLIGHTS.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center justify-between border-b border-[var(--border)]"
                  style={{ paddingTop: "14px", paddingBottom: "14px" }}
                >
                  <span className="font-mono text-xs font-semibold text-[var(--accent)] tracking-widest">
                    {h.label}
                  </span>
                  <span className="font-mono text-xs text-[var(--muted)] tracking-wide text-right">
                    {h.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* Education & Location */}
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[var(--muted)]">
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

          {/* Right Column: ID Card Docking Zone (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end">
            <div
              id="about-card-target"
              className="w-[290px] sm:w-[325px] h-[480px] rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/20 flex flex-col items-center justify-center text-center relative pointer-events-none"
              style={{ padding: "24px" }}
            >
              <span className="font-mono text-xs text-[var(--dim)] tracking-wider">
                [ ID CARD DOCKING ZONE ]
              </span>
              <span className="font-mono text-[10px] text-[var(--muted)]" style={{ marginTop: "4px" }}>
                TRANSFERS MOMENTUM ON SCROLL
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
