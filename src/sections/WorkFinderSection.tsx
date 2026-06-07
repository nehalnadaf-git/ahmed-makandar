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
    name: '400 MW SCADA O&M',
    link: 'https://www.linkedin.com/in/ahmed-rehan-makandar-343106291/',
  },
  {
    name: 'SAP MM Operations',
    link: 'https://www.linkedin.com/in/ahmed-rehan-makandar-343106291/',
  },
  {
    name: '100 MW Anantapur Plant',
    link: 'https://www.linkedin.com/in/ahmed-rehan-makandar-343106291/',
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

function renderTelemetryGraphic(index: number, id: string) {
  if (index === 0) {
    return (
      <g>
        {/* Waveforms */}
        <path
          d="M 20 90 Q 60 50, 100 110 T 180 80 T 220 100"
          fill="none"
          stroke="#D97706"
          strokeWidth="2"
          strokeOpacity="0.95"
        />
        <path
          d="M 20 100 Q 60 70, 100 120 T 180 95 T 220 110"
          fill="none"
          stroke="#10B981"
          strokeWidth="1.2"
          strokeOpacity="0.65"
        />
        
        {/* Glowing peak node */}
        <circle cx="140" cy="95" r="4" fill="#D97706" />
        <circle cx="140" cy="95" r="8" fill="none" stroke="#D97706" strokeWidth="1.5" strokeOpacity="0.5" />
        
        {/* Analog gauge on the left */}
        <circle cx="50" cy="115" r="18" fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
        <circle cx="50" cy="115" r="18" fill="none" stroke="#D97706" strokeWidth="3.5" strokeDasharray="80 120" transform="rotate(-90 50 115)" />
        <text x="50" y="119" fontSize="9.5" fontWeight="900" fontFamily="monospace" fill="#2A2522" textAnchor="middle">98%</text>
        <text x="50" y="130" fontSize="5.5" fontWeight="700" fontFamily="monospace" fill="#5C5248" textAnchor="middle">CAPACITY</text>

        {/* Digital numbers on the right */}
        <g transform="translate(152, 115)" fontFamily="monospace">
          <text x="0" y="0" fontSize="16.5" fontWeight="900" fill="#D97706">400.0</text>
          <text x="50" y="0" fontSize="8.5" fontWeight="800" fill="#5C5248">MW</text>
          <text x="0" y="10" fontSize="7" fontWeight="700" fill="#10B981">GRID: ACTIVE</text>
        </g>
      </g>
    );
  }

  if (index === 1) {
    return (
      <g>
        {/* Nodes and Flow Path */}
        <defs>
          <marker id={`arrow-${id}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 2 L 8 5 L 0 8 z" fill="#D97706" />
          </marker>
        </defs>

        {/* Stock Optimization / Supply Flow Lines */}
        <path d="M 45 95 L 105 75" fill="none" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 3" markerEnd={`url(#arrow-${id})`} />
        <path d="M 105 75 L 165 95" fill="none" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 3" markerEnd={`url(#arrow-${id})`} />
        <path d="M 45 95 Q 105 125, 165 95" fill="none" stroke="#D97706" strokeWidth="1.2" strokeOpacity="0.4" />

        {/* Node 1: Supply */}
        <circle cx="45" cy="95" r="14" fill="#FFFFFF" fillOpacity="0.85" stroke="#D97706" strokeWidth="1.5" />
        <path d="M 40 91 H 50 V 99 H 40 Z M 40 95 H 50 M 45 91 V 99" fill="none" stroke="#D97706" strokeWidth="1.2" />
        <text x="45" y="121" fontSize="6.5" fontWeight="700" fontFamily="monospace" fill="#5C5248" textAnchor="middle">STOCKS</text>

        {/* Node 2: Database / SAP System (Center High-point) */}
        <circle cx="105" cy="75" r="16" fill="#FFFFFF" fillOpacity="0.85" stroke="#D97706" strokeWidth="2" />
        <ellipse cx="105" cy="69" rx="7" ry="2.5" fill="none" stroke="#D97706" strokeWidth="1.2" />
        <path d="M 98 69 V 79 Q 105 82, 112 79 V 69 M 98 74 Q 105 77, 112 74" fill="none" stroke="#D97706" strokeWidth="1.2" />
        <text x="105" y="52" fontSize="6.5" fontFamily="monospace" fill="#D97706" textAnchor="middle" fontWeight="800">SAP MM</text>

        {/* Node 3: Procurement / Delivery */}
        <circle cx="165" cy="95" r="14" fill="#FFFFFF" fillOpacity="0.85" stroke="#D97706" strokeWidth="1.5" />
        <path d="M 158 96 H 168 L 171 99 H 158 Z M 158 92 H 165 V 96 H 158 Z" fill="none" stroke="#D97706" strokeWidth="1.2" />
        <circle cx="160.5" cy="100.5" r="1.5" fill="#D97706" />
        <circle cx="167.5" cy="100.5" r="1.5" fill="#D97706" />
        <text x="165" y="121" fontSize="6.5" fontWeight="700" fontFamily="monospace" fill="#5C5248" textAnchor="middle">LOGISTICS</text>

        {/* System Bar chart at the bottom */}
        <g transform="translate(70, 132)">
          <rect x="0" y="0" width="100" height="6" rx="3" fill="#E5E7EB" />
          <rect x="0" y="0" width="84" height="6" rx="3" fill="#D97706" />
          <text x="50" y="-4" fontSize="6" fontWeight="800" fontFamily="monospace" fill="#2A2522" textAnchor="middle">EFFICIENCY: 84%</text>
        </g>
      </g>
    );
  }

  if (index === 2) {
    return (
      <g>
        {/* Sun in top left */}
        <circle cx="45" cy="65" r="10" fill="none" stroke="#D97706" strokeWidth="1.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="45" y1="65" x2="45" y2="65"
            stroke="#D97706" strokeWidth="1.2" strokeLinecap="round"
            transform={`rotate(${angle} 45 65) translate(0 -16)`}
          />
        ))}

        {/* Solar Panel Array grids */}
        <g transform="translate(30, 95)" stroke="#D97706" strokeWidth="1.2" fill="#FFFFFF" fillOpacity="0.5">
          <polygon points="5,25 25,25 20,5 0,5" strokeOpacity="0.6" />
          <polygon points="28,25 48,25 43,5 23,5" />
          <polygon points="51,25 71,25 66,5 46,5" />
          <line x1="25.5" y1="15" x2="45.5" y2="15" strokeOpacity="0.6" />
          <line x1="33" y1="5" x2="38" y2="25" strokeOpacity="0.6" />
        </g>

        {/* Electrical Tower / Grid Station on the right */}
        <g transform="translate(150, 75)" stroke="#D97706" strokeWidth="1.2" fill="none">
          <path d="M 15 45 L 25 5 L 35 45 M 10 32 L 40 32 M 5 15 L 45 15 M 15 15 L 25 32 M 35 15 L 25 32" />
          <line x1="5" y1="45" x2="45" y2="45" strokeOpacity="0.5" />
          <text x="25" y="-6" fontSize="6.5" fontWeight="800" fontFamily="monospace" fill="#D97706" textAnchor="middle">ANANTAPUR AP</text>
        </g>

        {/* Power flow line */}
        <path d="M 101 110 H 155" fill="none" stroke="#D97706" strokeWidth="1.5" strokeDasharray="4 2" />

        {/* Power generation display */}
        <g transform="translate(32, 138)" fontFamily="monospace" fontSize="8" fontWeight="800">
          <text x="0" y="0" fill="#2A2522">OUTPUT: 100 MW</text>
          <text x="110" y="0" fill="#10B981" textAnchor="start">GRID FEED: OK</text>
        </g>
      </g>
    );
  }

  return null;
}

function TelemetryCard({
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

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      <defs>
        <filter id={`card-shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#2A2522" floodOpacity="0.08" />
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#2A2522" floodOpacity="0.04" />
        </filter>

        <linearGradient id={`card-bg-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.80" />
          <stop offset="50%" stopColor="#FDFBF7" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#EADEC9" stopOpacity="0.55" />
        </linearGradient>

        <linearGradient id={`screen-bg-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
        </linearGradient>
        
        <pattern id={`grid-pat-${id}`} width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#D97706" strokeWidth="0.5" strokeOpacity="0.05" />
        </pattern>
      </defs>

      {/* Main card body and border with glass shadow */}
      <rect x="4" y="4" width="232" height="302" rx="14" fill={`url(#card-bg-${id})`} stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" filter={`url(#card-shadow-${id})`} />
      <rect x="3.5" y="3.5" width="233" height="303" rx="14.5" fill="none" stroke="#D97706" strokeWidth="0.8" strokeOpacity="0.1" />
      
      {/* Card grid overlay */}
      <rect x="5" y="5" width="230" height="300" rx="13" fill={`url(#grid-pat-${id})`} pointerEvents="none" />
      
      {/* ── HEADER ── */}
      <g transform="translate(14, 16)">
        <path d="M 0,4 H 10 M 5,0 V 8" stroke="#5C5248" strokeWidth="1.2" strokeOpacity="0.8" />
        <circle cx="5" cy="4" r="3.5" fill="none" stroke="#5C5248" strokeWidth="1" strokeOpacity="0.8" />
        
        <text x="16" y="8" fontSize="7.5" fontWeight="800" fontFamily="monospace" fill="#5C5248" letterSpacing="1" opacity="0.85">
          SYSTEM TELEMETRY
        </text>
        
        <circle cx="198" cy="4" r="3" fill="#10B981" />
        <circle cx="198" cy="4" r="5" fill="none" stroke="#10B981" strokeWidth="1.2" opacity="0.6">
          <animate attributeName="r" values="3;7;3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
        
        <text x="190" y="8" fontSize="6.5" fontWeight="700" fontFamily="monospace" fill="#10B981" textAnchor="end" letterSpacing="0.5">
          ONLINE
        </text>
      </g>
      
      <line x1="12" y1="32" x2="228" y2="32" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="12" y1="32.5" x2="228" y2="32.5" stroke="#D97706" strokeWidth="0.5" strokeOpacity="0.1" />

      {/* ── GRAPHIC TELEMETRY SCREEN ── */}
      <rect x="14" y="40" width="212" height="115" rx="8" fill={`url(#screen-bg-${id})`} stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.6" />
      
      <rect x="15" y="41" width="210" height="113" rx="7" fill={`url(#grid-pat-${id})`} fillOpacity="0.6" pointerEvents="none" />
      
      {renderTelemetryGraphic(index, id)}

      {/* ── CARD RECORD INFO ── */}
      <g transform="translate(14, 165)">
        <rect x="0" y="0" width="212" height="130" rx="8" fill="#FFFFFF" fillOpacity="0.65" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.8" />
        
        <text x="12" y="18" fontSize="7.5" fontWeight="700" fontFamily="monospace" fill="#5C5248" letterSpacing="0.8">
          ASSET RECORD // AR-0{index + 1}
        </text>
        
        <line x1="12" y1="24" x2="200" y2="24" stroke="#D97706" strokeWidth="0.8" strokeOpacity="0.15" />

        <g transform="translate(12, 42)">
          {splitLabel(name).map((line, li, arr) => (
            <text
              key={li}
              x="0"
              y={li * 18}
              fontSize="14.5"
              fontWeight="800"
              fontFamily="system-ui, -apple-system, sans-serif"
              fill="#2A2522"
            >
              {line}
            </text>
          ))}
        </g>

        <g transform="translate(12, 86)" fontSize="7" fontWeight="600" fontFamily="monospace" fill="#5C5248" letterSpacing="0.2">
          {index === 0 && (
            <>
              <text x="0" y="0">TYPE: O&M MANAGEMENT / MONITORING</text>
              <text x="0" y="9">INTEGRATION: REAL-TIME SCADA</text>
              <text x="0" y="18">CAPACITY: 400 MW UTILITY GRID</text>
            </>
          )}
          {index === 1 && (
            <>
              <text x="0" y="0">TYPE: MATERIALS MANAGEMENT / ERP</text>
              <text x="0" y="9">INTEGRATION: SAP MM MODULE</text>
              <text x="0" y="18">CORES: INVENTORY & STOCK OPTIMIZATION</text>
            </>
          )}
          {index === 2 && (
            <>
              <text x="0" y="0">TYPE: UTILITY-SCALE SOLAR PV</text>
              <text x="0" y="9">INTEGRATION: GRID TRANSMISSION</text>
              <text x="0" y="18">LOCATION: ANANTAPUR, AP (INDIA)</text>
            </>
          )}
        </g>

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
            AHMED&apos;S
          </h2>
          <span
            className="text-2xl md:text-3xl lg:text-4xl -mt-1 block"
            style={{ color: '#D97706', fontFamily: "'Caveat', cursive" }}
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
                <TelemetryCard
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
