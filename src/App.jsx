import React, { useState, useCallback, useEffect } from 'react';
import { useLenisScroll } from './animations/useLenisScroll';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import GravityFooter from './components/GravityFooter';
import CustomCursor from './components/CustomCursor';
import PageTransition from './animations/PageTransition';
import ProjectModal from './components/ProjectModal';

import './styles/index.css';

export default function App() {
  // Initialize Lenis smooth scroll and GSAP ScrollTrigger sync
  useLenisScroll();

  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sync Dark/Light theme class on root document
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light');
      root.classList.add('dark');
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', '#080a0c');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', '#f4f4f0');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  // Snappy tile transition exclusively for explicit section navigation
  const handleNavigateWithTransition = useCallback((callback) => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (callback) callback();
    }, 240);
  }, []);

  // Direct modal opening (eliminates double-transition conflict)
  const handleOpenProject = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseProject = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-[var(--accent-foreground)] relative">
      {/* Subtle Texture Grain Overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Subtle Desktop Custom Pointer */}
      <CustomCursor />

      {/* High-Tech Booting Loader (Only runs once on initial load) */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* Fast, GPU-Accelerated Tile Page Transition */}
      <PageTransition
        isActive={isTransitioning}
        onTransitionComplete={() => setIsTransitioning(false)}
      />

      {/* Minimal Header */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onNavigateWithTransition={handleNavigateWithTransition}
      />

      {/* Core Editorial Experience: HOME -> ABOUT -> WORK -> STACK */}
      <main id="main-content">
        <Hero />
        <About />
        <Projects onSelectProject={handleOpenProject} />
        <Skills />
      </main>

      {/* Integrated Contact & 2D Matter.js Physics Sandbox Footer */}
      <GravityFooter />

      {/* Isolated Architectural Deep-Dive Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseProject}
        />
      )}
    </div>
  );
}
