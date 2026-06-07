'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const logos = [
  {
    name: 'Solar O&M',
    svg: (
      <svg width="130" height="44" viewBox="0 0 130 44">
        <circle cx="17" cy="22" r="8" fill="#F18F01" />
        <line x1="17" y1="7" x2="17" y2="4" stroke="#F18F01" strokeWidth="2" strokeLinecap="round" />
        <line x1="17" y1="37" x2="17" y2="40" stroke="#F18F01" strokeWidth="2" strokeLinecap="round" />
        <line x1="2" y1="22" x2="5" y2="22" stroke="#F18F01" strokeWidth="2" strokeLinecap="round" />
        <line x1="29" y1="22" x2="32" y2="22" stroke="#F18F01" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="11" x2="8" y2="13" stroke="#F18F01" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="31" x2="28" y2="33" stroke="#F18F01" strokeWidth="2" strokeLinecap="round" />
        <line x1="28" y1="11" x2="26" y2="13" stroke="#F18F01" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="31" x2="6" y2="33" stroke="#F18F01" strokeWidth="2" strokeLinecap="round" />
        <text x="40" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">Solar O&M</text>
      </svg>
    ),
  },
  {
    name: 'SCADA Monitoring',
    svg: (
      <svg width="215" height="44" viewBox="0 0 215 44">
        <rect x="4" y="10" width="24" height="18" rx="2" fill="#2E86AB" />
        <rect x="6" y="12" width="20" height="14" rx="1" fill="#1A6E8A" />
        <path d="M8 22 L12 17 L16 20 L20 15 L24 18" stroke="#7DD3FC" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <text x="34" y="28" fill="#2A2522" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">SCADA Monitoring</text>
      </svg>
    ),
  },
  {
    name: 'SAP S4/HANA',
    svg: (
      <svg width="155" height="44" viewBox="0 0 155 44">
        <rect x="4" y="8" width="26" height="28" rx="3" fill="#0070B1" />
        <text x="6" y="19" fill="white" fontSize="7" fontWeight="800" fontFamily="Inter, sans-serif">SAP</text>
        <rect x="8" y="22" width="18" height="2" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="8" y="26" width="14" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        <text x="38" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">SAP S4/HANA</text>
      </svg>
    ),
  },
  {
    name: 'HV Switchgear',
    svg: (
      <svg width="170" height="44" viewBox="0 0 170 44">
        <rect x="4" y="8" width="26" height="28" rx="2" fill="#4A5568" />
        <circle cx="17" cy="18" r="5" stroke="#F6E05E" strokeWidth="2" fill="none" />
        <line x1="17" y1="23" x2="17" y2="30" stroke="#F6E05E" strokeWidth="2" strokeLinecap="round" />
        <text x="38" y="28" fill="#2A2522" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">HV Switchgear</text>
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
    name: 'Renewable Energy',
    svg: (
      <svg width="215" height="44" viewBox="0 0 215 44">
        <path d="M17 8 C10 8 5 13 5 20 C5 27 10 32 17 32 C24 32 29 27 29 20 L17 20 Z" fill="#48BB78" />
        <path d="M17 8 L17 20 L28 14 Z" fill="#2F855A" />
        <text x="38" y="28" fill="#2A2522" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">Renewable Energy</text>
      </svg>
    ),
  },
  {
    name: 'Electrical Testing',
    svg: (
      <svg width="200" height="44" viewBox="0 0 200 44">
        <path d="M17 6 L21 18 L15 18 L19 38 L11 20 L17 20 Z" fill="#E53E3E" />
        <text x="36" y="28" fill="#2A2522" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">Electrical Testing</text>
      </svg>
    ),
  },
  {
    name: 'HSE Compliance',
    svg: (
      <svg width="190" height="44" viewBox="0 0 190 44">
        <path d="M17 4 L29 8 V19 C29 27 17 35 17 35 C17 35 5 27 5 19 V8 Z" fill="#D69E2E" />
        <path d="M11 19 L15 23 L23 15" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="36" y="28" fill="#2A2522" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">HSE Compliance</text>
      </svg>
    ),
  },
  {
    name: 'EL / IR Testing',
    svg: (
      <svg width="180" height="44" viewBox="0 0 180 44">
        <rect x="5" y="12" width="24" height="18" rx="2" fill="#553C9A" />
        <rect x="9" y="16" width="16" height="10" rx="1" fill="#B794F4" opacity="0.5" />
        <circle cx="17" cy="21" r="3" fill="#E9D8FD" />
        <text x="36" y="28" fill="#2A2522" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">EL / IR Testing</text>
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
