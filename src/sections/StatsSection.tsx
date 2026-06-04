'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────
 * Process cards data
 * ───────────────────────────────────────────────────────── */
const notes = [
  {
    title: 'Method Dev.\n& Research.',
    body: 'Developing **UV Spectrophotometry** and **HPLC** methods for pharmaceutical analysis. **ICH Q2(R1)** validation guidelines, **spectral analysis**, and **analytical instrument** operation for drug testing.',
    bg: '#D8F0E8',
    titleColor: '#4A7C6F',
    rotation: -2,
    animationClass: 'animate-note-float-1',
    image: '/assets/uv_spectro.webp',
  },
  {
    title: 'Lab Analysis\n& Validation.',
    body: '**Rosuvastatin** & **Levosulpiride** validation per **ICH guidelines**. **Linearity**, **precision**, **accuracy** & **robustness** testing using UV Spectrophotometry and **RP-HPLC** method development.',
    bg: '#D8EBF5',
    titleColor: '#5F7B8B',
    rotation: 1,
    animationClass: 'animate-note-float-2',
    image: '/assets/hplc_analysis.webp',
  },
  {
    title: 'Quality\nAssurance.',
    body: 'Observed **GMP** documentation and **QA procedures** at Shilpa Biologicals. **SOP** adherence, **regulatory compliance**, and **analytical instrument** operation in pharmaceutical manufacturing environment.',
    bg: '#E0F0E0',
    titleColor: '#5A8B6B',
    rotation: -1,
    animationClass: 'animate-note-float-3',
    image: '/assets/gmp_quality.webp',
  },
  {
    title: 'Drug Safety\n& Pharma.',
    body: '**Adverse Drug Reaction** monitoring and **patient safety** awareness. **Pharmacovigilance** principles, **regulatory reporting** pathways, and **clinical safety** data management in the pharmaceutical industry.',
    bg: '#E8F0D8',
    titleColor: '#6B8B5F',
    rotation: 2,
    animationClass: 'animate-note-float-4',
    image: '/assets/drug_safety_pharmavig.png',
  },
];

function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#2A2522' }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

/* ─────────────────────────────────────────────────────────
 * Unified Stats + Process Section
 * ───────────────────────────────────────────────────────── */
export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [cgpa, setCgpa] = useState(0);
  const [projects, setProjects] = useState(0);
  const [certifications, setCertifications] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const proxy = { cgpa: 0, projects: 0, certifications: 0 };

    const ctx = gsap.context(() => {
      // Card entrance — 3D perspective reveal
      gsap.set(sectionRef.current!, { transformPerspective: 1000 });
      gsap.from(sectionRef.current!, {
        opacity: 0,
        y: 80,
        scale: 0.94,
        rotationX: 6,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });

      // Animated counters — slightly longer for drama
      ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: 'top 70%',
        onEnter: () => {
          gsap.to(proxy, {
            cgpa: 3,
            projects: 2,
            certifications: 4,
            duration: 1.6,
            ease: 'power3.out',
            stagger: 0.25,
            snap: { cgpa: 1, projects: 1, certifications: 1 },
            onUpdate: () => {
              setCgpa(Math.round(proxy.cgpa));
              setProjects(Math.round(proxy.projects));
              setCertifications(Math.round(proxy.certifications));
            },
          });
        },
        once: true,
      });

      // Process cards — scattered entrance with individual rotation offsets
      const noteRotations = [-3, 2, -2, 4];
      notesRef.current.forEach((note, i) => {
        if (!note) return;
        gsap.from(note, {
          opacity: 0,
          y: 70,
          scale: 0.88,
          rotation: noteRotations[i] * 3,
          duration: 0.9,
          ease: 'back.out(1.5)',
          delay: i * 0.15,
          scrollTrigger: {
            trigger: note,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Ruler marks — horizontal top + vertical left
  const rulerMarksH = Array.from({ length: 46 }, (_, i) => i);
  const rulerMarksV = Array.from({ length: 60 }, (_, i) => i);

  return (
    <section className="py-8 md:py-14 px-3 md:px-6">
      {/* ─── Big unified white card ─── */}
      <div
        ref={sectionRef}
        className="relative max-w-[1100px] mx-auto rounded-3xl overflow-hidden"
        style={{
          backgroundColor: '#FDFBF7',
          boxShadow: '0 6px 32px rgba(42,37,34,0.09), 0 1px 6px rgba(42,37,34,0.05)',
        }}
      >
        {/* ── Ruler decorations ── */}

        {/* Horizontal ruler — top, ALL screen sizes */}
        <div className="absolute top-2 left-8 right-8 flex justify-between items-start pointer-events-none z-10">
          {rulerMarksH.map((mark) => (
            <div key={mark} className="flex flex-col items-center">
              <div
                className="w-px"
                style={{
                  height: mark % 5 === 0 ? '14px' : '7px',
                  backgroundColor: '#D5D0C8',
                }}
              />
              {mark % 5 === 0 && (
                <span className="text-[6px] mt-0.5" style={{ color: '#0E8B7D' }}>{mark}</span>
              )}
            </div>
          ))}
        </div>

        {/* Vertical ruler — left side, ALL screen sizes */}
        <div className="absolute left-2 top-8 bottom-8 flex flex-col justify-between items-start pointer-events-none z-10">
          {rulerMarksV.map((mark) => (
            <div key={mark} className="flex items-center">
              <div
                className="h-px"
                style={{
                  width: mark % 5 === 0 ? '14px' : '7px',
                  backgroundColor: '#D5D0C8',
                }}
              />
              {mark % 5 === 0 && (
                <span className="text-[6px] ml-0.5" style={{ color: '#0E8B7D' }}>{mark}</span>
              )}
            </div>
          ))}
        </div>

        {/* WIP badge */}
        <div
          className="absolute top-3 right-3 md:top-4 md:right-5 px-3 py-1.5 rounded-md rotate-3 z-20"
          style={{ backgroundColor: '#F5F0D0', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
        >
          <span className="text-xs font-bold" style={{ color: '#0E8B7D' }}>Wip</span>
        </div>

        {/* ══════════════════════════════════════
         *  TOP HALF — Heading + Stats
         * ══════════════════════════════════════ */}
        <div className="px-7 pt-9 pb-8 md:px-16 md:pt-14 md:pb-10 md:ml-4">
          {/* Heading */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-0.5" style={{ color: '#2A2522' }}>
              Built for
            </h2>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1" style={{ color: '#2A2522' }}>
              IMPACT &amp;
            </h2>
            <span
              className="text-2xl md:text-3xl lg:text-4xl inline-block -rotate-2"
              style={{ color: '#0E8B7D', fontFamily: "'Caveat', cursive" }}
            >
              driven by data.
            </span>
          </div>

          {/* Stats row */}
          <div className="flex justify-between items-start w-full px-1 sm:px-4 md:px-0 mt-4 md:mt-0 gap-2 md:gap-8">
            {/* CGPA */}
            <div className="text-center flex-1 flex flex-col items-center">
              <div className="flex items-baseline justify-center gap-[1px] md:gap-1">
                <span className="text-[26px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight" style={{ color: '#2A2522' }}>
                  {cgpa}
                </span>
                <span className="text-[14px] md:text-2xl font-bold" style={{ color: '#2A2522' }}>+</span>
              </div>
              <p className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest mt-1.5 mb-0.5 font-medium" style={{ color: '#6B6560' }}>Research Projects</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs" style={{ color: '#A09A94' }}>Method Dev. & Validation</p>
            </div>

            {/* ML Projects */}
            <div className="text-center flex-1 flex flex-col items-center">
              <div className="flex items-baseline justify-center gap-[1px] md:gap-1">
                <span className="text-[26px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight" style={{ color: '#2A2522' }}>
                  {projects}
                </span>
                <span className="text-[14px] md:text-2xl font-bold" style={{ color: '#2A2522' }}>+</span>
              </div>
              <p className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest mt-1.5 mb-0.5 font-medium" style={{ color: '#6B6560' }}>Conferences</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs max-w-[80px] md:max-w-none mx-auto leading-tight" style={{ color: '#A09A94' }}>Scientific posters</p>
            </div>

            {/* Certifications */}
            <div className="text-center flex-1 flex flex-col items-center">
              <div className="flex items-baseline justify-center gap-[1px] md:gap-1">
                <span className="text-[26px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight" style={{ color: '#2A2522' }}>
                  {certifications}
                </span>
                <span className="text-[14px] md:text-2xl font-bold" style={{ color: '#2A2522' }}>+</span>
              </div>
              <p className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest mt-1.5 mb-0.5 font-medium" style={{ color: '#6B6560' }}>Certifications</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs max-w-[80px] md:max-w-none mx-auto leading-tight" style={{ color: '#A09A94' }}>GMP, HPLC &amp; Soft Skills</p>
            </div>
          </div>
        </div>

        {/* ── Dashed separator inside card ── */}
        <div
          className="mx-5 md:mx-16"
          style={{
            borderTop: '1.5px dashed rgba(42,37,34,0.10)',
          }}
        />

        {/* ══════════════════════════════════════
         *  BOTTOM HALF — Process Cards
         * ══════════════════════════════════════ */}
        <div className="pl-10 pr-5 pt-8 pb-8 md:px-12 md:pt-10 md:pb-12 md:ml-4">


          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {notes.map((note, i) => (
              <div
                key={i}
                ref={(el) => { notesRef.current[i] = el; }}
                className={`relative rounded-xl p-3 md:p-4 pb-4 md:pb-5 note-curl ${note.animationClass} flex flex-col justify-between`}
                style={{
                  backgroundColor: note.bg,
                  transform: `rotate(${note.rotation}deg)`,
                  boxShadow: '0 6px 20px rgba(42,37,34,0.07), 0 2px 6px rgba(42,37,34,0.04)',
                }}
              >
                {/* Polaroid photo */}
                <div>
                  <div className="relative w-full aspect-video mb-3 bg-white p-1.5 shadow-sm rounded-sm transform -rotate-1 border border-black/5" style={{ maxHeight: '160px' }}>
                    {/* Tape */}
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-9 h-3.5 z-10 opacity-60"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.45)',
                        backdropFilter: 'blur(1px)',
                        transform: 'rotate(1deg)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        borderLeft: '1px dashed rgba(0,0,0,0.1)',
                        borderRight: '1px dashed rgba(0,0,0,0.1)',
                      }}
                    />
                    <img
                      src={note.image}
                      alt={note.title.replace('\n', ' ')}
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </div>

                  <h3
                    className="text-sm font-bold mb-2 leading-tight whitespace-pre-line"
                    style={{ color: note.titleColor }}
                  >
                    {note.title}
                  </h3>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: '#6B6560' }}>
                  {parseBoldText(note.body)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
