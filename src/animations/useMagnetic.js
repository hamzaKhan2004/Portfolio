import { useEffect } from 'react';
import gsap from 'gsap';

export function useMagnetic(ref, strength = 0.28) {
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    // Disable magnetic pull on touch devices or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    let xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    let yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      xTo(deltaX);
      yTo(deltaY);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, strength]);
}
