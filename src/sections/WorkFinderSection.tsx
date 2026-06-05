'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════
 *  PROJECT DATA — add / remove entries freely. Each gets a plastic bag.
 *  The layout auto-adjusts for ANY number of projects (1, 2, 3, 4, 5+).
 * ═══════════════════════════════════════════════════════════════════ */

const projects = [
  {
    name: 'Rosuvastatin UV/HPLC',
    link: 'https://www.linkedin.com/in/arham-hussain-936054259',
  },
  {
    name: 'Levosulpiride RP-HPLC',
    link: 'https://www.linkedin.com/in/arham-hussain-936054259',
  },
  {
    name: 'Herbal Drug Study',
    link: '',
  },
];

/* ═══════════════════════════════════════════════════════════════════
 *  DYNAMIC FAN LAYOUT
 *  Computes position, rotation, scale, and z-index for N bags in a
 *  tight overlapping curved arc.  Center bag is always largest/front.
 *  As N grows, individual bags shrink proportionally so the total
 *  composition stays within bounds.
 *
 *  BAG_W / BAG_H are the base (rendered) size for 1–3 projects.
 *  For 4+ projects, each bag shrinks via a dynamic scale factor
 *  so everything fits without overflow.
 * ═══════════════════════════════════════════════════════════════════ */

const BAG_W = 240; // base bag width  in px (the SVG viewBox is always 240×310)
const BAG_H = 310; // base bag height in px

function computeLayout(n: number) {
  if (n === 0) return { items: [], containerW: 0, containerH: 0, bagW: 0, bagH: 0 };

  // Dynamic sizing: for n<=3 use full size, for n>3 shrink proportionally
  const sizeFactor = n <= 3 ? 1 : Math.max(0.55, 1 - (n - 3) * 0.1);
  const bagW = Math.round(BAG_W * sizeFactor);
  const bagH = Math.round(BAG_H * sizeFactor);

  if (n === 1) {
    return {
      items: [{ x: 0, y: 0, rotate: 0, scale: 1, z: 2 }],
      containerW: bagW + 60,
      containerH: bagH + 40,
      bagW,
      bagH,
    };
  }

  // Overlap: each bag overlaps the previous by ~55-60% of its width
  const overlap = 0.58;
  const stepX = Math.round(bagW * (1 - overlap));

  // Rotation: spread evenly, capped
  const maxRot = Math.min(12 + n * 3, 38);

  // Scale drop from center to edge
  const scaleDrop = Math.min(0.06 + n * 0.008, 0.14);

  const half = (n - 1) / 2;

  const items = Array.from({ length: n }, (_, i) => {
    const t    = i - half;             // -half … 0 … +half
    const absT = half > 0 ? Math.abs(t) / half : 0;  // 0 (center) to 1 (edge)
    return {
      x:      Math.round(t * stepX),
      y:      Math.round(-absT * 24),  // edges dip down (negative = lower)
      rotate: Math.round(t * (maxRot / Math.max(half, 1)) * 10) / 10,
      scale:  Math.round((1 - absT * scaleDrop) * 1000) / 1000,
      z:      Math.round((1 - absT) * n) + 1,
    };
  });

  // Compute total width the fan spans
  const minX = items[0].x;
  const maxX = items[items.length - 1].x;
  const containerW = (maxX - minX) + bagW + 80; // extra breathing room
  const containerH = bagH + 50;

  return { items, containerW, containerH, bagW, bagH };
}

/* ═══════════════════════════════════════════════════════════════════
 *  TABLETS / CAPSULES DRAWING HELPER
 * ═══════════════════════════════════════════════════════════════════ */

function renderTablets(index: number, id: string) {
  if (index === 0) {
    // Rosuvastatin: pink round and oval tablets
    const pinkPills = [
      { type: 'round', cx: 65, cy: 288, r: 13, deg: 12 },
      { type: 'round', cx: 92, cy: 292, r: 13, deg: -45 },
      { type: 'oval', cx: 145, cy: 291, rx: 18, ry: 10, deg: 8 },
      { type: 'round', cx: 182, cy: 286, r: 12, deg: 70 },
      { type: 'round', cx: 118, cy: 282, r: 13, deg: 35 },
      { type: 'round', cx: 162, cy: 285, r: 12, deg: -20 },
    ];
    return (
      <g>
        {pinkPills.map((pill, i) => {
          if (pill.type === 'round') {
            return (
              <g key={i} transform={`translate(${pill.cx}, ${pill.cy}) rotate(${pill.deg})`} filter={`url(#tablet-shadow-${id})`}>
                <circle cx="0" cy="0" r={pill.r} fill={`url(#pink-pill-grad-${id})`} />
                <circle cx="0.5" cy="0.5" r={pill.r! - 2} fill={`url(#pink-pill-face-${id})`} />
                <line x1={-pill.r! + 3} y1="0" x2={pill.r! - 3} y2="0" stroke="#b32d4a" strokeWidth="0.8" opacity="0.6" />
                <line x1={-pill.r! + 3} y1="0.6" x2={pill.r! - 3} y2="0.6" stroke="#ffffff" strokeWidth="0.5" opacity="0.8" />
              </g>
            );
          } else {
            return (
              <g key={i} transform={`translate(${pill.cx}, ${pill.cy}) rotate(${pill.deg})`} filter={`url(#tablet-shadow-${id})`}>
                <ellipse cx="0" cy="0" rx={pill.rx} ry={pill.ry} fill={`url(#pink-pill-grad-${id})`} />
                <ellipse cx="0.5" cy="0.5" rx={pill.rx! - 2.5} ry={pill.ry! - 1.8} fill={`url(#pink-pill-face-${id})`} />
                <line x1="0" y1={-pill.ry! + 2} x2="0" y2={pill.ry! - 2} stroke="#b32d4a" strokeWidth="0.8" opacity="0.6" />
                <line x1="0.6" y1={-pill.ry! + 2} x2="0.6" y2={pill.ry! - 2} stroke="#ffffff" strokeWidth="0.5" opacity="0.8" />
              </g>
            );
          }
        })}
      </g>
    );
  }

  if (index === 1) {
    // Levosulpiride: white round tablets
    const whitePills = [
      { cx: 60, cy: 288, r: 13, deg: -10 },
      { cx: 88, cy: 291, r: 13, deg: 40 },
      { cx: 115, cy: 284, r: 14, deg: -25 },
      { cx: 145, cy: 290, r: 13, deg: 15 },
      { cx: 178, cy: 287, r: 13, deg: -60 },
      { cx: 130, cy: 278, r: 13, deg: 5 },
    ];
    return (
      <g>
        {whitePills.map((pill, i) => (
          <g key={i} transform={`translate(${pill.cx}, ${pill.cy}) rotate(${pill.deg})`} filter={`url(#tablet-shadow-${id})`}>
            <circle cx="0" cy="0" r={pill.r} fill={`url(#white-pill-grad-${id})`} />
            <circle cx="0.5" cy="0.5" r={pill.r - 2} fill={`url(#white-pill-face-${id})`} />
            <line x1={-pill.r + 3} y1="0" x2={pill.r - 3} y2="0" stroke="#71717a" strokeWidth="0.8" opacity="0.5" />
            <line x1={-pill.r + 3} y1="0.6" x2={pill.r - 3} y2="0.6" stroke="#ffffff" strokeWidth="0.6" opacity="0.9" />
          </g>
        ))}
      </g>
    );
  }

  if (index === 2) {
    // Herbal Drug Study: green/yellow capsules
    const capsules = [
      { cx: 70, cy: 288, deg: -15 },
      { cx: 105, cy: 292, deg: 8 },
      { cx: 142, cy: 289, deg: -30 },
      { cx: 176, cy: 285, deg: 25 },
      { cx: 122, cy: 280, deg: 55 },
    ];
    return (
      <g>
        {capsules.map((cap, i) => (
          <g key={i} transform={`translate(${cap.cx}, ${cap.cy}) rotate(${cap.deg})`} filter={`url(#tablet-shadow-${id})`}>
            <path d="M 0,-7 L 10,-7 A 7,7 0 0,1 17,0 A 7,7 0 0,1 10,7 L 0,7 Z" fill={`url(#cap-yellow-${id})`} />
            <path d="M 1,-7 L -10,-7 A 7,7 0 0,0 -17,0 A 7,7 0 0,0 -10,7 L 1,7 Z" fill={`url(#cap-green-${id})`} />
            <line x1="1" y1="-7" x2="1" y2="7" stroke="#081c15" strokeWidth="0.8" opacity="0.4" />
            <path d="M -11,-4 L 11,-4" fill="none" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
          </g>
        ))}
      </g>
    );
  }

  return null;
}

/* ═══════════════════════════════════════════════════════════════════
 *  REALISTIC PLASTIC ZIP-LOCK BAG — pure SVG
 *  The viewBox is ALWAYS 240×310 (design-locked).
 *  It scales to whatever pixel size the container gives it.
 * ═══════════════════════════════════════════════════════════════════ */

function PlasticBag({
  id,
  index,
  name,
}: {
  id: string;
  index: number;
  name: string;
}) {
  const W = 240;
  const H = 310;

  const bagPath = `
    M 10 ${H - 8}
    Q 10 ${H} 18 ${H}
    L ${W - 18} ${H}
    Q ${W - 10} ${H} ${W - 10} ${H - 8}
    L ${W - 5} 46
    Q ${W - 5} 41 ${W - 10} 41
    L 10 41
    Q 5 41 5 46
    Z
  `;

  const zipY = 41;

  // Sticker rotation per bag (organic look)
  const rotationSeed = (name.charCodeAt(0) + index) % 3 - 1;
  const stickerAngle = -1.2 + rotationSeed * 0.7;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      <defs>
        {/* ── clear plastic body ── */}
        <linearGradient id={`bg-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.22" />
          <stop offset="50%"  stopColor="white" stopOpacity="0.10" />
          <stop offset="100%" stopColor="white" stopOpacity="0.26" />
        </linearGradient>

        {/* ── frosted gloss overlay ── */}
        <linearGradient id={`gloss-${id}`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.65" />
          <stop offset="40%"  stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0.02" />
        </linearGradient>

        {/* ── specular streak ── */}
        <linearGradient id={`spec-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.0"  />
          <stop offset="45%"  stopColor="white" stopOpacity="0.45" />
          <stop offset="55%"  stopColor="white" stopOpacity="0.45" />
          <stop offset="100%" stopColor="white" stopOpacity="0.0"  />
        </linearGradient>

        {/* ── bottom gusset shadow ── */}
        <linearGradient id={`gusset-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#2A2522" stopOpacity="0.0"  />
          <stop offset="100%" stopColor="#2A2522" stopOpacity="0.15" />
        </linearGradient>

        {/* ── zip seal gradient ── */}
        <linearGradient id={`zip-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#F9FAFB" stopOpacity="0.95" />
          <stop offset="40%"  stopColor="#E5E7EB" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#D1D5DB" stopOpacity="0.95" />
        </linearGradient>

        <clipPath id={`clip-${id}`}>
          <path d={bagPath} />
        </clipPath>

        {/* ── bag drop shadow ── */}
        <filter id={`shadow-${id}`} x="-15%" y="-8%" width="130%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#2A2522" floodOpacity="0.14" />
          <feDropShadow dx="0" dy="4"  stdDeviation="5"  floodColor="#2A2522" floodOpacity="0.07" />
        </filter>

        {/* ── sticker adhesive shadow ── */}
        <filter id={`sticker-shadow-${id}`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#2A2522" floodOpacity="0.14" />
          <feDropShadow dx="0" dy="0.8" stdDeviation="1" floodColor="#2A2522" floodOpacity="0.08" />
        </filter>

        {/* ── tablet drop shadow ── */}
        <filter id={`tablet-shadow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="1" dy="3.5" stdDeviation="2.5" floodColor="#1F1A17" floodOpacity="0.22" />
        </filter>

        {/* ── tablet gradients ── */}
        <radialGradient id={`pink-pill-grad-${id}`} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffccd5" />
          <stop offset="70%" stopColor="#ff758f" />
          <stop offset="100%" stopColor="#c9184a" />
        </radialGradient>
        <radialGradient id={`pink-pill-face-${id}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffccd5" />
          <stop offset="80%" stopColor="#ff8da1" />
          <stop offset="100%" stopColor="#ff4d6d" />
        </radialGradient>

        <radialGradient id={`white-pill-grad-${id}`} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="75%" stopColor="#e4e4e7" />
          <stop offset="100%" stopColor="#a1a1aa" />
        </radialGradient>
        <radialGradient id={`white-pill-face-${id}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="80%" stopColor="#f4f4f5" />
          <stop offset="100%" stopColor="#d4d4d8" />
        </radialGradient>

        <linearGradient id={`cap-green-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#40916c" />
          <stop offset="40%" stopColor="#1b4332" />
          <stop offset="100%" stopColor="#081c15" />
        </linearGradient>
        <linearGradient id={`cap-yellow-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe3a8" />
          <stop offset="45%" stopColor="#ffb703" />
          <stop offset="100%" stopColor="#fb8500" />
        </linearGradient>
      </defs>

      {/* ── bag shadow ── */}
      <path d={bagPath} filter={`url(#shadow-${id})`} fill="transparent" />

      {/* ── transparent body ── */}
      <path d={bagPath} fill={`url(#bg-${id})`} />

      {/* ── realistic pills/tablets inside the bag ── */}
      <g clipPath={`url(#clip-${id})`}>
        {renderTablets(index, id)}
      </g>

      {/* ── crinkle wrinkle lines ── */}
      <g clipPath={`url(#clip-${id})`} opacity="0.4">
        <path d={`M 42 ${zipY+24} Q 80 ${zipY+85} 55 ${H-50}`}
          fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d={`M 145 ${zipY+14} Q 180 ${zipY+110} 150 ${H-70}`}
          fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d={`M 95 ${zipY+36} Q 108 ${zipY+140} 100 ${H-35}`}
          fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
        {/* fold shadows */}
        <path d={`M 39 ${zipY+26} Q 77 ${zipY+87} 52 ${H-48}`}
          fill="none" stroke="rgba(42,37,34,0.06)" strokeWidth="1.8" strokeLinecap="round" />
        <path d={`M 142 ${zipY+16} Q 177 ${zipY+112} 147 ${H-68}`}
          fill="none" stroke="rgba(42,37,34,0.06)" strokeWidth="1.2" strokeLinecap="round" />
        {/* bottom crinkle */}
        <path d={`M 18 ${H-24} Q ${W/2} ${H-42} ${W-18} ${H-26}`}
          fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* ── frosted gloss ── */}
      <path d={bagPath} fill={`url(#gloss-${id})`} clipPath={`url(#clip-${id})`} />

      {/* ── specular streak ── */}
      <rect x="68" y={zipY+6} width="30" height={H-zipY-42} rx="15"
        fill={`url(#spec-${id})`} clipPath={`url(#clip-${id})`}
        transform="rotate(-8 120 160)" opacity="0.6" />

      {/* ── bottom gusset ── */}
      <rect x="5" y={H-55} width={W-10} height="55"
        fill={`url(#gusset-${id})`} clipPath={`url(#clip-${id})`} />

      {/* ── bag outline ── */}
      <path d={bagPath} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" />

      {/* ── zip-lock strip ── */}
      <rect x="5" y={zipY-17} width={W-10} height="17" rx="3.5"
        fill={`url(#zip-${id})`} stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
      {[0, 4.5, 9].map((dy) => (
        <rect key={dy} x="8" y={zipY-15+dy}
          width={W-16} height="3" rx="1.5"
          fill="white" opacity={dy === 4.5 ? 0.95 : 0.6} />
      ))}

      {/* ═══ REALISTIC WHITE STICKER ═══ */}
      <g transform={`rotate(${stickerAngle} 120 155)`}>
        {/* Sticker body */}
        <rect x="28" y="100" width="184" height="115" rx="5"
          fill="#FFFFFF" stroke="#E4E4E7" strokeWidth="0.9"
          filter={`url(#sticker-shadow-${id})`} />

        {/* Divider lines */}
        <line x1="28" y1="117" x2="212" y2="117" stroke="#E4E4E7" strokeWidth="0.8" />
        <line x1="28" y1="180" x2="212" y2="180" stroke="#F4F4F5" strokeWidth="0.8" />

        {/* Header: FORMULATION RECORD */}
        <text x="36" y="112" fontSize="7.5" fontWeight="700"
          fontFamily="system-ui, sans-serif" fill="#0E8B7D" letterSpacing="0.7">
          FORMULATION RECORD
        </text>

        {/* Batch code */}
        <text x="204" y="112" textAnchor="end" fontSize="7.5" fontWeight="600"
          fontFamily="monospace" fill="#71717A">
          {`BATCH AR-0${index + 1}`}
        </text>

        {/* Project Title */}
        <text x="120" y="148" textAnchor="middle" fontSize="14" fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif" fill="#2A2522">
          {splitLabel(name).map((line, li, arr) => (
            <tspan key={li} x="120" dy={li === 0 ? -(arr.length - 1) * 8 : 17}>
              {line}
            </tspan>
          ))}
        </text>

        {/* Barcode */}
        <g opacity="0.75" transform="translate(36, 187)">
          {[0, 3.5, 7, 11.5, 14.5, 18, 21, 25, 28, 32, 35.5, 39, 42.5, 46].map((bx, bi) => (
            <rect key={bi} x={bx} y="0" width={bi % 3 === 0 ? 2.2 : 1} height="18" fill="#2A2522" />
          ))}
        </g>

        {/* LOT */}
        <text x="204" y="200" textAnchor="end" fontSize="7.5" fontWeight="500"
          fontFamily="monospace" fill="#71717A" letterSpacing="0.3">
          LOT 2026.06
        </text>
      </g>
    </svg>
  );
}

/** Break a project name into ≤2 lines of ≤18 chars each */
function splitLabel(name: string): string[] {
  if (name.length <= 18) return [name];
  const words = name.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + (cur ? ' ' : '') + w).length <= 18) {
      cur += (cur ? ' ' : '') + w;
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}

/* ═══════════════════════════════════════════════════════════════════
 *  MAIN SECTION COMPONENT
 * ═══════════════════════════════════════════════════════════════════ */

export default function WorkFinderSection() {
  const sectionRef     = useRef<HTMLDivElement>(null);
  const wrapperRef     = useRef<HTMLDivElement>(null);
  const compositionRef = useRef<HTMLDivElement>(null);

  const { items: layouts, containerW, containerH, bagW, bagH } =
    computeLayout(projects.length);

  /* ── responsive scaling: scales the composition down on smaller screens ── */
  useEffect(() => {
    const wr = wrapperRef.current;
    const co = compositionRef.current;
    if (!wr || !co) return;

    const update = () => {
      const s = Math.min(1, wr.clientWidth / containerW);
      co.style.transform = `translateX(-50%) scale(${s})`;
      wr.style.height = `${containerH * s}px`;
    };

    const ro = new ResizeObserver(update);
    ro.observe(wr);
    update();
    return () => ro.disconnect();
  }, [containerW, containerH]);

  /* ── scroll entrance animation ── */
  useEffect(() => {
    if (!sectionRef.current) return;

    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const ctx = gsap.context(() => {
      /* ── Title entrance: smooth fade + slide ── */
      gsap.from('.wf-title', {
        opacity: 0,
        y: 40,
        duration: isMobile ? 0.7 : 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: isMobile ? 'top 92%' : 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      if (isMobile) {
        /* ── Mobile: clean, snappy staggered entrance ── */
        gsap.from('.wf-bag', {
          opacity: 0,
          y: 80,
          scale: 0.6,
          duration: 0.7,
          stagger: { from: 'center', amount: 0.35 },
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      } else {
        /* ── Desktop: scrub-linked scroll animation (buttery smooth) ── */
        const bags = gsap.utils.toArray<HTMLElement>('.wf-bag');
        const centerIdx = Math.floor(bags.length / 2);

        bags.forEach((bag, i) => {
          const distFromCenter = Math.abs(i - centerIdx);
          const delayOffset = distFromCenter * 0.08;

          gsap.fromTo(
            bag,
            {
              opacity: 0,
              y: 100 + distFromCenter * 20,
              scale: 0.4,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current!,
                start: `top ${82 - delayOffset * 100}%`,
                end: 'top 45%',
                scrub: 0.8,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-4" style={{ overflowX: 'clip' }}>

      {/* hover lift + mobile float */}
      <style>{`
        .wf-lift{transition:transform .32s cubic-bezier(.4,0,.2,1)}
        .wf-lift:hover{transform:translateY(-18px)}

        @keyframes wf-float {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-18px); }
          100% { transform: translateY(0px); }
        }

        @media (hover: none) and (pointer: coarse) {
          .wf-lift {
            animation: wf-float 2.8s ease-in-out infinite;
            transition: none;
          }
          .wf-lift:hover { transform: none; }
        }
      `}</style>

      <div className="max-w-[1100px] mx-auto">

        {/* Heading — matches theme: bold uppercase + script subtitle */}
        <div className="wf-title text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight" style={{ color: '#2A2522' }}>
            ARHAM&apos;S
          </h2>
          <span
            className="text-2xl md:text-3xl lg:text-4xl -mt-1 block"
            style={{ color: '#0E8B7D', fontFamily: "'Caveat', cursive" }}
          >
            projects
          </span>
        </div>

        {/* Fan composition wrapper */}
        <div
          ref={wrapperRef}
          className="relative mx-auto"
          style={{ width: '100%', overflow: 'visible' }}
        >
          <div
            ref={compositionRef}
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: `${containerW}px`,
              height: `${containerH}px`,
              transformOrigin: 'top center',
              transform: 'translateX(-50%)',
            }}
          >
            {projects.map((project, i) => {
              const l = layouts[i];
              const hasLink = !!project.link;
              const uid = `bag-${i}`;

              const bag = (
                <PlasticBag
                  id={uid}
                  index={i}
                  name={project.name}
                />
              );

              const wrappedBag = hasLink ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={project.name}
                  style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}
                >
                  {bag}
                </a>
              ) : (
                <div style={{ width: '100%', height: '100%' }}>{bag}</div>
              );

              return (
                <div
                  key={i}
                  className="wf-bag"
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${l.x}px - ${bagW / 2}px)`,
                    bottom: `calc(4% + ${l.y}px)`,
                    width: `${bagW}px`,
                    height: `${bagH}px`,
                    zIndex: l.z,
                    cursor: hasLink ? 'pointer' : 'default',
                    willChange: 'transform, opacity',
                  }}
                >
                  {/* hover lift layer — staggered float on mobile */}
                  <div className="wf-lift" style={{ width: '100%', height: '100%', animationDelay: `${i * 0.55}s` }}>
                    {/* rotation + scale layer */}
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        transform: `rotate(${l.rotate}deg) scale(${l.scale})`,
                        transformOrigin: 'bottom center',
                      }}
                    >
                      {wrappedBag}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
