'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // On touch/mobile devices, native scroll is already silky smooth.
    // Lenis smooth-scrolling fights the browser's touch inertia and
    // makes it feel sluggish — so we skip it entirely on mobile.
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      // Still refresh ScrollTrigger so GSAP scroll animations work correctly
      ScrollTrigger.refresh();
      return;
    }

    // Desktop: Lenis with a snappy but elegant feel
    const lenis = new Lenis({
      lerp: 0.10,      // slightly more responsive than before (was 0.075)
      duration: 1.2,   // tighter for a crisper glide (was 1.4)
    });

    lenisRef.current = lenis;
    (window as unknown as Record<string, unknown>).__lenis = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      (window as unknown as Record<string, unknown>).__lenis = undefined;
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return lenisRef;
}
