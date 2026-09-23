import React, { useState, useCallback, useEffect } from "react";
import { useLenisScroll } from "./animations/useLenisScroll";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import GravityFooter from "./components/GravityFooter";
import CustomCursor from "./components/CustomCursor";
import ProjectModal from "./components/ProjectModal";

import "./styles/index.css";

export default function App() {
  // Initialize Lenis smooth scroll and GSAP ScrollTrigger sync
  useLenisScroll();

  const [isLoading, setIsLoading] = useState(true);
  const [introPhase, setIntroPhase] = useState("booting");
  const [isDark, setIsDark] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleBootComplete = useCallback(() => {
    setIntroPhase("revealing");
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleIntroSettled = useCallback(() => {
    setIntroPhase("ready");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("light");
      root.classList.add("dark");
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute("content", "#080a0c");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute("content", "#f4f4f0");
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const handleOpenProject = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseProject = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-[var(--accent-foreground)] relative">
      <div className="noise-overlay" aria-hidden="true" />
      <CustomCursor />

      {isLoading && (
        <Preloader
          onBootComplete={handleBootComplete}
          onComplete={handlePreloaderComplete}
        />
      )}

      <div
        id="navbar-wrapper"
        style={{
          opacity: introPhase === "booting" ? 0 : 1,
          transform:
            introPhase === "booting" ? "translate3d(0, -10px, 0)" : "none",
          transition:
            introPhase === "revealing" || introPhase === "ready"
              ? "opacity 0.5s ease-out, transform 0.5s ease-out"
              : "none",
        }}
      >
        <Navbar isDark={isDark} onToggleTheme={toggleTheme} />
      </div>

      <main id="main-content">
        <Hero introPhase={introPhase} onIntroSettled={handleIntroSettled} />
        <About />
        <Projects onSelectProject={handleOpenProject} />
        <Skills />
      </main>

      <GravityFooter />

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseProject} />
      )}
    </div>
  );
}
