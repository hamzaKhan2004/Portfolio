import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { profile } from "../data/portfolioData";
import GravityTechTrail from "./GravityTechTrail";
import IdCard from "./IdCard";
import MagneticButton from "./MagneticButton";
import { ArrowDownRight, Mail } from "lucide-react";

export default function Hero({ introPhase = "ready", onIntroSettled }) {
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = heroContentRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    if (introPhase === "booting") {
      el.style.opacity = "0";
      el.style.transform = "translate3d(0, 14px, 0)";
    } else if (introPhase === "revealing") {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "transform",
      });
    } else if (introPhase === "ready") {
      el.style.opacity = "1";
      gsap.set(el, { clearProps: "transform" });
    }
  }, [introPhase]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-[95vh] flex items-center border-b border-[var(--border)]"
      style={{
        paddingTop: "clamp(96px, 10vw, 144px)",
        paddingBottom: "clamp(96px, 10vw, 144px)",
      }}
    >
      {/* Signature Interaction #1: Slow Deliberate Gravity Tech Trail */}
      <GravityTechTrail containerRef={heroRef} />

      <div className="editorial-container relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          <div ref={heroContentRef} className="lg:col-span-7 flex flex-col justify-center">
            <div
              className="flex flex-wrap items-center gap-3"
              style={{ marginBottom: "32px" }}
            >
              <span
                className="inline-flex items-center gap-2 font-mono text-xs text-[var(--accent)] font-medium bg-[var(--accent-dim)] rounded-full border border-[var(--accent)]/30"
                style={{ paddingLeft: "12px", paddingRight: "12px", paddingTop: "4px", paddingBottom: "4px" }}
              >
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                AVAILABLE FOR OPPORTUNITIES
              </span>
              <span className="font-mono text-xs text-[var(--dim)]">/</span>
              <span className="font-mono text-xs text-[var(--muted)] tracking-wider">
                {profile.location.toUpperCase()}
              </span>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <div style={{ marginBottom: "12px" }}>
                <h1 className="font-sans font-bold text-5xl sm:text-7xl lg:text-[5.4rem] leading-[0.94] tracking-tighter text-[var(--foreground)]">
                  HAMZA <br />
                  <span className="text-[var(--muted)]">AKIL KHAN</span>
                </h1>
              </div>
              <p
                className="font-mono text-sm sm:text-base text-[var(--accent)] tracking-widest font-medium"
                style={{ paddingTop: "8px" }}
              >
                {profile.role.toUpperCase()}
              </p>
            </div>

            <p
              className="text-lg sm:text-xl text-[var(--muted)] leading-relaxed max-w-[62ch]"
              style={{ marginBottom: "40px" }}
            >
              {profile.bio}
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <MagneticButton
                href="#work"
                onClick={(e) => scrollToSection(e, "work")}
                className="btn-primary"
              >
                <span>EXPLORE WORK</span>
                <ArrowDownRight size={16} />
              </MagneticButton>

              <MagneticButton
                href="#contact"
                onClick={(e) => scrollToSection(e, "contact")}
                className="btn-secondary"
              >
                <Mail size={15} />
                <span>GET IN TOUCH</span>
              </MagneticButton>
            </div>

            <div className="hidden sm:block" style={{ marginTop: "64px" }}>
              <span className="font-mono text-xs text-[var(--dim)] tracking-wider">
                // MOVE CURSOR ACROSS VIEWPORT TO RELEASE TECHNOLOGY LOGOS
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <IdCard introPhase={introPhase} onIntroSettled={onIntroSettled} />
          </div>
        </div>
      </div>
    </section>
  );
}
