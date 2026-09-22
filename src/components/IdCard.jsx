import React, { useRef, useEffect, useState } from "react";
import { profile } from "../data/portfolioData";
import { MapPin, Play, Pause, RotateCcw } from "lucide-react";

export default function IdCard() {
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const cardAssemblyRef = useRef(null);
  const hookRef = useRef(null);
  const hookRingRef = useRef(null);
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const boundsRef = useRef(null);
  const svgRef = useRef(null);
  const shadowPathRef = useRef(null);
  const mainPathRef = useRef(null);
  const accentPathRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  const handlePlay = (e) => {
    if (e) e.stopPropagation();
    if (hasVideoError || !videoRef.current) return;

    if (videoRef.current.currentTime >= videoRef.current.duration) {
      videoRef.current.currentTime = 0;
    }

    videoRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("Unmuted playback failed, attempting muted playback:", err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch((mutedErr) => {
              console.warn("Video playback failed completely:", mutedErr);
              setHasVideoError(true);
              setIsPlaying(false);
            });
        }
      });
  };

  const handlePause = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      handlePause(e);
    } else {
      handlePlay(e);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const anchorEl = anchorRef.current;
    const cardAssembly = cardAssemblyRef.current;
    const hookRingEl = hookRingRef.current;
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!container || !anchorEl || !cardAssembly || !hookRingEl || !card) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // ── Bounding box cache ──
    const updateBounds = () => {
      boundsRef.current = card.getBoundingClientRect();
    };
    updateBounds();

    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateBounds();
      });
      resizeObserver.observe(container);
    }

    // ── Physics state ──
    // cardX, cardY = local displacement in pixels relative to resting position
    let cardX = 0;
    let cardY = 0;
    let velX = 0;
    let velY = 0;

    // Pointer drag state
    let isDragging = false;
    let dragStartPointerX = 0;
    let dragStartPointerY = 0;
    let dragStartCardX = 0;
    let dragStartCardY = 0;
    let targetCardX = 0;
    let targetCardY = 0;

    // Rotation & dynamic tilt
    let swingAngle = 0;
    let swingVelocity = 0;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    // Scroll extension state
    let currentScrollY = window.scrollY;
    let targetScrollOffsetY = 0;
    let targetScrollOffsetX = 0;
    let scrollOffsetY = 0;
    let scrollOffsetX = 0;

    // Spring tuning parameters
    const SPRING_STIFFNESS = 0.09;
    const SPRING_DAMPING = 0.86;
    const DRAG_STIFFNESS = 0.24;
    const DRAG_DAMPING = 0.72;
    const PENDULUM_K = 0.045;
    const PENDULUM_DAMP = 0.92;
    const MAX_DISPLACEMENT = 160;

    let lastPointerX = 0;
    let lastPointerY = 0;
    let lastTime = performance.now();
    let animFrameId = null;

    // ── SVG Rope Update (Strictly in container local coordinates) ──
    const updateRope = () => {
      const cRect = container.getBoundingClientRect();
      const aRect = anchorEl.getBoundingClientRect();
      const hRect = hookRingEl.getBoundingClientRect();

      // Start point: bottom-center of top fixed anchor mount
      const ax = aRect.left + aRect.width / 2 - cRect.left;
      const ay = aRect.bottom - cRect.top;

      // End point: top-center of hook metal ring O
      const bx = hRect.left + hRect.width / 2 - cRect.left;
      const by = hRect.top + 2 - cRect.top;

      const dx = bx - ax;
      const dy = by - ay;
      const dist = Math.hypot(dx, dy);

      // Natural vertical resting clearance is ~70px
      // If card is pushed upward (dist < 70px), the strap develops natural slack/sag
      const slack = Math.max(0, 70 - dist);
      const slackSag = slack * 0.45;

      // Cubic Bezier control points:
      // CP1 leaves the anchor heading downwards with subtle lateral lead
      const cx1 = ax + dx * 0.15 + (slack > 5 ? slackSag : 0);
      const cy1 = ay + dy * 0.40 + (slack > 5 ? slack * 0.2 : 0);

      // CP2 approaches the hook ring aligned with the hook's position
      const cx2 = ax + dx * 0.85;
      const cy2 = ay + dy * 0.65;

      const pathData = `M ${ax.toFixed(1)} ${ay.toFixed(1)} C ${cx1.toFixed(1)} ${cy1.toFixed(1)}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${bx.toFixed(1)} ${by.toFixed(1)}`;

      if (mainPathRef.current) mainPathRef.current.setAttribute("d", pathData);
      if (accentPathRef.current) accentPathRef.current.setAttribute("d", pathData);
      if (shadowPathRef.current) {
        const shadowData = `M ${ax.toFixed(1)} ${(ay + 2).toFixed(1)} C ${cx1.toFixed(1)} ${(cy1 + 3).toFixed(1)}, ${cx2.toFixed(1)} ${(cy2 + 3).toFixed(1)}, ${bx.toFixed(1)} ${(by + 2).toFixed(1)}`;
        shadowPathRef.current.setAttribute("d", shadowData);
      }
    };

    // ── Pointer Handlers (Relative, omnidirectional, zero bias) ──
    const handlePointerDown = (e) => {
      // Primary button for mouse; allow primary touch on mobile
      if (e.pointerType === "mouse" && e.button !== 0) return;

      isDragging = true;
      dragStartPointerX = e.clientX;
      dragStartPointerY = e.clientY;
      dragStartCardX = cardX;
      dragStartCardY = cardY;
      targetCardX = cardX;
      targetCardY = cardY;

      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      lastTime = performance.now();

      targetTiltX = 0;
      targetTiltY = 0;

      card.style.cursor = "grabbing";

      if (e.pointerType === "touch" && card.setPointerCapture) {
        try {
          card.setPointerCapture(e.pointerId);
        } catch (_) {}
      }

      if (e.pointerType !== "touch") {
        e.preventDefault();
      }
    };

    const handlePointerMove = (e) => {
      if (isDragging) {
        // Compute delta strictly from drag-start coordinates
        // Cursor moves right -> deltaX > 0 -> pulls right
        // Cursor moves left -> deltaX < 0 -> pulls left
        // Cursor moves down -> deltaY > 0 -> pulls down
        // Cursor moves up -> deltaY < 0 -> pulls up
        const deltaX = e.clientX - dragStartPointerX;
        const deltaY = e.clientY - dragStartPointerY;
        targetCardX = dragStartCardX + deltaX;
        targetCardY = dragStartCardY + deltaY;

        const now = performance.now();
        const dt = Math.max(1, now - lastTime);
        const vx = (e.clientX - lastPointerX) / dt;
        swingVelocity += Math.max(-1.5, Math.min(1.5, vx * 0.04));
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        lastTime = now;
        return;
      }

      // Proximity 3D perspective tilt on hover (desktop only)
      if (window.innerWidth >= 1024) {
        const bounds = boundsRef.current || card.getBoundingClientRect();
        const cx = bounds.left + bounds.width / 2;
        const cy = bounds.top + bounds.height / 2;

        const relX = (e.clientX - cx) / (window.innerWidth * 0.45);
        const relY = (e.clientY - cy) / (window.innerHeight * 0.45);
        targetTiltX = Math.max(-7, Math.min(7, -relY * 9));
        targetTiltY = Math.max(-7, Math.min(7, relX * 9));

        if (glare) {
          const gx = ((e.clientX - bounds.left) / bounds.width) * 100;
          const gy = ((e.clientY - bounds.top) / bounds.height) * 100;
          glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18) 0%, rgba(184,255,60,0.06) 35%, transparent 70%)`;
        }
      }
    };

    const handlePointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      targetCardX = 0;
      targetCardY = 0;
      card.style.cursor = "grab";
      if (e && e.pointerType === "touch" && card.releasePointerCapture) {
        try {
          card.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    };

    const handleMouseLeave = () => {
      if (!isDragging) {
        targetTiltX = 0;
        targetTiltY = 0;
        if (glare) glare.style.background = "transparent";
      }
    };

    // ── Scroll Handler: Smooth progression toward About section ──
    let totalDeltaY = 0;
    let totalDeltaX = 0;
    let maxScroll = 1;

    const recalculateScrollMetrics = () => {
      const isDesktop = window.innerWidth >= 1024;
      const aboutDock = document.getElementById("about-card-target");
      const aboutEl = document.getElementById("about");
      if (!card) return;

      const cardRect = card.getBoundingClientRect();
      const cardDocTop = cardRect.top + window.scrollY - scrollOffsetY;
      const cardDocLeft = cardRect.left + window.scrollX - scrollOffsetX;

      maxScroll =
        aboutEl && aboutEl.offsetTop > 0 ? aboutEl.offsetTop : window.innerHeight;

      if (isDesktop && aboutDock) {
        const dockRect = aboutDock.getBoundingClientRect();
        if (dockRect.width > 0) {
          const dockDocTop = dockRect.top + window.scrollY;
          const dockDocLeft = dockRect.left + window.scrollX;

          totalDeltaY =
            dockDocTop - cardDocTop + (dockRect.height - cardRect.height) / 2;
          totalDeltaX =
            dockDocLeft - cardDocLeft + (dockRect.width - cardRect.width) / 2;
        } else {
          totalDeltaY = 0;
          totalDeltaX = 0;
        }
      } else {
        // Mobile / small screen: downward card extension
        // As user scrolls down, ID card moves DOWN (+Y), rope extends naturally
        totalDeltaY = Math.min(280, window.innerHeight * 0.4);
        totalDeltaX = 0;
      }
    };

    const handleScroll = () => {
      currentScrollY = window.scrollY;
      if (maxScroll <= 1) recalculateScrollMetrics();
      const rawProgress = Math.min(Math.max(0, currentScrollY / maxScroll), 1);
      // Smooth cubic Hermite ease
      const progress =
        rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      targetScrollOffsetY = progress * totalDeltaY;
      targetScrollOffsetX = progress * totalDeltaX;
    };

    const handleResize = () => {
      updateBounds();
      recalculateScrollMetrics();
      handleScroll();
    };

    // Initial scroll setup
    recalculateScrollMetrics();
    handleScroll();

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    card.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    card.style.cursor = "grab";

    // ── Unified Physics Animation Loop ──
    const physicsLoop = () => {
      const now = performance.now();

      // 1. Card displacement springs
      if (isDragging) {
        const dx = targetCardX - cardX;
        const dy = targetCardY - cardY;
        velX = velX * DRAG_DAMPING + dx * DRAG_STIFFNESS;
        velY = velY * DRAG_DAMPING + dy * DRAG_STIFFNESS;
      } else {
        // Hooke's Law spring restoring force: force = -stiffness * displacement
        const forceX = -SPRING_STIFFNESS * cardX;
        const forceY = -SPRING_STIFFNESS * cardY;
        velX = (velX + forceX) * SPRING_DAMPING;
        velY = (velY + forceY) * SPRING_DAMPING;
      }
      cardX += velX;
      cardY += velY;

      // Bound drag displacement
      cardX = Math.max(-MAX_DISPLACEMENT, Math.min(MAX_DISPLACEMENT, cardX));
      cardY = Math.max(-MAX_DISPLACEMENT, Math.min(MAX_DISPLACEMENT, cardY));

      // 2. Scroll extension spring (smooth follow)
      scrollOffsetY += (targetScrollOffsetY - scrollOffsetY) * 0.12;
      scrollOffsetX += (targetScrollOffsetX - scrollOffsetX) * 0.12;

      // 3. Dynamic card rotation
      // Directional tilt: pulling right tilts clockwise (+), pulling left tilts counter-clockwise (-)
      const dragTilt = cardX * 0.055;
      // Velocity tilt: fast horizontal motion leans card into movement
      const velTilt = Math.max(-3, Math.min(3, velX * 0.18));

      // Damped pendulum oscillation
      const swingForce = -PENDULUM_K * swingAngle;
      swingVelocity = (swingVelocity + swingForce) * PENDULUM_DAMP;
      swingAngle += swingVelocity;

      // Subtle ambient sway at rest
      const ambientSway = Math.sin(now * 0.0016) * 0.75;

      let totalAngle = dragTilt + velTilt + swingAngle + ambientSway;
      totalAngle = Math.max(-8.5, Math.min(8.5, totalAngle));

      // 4. 3D perspective tilt
      tiltX += (targetTiltX - tiltX) * 0.08;
      tiltY += (targetTiltY - tiltY) * 0.08;

      // 5. Apply unified transform to cardAssembly (moves hook and card together)
      const translateX = cardX + scrollOffsetX;
      const translateY = cardY + scrollOffsetY;
      cardAssembly.style.transform = `translate3d(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px, 0) rotateZ(${totalAngle.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;

      // 6. Redraw dynamic SVG lanyard rope
      updateRope();

      animFrameId = requestAnimationFrame(physicsLoop);
    };

    animFrameId = requestAnimationFrame(physicsLoop);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      card.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (resizeObserver) resizeObserver.disconnect();
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero-id-card-wrapper"
      className="relative flex flex-col items-center justify-start select-none z-30"
      style={{
        perspective: "1200px",
        paddingTop: "6px",
        paddingBottom: "8px",
      }}
      aria-label="Hamza Akil Khan interactive physical identity card"
    >
      {/* SVG Lanyard Strap — Absolute overlay inside container, dynamically redrawn in local coords */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          overflow: "visible",
          zIndex: 15,
        }}
        aria-hidden="true"
      >
        {/* Soft shadow under strap */}
        <path
          ref={shadowPathRef}
          fill="none"
          stroke="rgba(0, 0, 0, 0.35)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Main strap body */}
        <path
          ref={mainPathRef}
          fill="none"
          stroke="var(--dim)"
          strokeWidth="3.5"
          strokeLinecap="round"
          style={{ opacity: 0.95 }}
        />
        {/* Woven stitch / accent center thread */}
        <path
          ref={accentPathRef}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />
      </svg>

      {/* Top Fixed Anchor Mount */}
      <div
        ref={anchorRef}
        className="relative z-20 flex flex-col items-center"
        style={{ marginBottom: "70px" }}
        aria-hidden="true"
      >
        {/* Sleek metallic anchor mount */}
        <div
          className="w-4 h-4 rounded-full bg-[var(--surface-hover)] border-2 border-[var(--border-strong)] flex items-center justify-center shadow-md"
          style={{
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.35)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)] opacity-75" />
        </div>
      </div>

      {/* Moving Card Assembly (Hook + Card as a unified physical unit) */}
      <div
        ref={cardAssemblyRef}
        className="relative flex flex-col items-center select-none"
        style={{
          transformOrigin: "center top",
          willChange: "transform",
        }}
      >
        {/* Metal Clip Hook — Rigidly connected to card, moves & rotates with it */}
        <div
          ref={hookRef}
          className="flex flex-col items-center pointer-events-none"
          style={{ zIndex: 20 }}
          aria-hidden="true"
        >
          {/* Metal Loop O: Where the lanyard strap attaches */}
          <div
            ref={hookRingRef}
            className="w-5 h-5 rounded-full border-2 border-[var(--border-strong)] bg-[var(--surface-hover)] shadow-sm flex items-center justify-center"
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-[var(--background)]" />
          </div>

          {/* Metal Clip clamping into the punch hole */}
          <div
            className="w-8 h-4 bg-gradient-to-b from-[#8a909a] to-[#4a505a] rounded-sm border border-white/20 shadow-md"
            style={{ marginTop: "-6px" }}
          />
        </div>

        {/* Physical Identity Card */}
        <div
          ref={cardRef}
          className="relative w-[290px] sm:w-[325px] rounded-2xl bg-[var(--surface)] border border-[var(--border-strong)] shadow-2xl origin-top overflow-hidden transition-shadow duration-300"
          style={{
            boxShadow:
              "0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 0 1px 1px var(--border)",
            transformStyle: "preserve-3d",
            transformOrigin: "top center",
            marginTop: "-6px",
            padding: "24px",
            userSelect: "none",
            touchAction: "none",
          }}
        >
          {/* Specular Glare Layer */}
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
            aria-hidden="true"
          />

          {/* Top Punch Hole */}
          <div
            className="w-9 h-2.5 rounded-full bg-[var(--background)] border border-[var(--border)] shadow-inner"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "20px",
            }}
          />

          {/* Card Header: Monogram & Verified Badge */}
          <div
            className="flex items-center justify-between border-b border-[var(--border)]"
            style={{ paddingBottom: "14px" }}
          >
            <div className="flex items-center" style={{ gap: "8px" }}>
              <span className="font-sans font-bold text-sm tracking-tight text-[var(--foreground)]">
                {profile.initials}
              </span>
              <span className="font-mono text-[10px] text-[var(--dim)] tracking-wider">
                // CREATIVE TECH
              </span>
            </div>

            <div
              className="flex items-center rounded bg-[var(--accent-dim)] border border-[var(--accent)]/35"
              style={{
                gap: "6px",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "2px",
                paddingBottom: "2px",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="font-mono text-[10px] font-semibold text-[var(--accent)] tracking-wider">
                VERIFIED
              </span>
            </div>
          </div>

          {/* Portrait Photo & Video Media Area */}
          <div
            className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm h-56 group cursor-pointer"
            style={{ marginTop: "20px", marginBottom: "20px" }}
            onClick={togglePlay}
            onPointerDown={(e) => e.stopPropagation()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                togglePlay(e);
              }
            }}
            aria-label={isPlaying ? "Pause introduction video" : "Play introduction video"}
          >
            {/* Existing Profile Image (Default Color on Mobile, Grayscale to Color on Hover on Desktop) */}
            <img
              src={profile.avatarUrl}
              alt="Hamza Akil Khan"
              className={`w-full h-full object-cover object-center filter max-lg:grayscale-0 max-lg:contrast-100 lg:grayscale lg:contrast-105 lg:group-hover:grayscale-0 lg:group-hover:contrast-100 transition-all duration-500 ${isPlaying && !hasVideoError ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              loading="eager"
            />

            {/* Introduction Video */}
            {!hasVideoError && (
              <video
                ref={videoRef}
                src="/My_video.mp4"
                playsInline
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => {
                  if (videoRef.current) videoRef.current.currentTime = 0;
                  setIsPlaying(false);
                }}
                onEnded={() => {
                  if (videoRef.current) videoRef.current.currentTime = 0;
                  setIsPlaying(false);
                }}
                onError={() => {
                  setHasVideoError(true);
                  setIsPlaying(false);
                }}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
              />
            )}

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/70 via-transparent to-transparent pointer-events-none" />

            {/* Desktop Hover Play Button Overlay (Visible ONLY on hover over the image, never in default idle state) */}
            {!isPlaying && !hasVideoError && (
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/30 shadow-xl text-white transition-transform duration-200 group-hover:scale-105 active:scale-95"
                  aria-hidden="true"
                >
                  <Play size={20} className="text-white fill-white translate-x-0.5" />
                </div>
              </div>
            )}

            {/* Small Non-Obstructive Video Control Badge (Positioned at bottom corner, away from face) */}
            {!hasVideoError && (
              <button
                type="button"
                onClick={togglePlay}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label={isPlaying ? "Pause introduction video" : "Play introduction video"}
                title={isPlaying ? "Pause video" : "Play introduction video"}
                className="absolute bottom-2.5 right-2.5 z-20 inline-flex items-center gap-5 px-2.5 py-1 rounded-full bg-black/65 hover:bg-black/85 active:bg-black/95 backdrop-blur-md border border-[var(--accent)]/40 text-[var(--accent)] text-[10px] font-mono tracking-wider shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause size={10} style={{
                      padding: "10px 0px",
                    }} className="text-[var(--accent)] fill-[var(--accent)]" />
                    <span style={{ marginRight: "15px" }}>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play size={10} style={{
                      padding: "10px 0px",
                    }} className="text-[var(--accent)] fill-[var(--accent)] translate-x-0.5" />
                    <span style={{ marginRight: "15px" }} className="">VIDEO</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Card Typography & Details */}
          <div className="space-y-2.5">
            <div>
              <h3 className="font-sans font-semibold text-xl text-[var(--foreground)] tracking-tight">
                {profile.name}
              </h3>
              <p className="font-mono text-xs text-[var(--accent)] font-medium tracking-wide">
                {profile.role}
              </p>
            </div>

            <div
              className="flex items-center justify-between text-xs text-[var(--muted)] border-t border-[var(--border)]"
              style={{ paddingTop: "4px" }}
            >
              <span
                className="inline-flex items-center font-mono text-[11px]"
                style={{ gap: "6px", paddingTop: "4px" }}
              >
                <MapPin size={11} className="text-[var(--accent)]" />
                {profile.location}
              </span>
              <span
                className="font-mono text-[11px] text-[var(--dim)]"
                style={{ paddingTop: "4px" }}
              >
                B.E. // GRAD
              </span>
            </div>
          </div>

          {/* Barcode Identifier */}
          <div
            className="border-t border-[var(--border)] flex items-center justify-between"
            style={{ marginTop: "16px", paddingTop: "12px" }}
          >
            <div
              className="flex items-end h-4"
              style={{ gap: "2px" }}
              aria-hidden="true"
            >
              <span className="w-[1.5px] h-full bg-[var(--muted)]" />
              <span className="w-[3px] h-3 bg-[var(--muted)]" />
              <span className="w-[1px] h-full bg-[var(--muted)]" />
              <span className="w-[2px] h-2 bg-[var(--muted)]" />
              <span className="w-[1.5px] h-full bg-[var(--muted)]" />
              <span className="w-[4px] h-full bg-[var(--muted)]" />
              <span className="w-[1px] h-3 bg-[var(--muted)]" />
              <span className="w-[2.5px] h-full bg-[var(--muted)]" />
              <span className="w-[1px] h-2 bg-[var(--muted)]" />
              <span className="w-[3px] h-full bg-[var(--muted)]" />
            </div>
            <span className="font-mono text-[10px] text-[var(--dim)] tracking-widest">
              HK-2026-DEV
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
