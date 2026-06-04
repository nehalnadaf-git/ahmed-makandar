'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const logos = [
  {
    name: 'B. Pharm',
    svg: (
      <svg width="120" height="44" viewBox="0 0 120 44">
        <rect x="4" y="15" width="22" height="14" rx="7" fill="#2E86AB" />
        <rect x="15" y="15" width="11" height="14" fill="#1A6E8A" />
        <line x1="15" y1="15" x2="15" y2="29" stroke="#F0EBE3" strokeWidth="1.5" />
        <text x="34" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">B. Pharm</text>
      </svg>
    ),
  },
  {
    name: 'UV Spectroscopy',
    svg: (
      <svg width="192" height="44" viewBox="0 0 192 44">
        <path d="M4 22 Q8 11 13 22 Q18 33 23 22 Q28 11 33 22" stroke="#A23B72" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <text x="42" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">UV Spectroscopy</text>
      </svg>
    ),
  },
  {
    name: 'HPLC',
    svg: (
      <svg width="100" height="44" viewBox="0 0 100 44">
        <rect x="8" y="4" width="12" height="7" rx="2" fill="#F18F01" />
        <rect x="11" y="11" width="6" height="22" rx="2" fill="#F18F01" />
        <rect x="8" y="33" width="12" height="4" rx="1.5" fill="#D4780A" />
        <text x="28" y="28" fill="#2A2522" fontSize="17" fontWeight="700" fontFamily="Inter, sans-serif">HPLC</text>
      </svg>
    ),
  },
  {
    name: 'GMP',
    svg: (
      <svg width="108" height="44" viewBox="0 0 108 44">
        <path d="M17 4 L29 8 V19 C29 27 17 35 17 35 C17 35 5 27 5 19 V8 Z" fill="#2D936C" />
        <path d="M11 19 L15 23 L23 15" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="36" y="28" fill="#2A2522" fontSize="17" fontWeight="700" fontFamily="Inter, sans-serif">GMP</text>
      </svg>
    ),
  },
  {
    name: 'MS Office',
    svg: (
      <svg width="135" height="44" viewBox="0 0 135 44">
        <rect x="4" y="9" width="11" height="11" rx="1.5" fill="#D83B01" />
        <rect x="17" y="9" width="11" height="11" rx="1.5" fill="#D83B01" />
        <rect x="4" y="22" width="11" height="11" rx="1.5" fill="#D83B01" />
        <rect x="17" y="22" width="11" height="11" rx="1.5" fill="#D83B01" />
        <text x="36" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">MS Office</text>
      </svg>
    ),
  },
  {
    name: 'Pharmacovigilance',
    svg: (
      <svg width="222" height="44" viewBox="0 0 222 44">
        <rect x="4" y="16" width="26" height="12" rx="3" fill="#0E8B7D" />
        <rect x="10" y="8" width="12" height="28" rx="3" fill="#0E8B7D" />
        <text x="38" y="28" fill="#2A2522" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">Pharmacovigilance</text>
      </svg>
    ),
  },
  {
    name: 'Lab Techniques',
    svg: (
      <svg width="175" height="44" viewBox="0 0 175 44">
        <path d="M14 7 L14 19 L5 34 C5 36 8 38 17 38 C26 38 29 36 29 34 L20 19 L20 7 Z" fill="#5C4E8B" opacity="0.18" />
        <path d="M14 7 L14 19 L5 34 C5 36 8 38 17 38 C26 38 29 36 29 34 L20 19 L20 7" stroke="#5C4E8B" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <line x1="11" y1="7" x2="23" y2="7" stroke="#5C4E8B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="30" r="2.2" fill="#5C4E8B" />
        <circle cx="17" cy="34" r="1.6" fill="#5C4E8B" />
        <text x="36" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">Lab Techniques</text>
      </svg>
    ),
  },
  {
    name: 'QA & R&D',
    svg: (
      <svg width="132" height="44" viewBox="0 0 132 44">
        <circle cx="14" cy="17" r="10" stroke="#217346" strokeWidth="2.5" fill="none" />
        <line x1="21" y1="24" x2="30" y2="33" stroke="#217346" strokeWidth="2.5" strokeLinecap="round" />
        <text x="37" y="28" fill="#2A2522" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">QA &amp; R&amp;D</text>
      </svg>
    ),
  },
  {
    name: 'Drug Safety',
    svg: (
      <svg width="148" height="44" viewBox="0 0 148 44">
        <path d="M4 22 L9 22 L13 13 L17 31 L21 17 L25 22 L30 22" stroke="#E74C3C" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="38" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">Drug Safety</text>
      </svg>
    ),
  },
];

export default function LogoMarquee() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Two copies — CSS translateX(-50%) loops seamlessly */
  const allLogos = [...logos, ...logos];

  return (
    <section ref={sectionRef} className="py-6 md:py-10 overflow-hidden">
      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 md:w-28 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #F0EBE3 40%, transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #F0EBE3 40%, transparent)' }}
        />

        <div className="flex animate-marquee" style={{ width: 'max-content' }}>
          {allLogos.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex-shrink-0 mx-8 md:mx-14 flex items-center transition-all duration-200 cursor-default"
              style={{ opacity: 0.72 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = '1';
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = '0.72';
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
              }}
            >
              {logo.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
