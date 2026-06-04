'use client';

import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import gsap from 'gsap';

/* ═══════════════════════════════════════════════════════════════
 *  SwingingCardWrapper — Premium 3D Lanyard Physics
 *  ─────────────────────────────────────────────────────────────
 *  ▸ Pivot at "50% -100px" — swings from an invisible clip above
 *  ▸ rotationX / rotationY for 3D tilt tracking
 *  ▸ rotationZ for natural lateral lanyard sway
 *  ▸ Dynamic shadow that follows tilt direction
 *  ▸ Subtle scale-up on hover for depth illusion
 *  ▸ Elastic pendulum release with multi-swing damping
 *  ▸ Tap-to-bounce on mobile (no sustained tracking)
 *  ▸ requestAnimationFrame-driven for 60fps smoothness
 * ═══════════════════════════════════════════════════════════════ */

interface SwingingCardWrapperProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees (default 18) */
  maxTilt?: number;
  /** Maximum Z-rotation / lateral sway in degrees (default 6) */
  maxSway?: number;
  /** Perspective depth in px (default 1200) */
  perspective?: number;
}

export default function SwingingCardWrapper({
  children,
  className = '',
  maxTilt = 10,
  maxSway = 3,
  perspective = 1200,
}: SwingingCardWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ rx: 0, ry: 0, rz: 0 });
  const currentRef = useRef({ rx: 0, ry: 0, rz: 0 });
  const isHovering = useRef(false);

  /* ── Stamp permanent 3D properties ── */
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.set(cardRef.current, {
      transformPerspective: perspective,
      transformOrigin: '50% -100px',
      transformStyle: 'preserve-3d',
    });
  }, [perspective]);

  /* ── rAF-driven smooth interpolation for buttery tracking ── */
  const lerp = useCallback((current: number, target: number, factor: number) => {
    return current + (target - current) * factor;
  }, []);

  const animate = useCallback(() => {
    if (!cardRef.current || !isHovering.current) return;

    const c = currentRef.current;
    const t = targetRef.current;
    const smoothing = 0.06; // Lower = silkier trail

    c.rx = lerp(c.rx, t.rx, smoothing);
    c.ry = lerp(c.ry, t.ry, smoothing);
    c.rz = lerp(c.rz, t.rz, smoothing);

    cardRef.current.style.transform =
      `rotateX(${c.rx.toFixed(3)}deg) rotateY(${c.ry.toFixed(3)}deg) rotateZ(${c.rz.toFixed(3)}deg) scale3d(1.015, 1.015, 1.015)`;

    // Dynamic shadow — shifts opposite to tilt
    if (shadowRef.current) {
      const sx = -c.ry * 0.8;
      const sy = c.rx * 0.6 + 12;
      const blur = 28 + Math.abs(c.ry) * 0.8;
      shadowRef.current.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`;
      shadowRef.current.style.filter = `blur(${blur.toFixed(0)}px)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [lerp]);

  /* ── Tilt calculation from pointer position ── */
  const calcTilt = useCallback(
    (clientX: number, clientY: number) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const nx = Math.max(-1, Math.min(1, (clientX - cx) / (rect.width / 2)));
      const ny = Math.max(-1, Math.min(1, (clientY - cy) / (rect.height / 2)));

      targetRef.current = {
        ry: nx * maxTilt,
        rx: -ny * maxTilt,
        rz: nx * maxSway,
      };
    },
    [maxTilt, maxSway],
  );

  /* ── Mouse enter: start the rAF loop + scale up ── */
  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  /* ── Mouse move: update target (rAF loop handles the rest) ── */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      calcTilt(e.clientX, e.clientY);
      if (!isHovering.current) {
        isHovering.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [calcTilt, animate],
  );

  /* ── Mouse leave: elegant multi-swing pendulum release ── */
  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    cancelAnimationFrame(rafRef.current);

    if (!cardRef.current) return;
    const c = currentRef.current;

    // Create a pendulum swing-back timeline
    const tl = gsap.timeline({ overwrite: true });
    // Overshoot to the opposite side
    tl.to(cardRef.current, {
      rotationX: -c.rx * 0.35,
      rotationY: -c.ry * 0.35,
      rotationZ: -c.rz * 0.3,
      scale: 1,
      duration: 0.45,
      ease: 'power2.out',
    });
    // Swing back
    tl.to(cardRef.current, {
      rotationX: c.rx * 0.12,
      rotationY: c.ry * 0.12,
      rotationZ: c.rz * 0.08,
      duration: 0.4,
      ease: 'sine.inOut',
    });
    // Settle to rest
    tl.to(cardRef.current, {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        currentRef.current = { rx: 0, ry: 0, rz: 0 };
        targetRef.current = { rx: 0, ry: 0, rz: 0 };
      },
    });

    // Shadow returns to rest
    if (shadowRef.current) {
      gsap.to(shadowRef.current, {
        x: 0,
        y: 12,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
      });
    }
  }, []);

  /* ── Touch: tap tilts toward touch point then elastic spring back (mobile only) ── */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      if (!touch || !cardRef.current) return;
      calcTilt(touch.clientX, touch.clientY);

      const t = targetRef.current;
      gsap.to(cardRef.current, {
        rotationY: t.ry,
        rotationX: t.rx,
        rotationZ: t.rz,
        scale: 1.015,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: true,
      });
    },
    [calcTilt],
  );

  /* ── Touch move: sustained tilt tracking ── */
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      if (!touch || !cardRef.current) return;
      calcTilt(touch.clientX, touch.clientY);

      const t = targetRef.current;
      gsap.to(cardRef.current, {
        rotationX: t.rx * 0.3,
        rotationY: t.ry * 0.3,
        rotationZ: t.rz * 0.2,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    },
    [calcTilt],
  );

  /* ── Touch end: spring release ── */
  const handleTouchEnd = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 1,
      duration: 1.2,
      ease: 'elastic.out(1, 0.4)',
      overwrite: true,
    });
  }, []);

  /* ── Cleanup rAF on unmount ── */
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: 'grab' }}
    >
      {/* Dynamic shadow beneath the card */}
      <div
        ref={shadowRef}
        className="absolute -z-10 pointer-events-none"
        style={{
          left: '15%',
          right: '15%',
          bottom: '-8px',
          height: '40px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(42,37,34,0.13) 0%, transparent 70%)',
          filter: 'blur(28px)',
          transform: 'translateY(12px)',
          transition: 'opacity 0.3s ease',
        }}
      />
      <div ref={cardRef}>
        {children}
      </div>
    </div>
  );
}
