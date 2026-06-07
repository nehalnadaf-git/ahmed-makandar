'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function LinkedInIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const testimonials = [
  {
    title: 'Lead Engineer – Solar O&M',
    body: 'Managed end-to-end SCADA monitoring of a 400 MW solar power plant covering 0.6/33 kV & 11/66 kV systems. Operated 33 kV & 66 kV switchgear (16 bays). Led field teams for AC and DC breakdowns. Prepared Daily Generation Reports, performed energy forecasting and plant PR/PLF analysis.',
    author: 'TATA POWER RENEWABLE ENERGY',
    role: '400 MW RE Park, Pavagada, Karnataka · Sept 2023 – April 2025',
    linkedin: 'https://www.linkedin.com/in/ahmed-rehan-makandar-343106291/',
    paperBg: '#F5EEC0',
    paperType: 'holes',
    tapeColor: '#E8D8A8',
    tapeRotation: 2,
    image: '/assets/tata_power_solar.png',
  },
  {
    title: 'Solar Energy Basics – Certification',
    body: 'Completed the Solar Energy Basics certification course on Coursera. Gained foundational knowledge of photovoltaic technology, solar plant design, energy yield assessment, and renewable energy fundamentals applicable to utility-scale solar O&M operations.',
    author: 'COURSERA',
    role: 'Solar Energy Basics · Certificate of Completion',
    linkedin: 'https://www.linkedin.com/in/ahmed-rehan-makandar-343106291/',
    paperBg: '#F0E8D8',
    paperType: 'spiral',
    tapeColor: '#D8C8A8',
    tapeRotation: -2,
    image: '/assets/coursera_cert.png',
  },
  {
    title: 'Substation Maintenance Internship',
    body: 'Internship at KPTCL 220 kV Sharavathi Receiving Station (SRS), Vidyuth Nagar, Hubli. Gained hands-on experience in HV substation maintenance, protection relay testing, transformer maintenance, and high-voltage switchgear operations in a live grid environment.',
    author: 'KPTCL – 220 kV SHARAVATHI SRS',
    role: 'Substation Maintenance · Feb 2023 – Jun 2023 · Hubli',
    linkedin: 'https://www.linkedin.com/in/ahmed-rehan-makandar-343106291/',
    paperBg: '#F5D8D0',
    paperType: 'orange-spiral',
    tapeColor: '#E8C0B0',
    tapeRotation: 1,
    image: '/assets/kptcl_substation.png',
  },
];

/* ── Reusable card JSX ── */
function TestimonialCard({
  t,
  refCallback,
  floatClass,
  floatDelay,
}: {
  t: (typeof testimonials)[0];
  refCallback?: (el: HTMLDivElement | null) => void;
  floatClass: string;
  floatDelay: string;
}) {
  return (
    <div
      ref={refCallback}
      className={`relative ${floatClass}`}
      style={{ animationDelay: floatDelay }}
    >
      {/* Tape strip */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-5 z-10 opacity-80"
        style={{
          backgroundColor: t.tapeColor,
          transform: `translateX(-50%) rotate(${t.tapeRotation}deg)`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}
      />

      {/* Paper card */}
      <div
        className="relative rounded-sm overflow-hidden h-full flex"
        style={{
          backgroundColor: t.paperBg,
          boxShadow: '4px 4px 12px rgba(42,37,34,0.1)',
          minHeight: '420px',
        }}
      >
        {/* Full-height left edge stripe */}
        <div
          className="flex-shrink-0 flex flex-col items-center py-3"
          style={{
            width: '20px',
            backgroundColor: t.paperType === 'holes' ? '#D4C97A' : t.paperType === 'spiral' ? '#3A3530' : '#D97706',
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
            <div
              key={h}
              className="w-2.5 h-2.5 rounded-full my-2"
              style={{
                backgroundColor: t.paperType === 'spiral' ? '#F0EBE3' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>

        {/* Card content */}
        <div className="flex flex-col flex-1 p-5 pl-4">
          <h3
            className="text-base font-bold mb-2 leading-snug"
            style={{ color: '#2A2522', fontFamily: "'Caveat', cursive", fontSize: '18px' }}
          >
            {t.title}
          </h3>

          {/* Polaroid photo */}
          <div className="relative mb-4 mt-2 px-1">
            <div
              className="bg-white p-2 pb-6 shadow-md rounded-xs transform -rotate-1 border border-black/5"
              style={{ maxWidth: '95%', margin: '0 auto' }}
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xs bg-gray-100">
                <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
              </div>
              <div
                className="text-center mt-2.5 text-[9px] font-bold tracking-tight opacity-75 uppercase"
                style={{ color: '#6B6560' }}
              >
                {t.author.slice(0, 30)}
              </div>
            </div>
            {/* Tape holding Polaroid */}
            <div
              className="absolute -top-2 left-1/3 w-10 h-4 z-10 opacity-70"
              style={{
                backgroundColor: 'rgba(232, 115, 46, 0.2)',
                transform: 'rotate(-8deg)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                borderLeft: '1px dashed rgba(255,255,255,0.4)',
                borderRight: '1px dashed rgba(255,255,255,0.4)',
              }}
            />
          </div>

          {/* Body */}
          <div className="flex-1 relative mb-4">
            <div className="flex gap-2 h-full">
              <p
                className="text-xs leading-relaxed flex-1 overflow-y-auto pr-1"
                style={{
                  color: '#6B6560',
                  fontFamily: "'Caveat', cursive",
                  fontSize: '14px',
                  maxHeight: '120px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D5D0C8 transparent',
                }}
              >
                {t.body}
              </p>

            </div>
          </div>

          {/* Author */}
          <div className="mt-auto pt-3 border-t" style={{ borderColor: 'rgba(42,37,34,0.08)' }}>
            <p className="text-xs font-bold" style={{ color: '#2A2522' }}>{t.author}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs" style={{ color: '#6B6560' }}>{t.role}</p>
              <a
                href={t.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-linkedin-blue"
                style={{ color: '#0A66C2' }}
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const desktopCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const mobileSliderWrapRef = useRef<HTMLDivElement>(null);
  const slideItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  /* Entrance animations — desktop cards + mobile slider */
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      /* ── Desktop: scattered paper entrance ── */
      const cardRotations = [-5, 3, -4];
      desktopCardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          opacity: 0,
          y: 80,
          scale: 0.86,
          rotation: cardRotations[i] * 3,
          duration: 1,
          ease: 'back.out(1.5)',
          delay: i * 0.2,
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      });

      /* ── Mobile: slider wrapper slides up with scale ── */
      if (mobileSliderWrapRef.current) {
        gsap.from(mobileSliderWrapRef.current, {
          opacity: 0,
          y: 60,
          scale: 0.95,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      /* ── Mobile: each slide card springs in ── */
      slideItemsRef.current.forEach((slide, i) => {
        if (!slide) return;
        gsap.from(slide, {
          opacity: 0,
          y: 40,
          scale: 0.9,
          duration: 0.7,
          ease: 'back.out(1.4)',
          delay: i * 0.15,
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Track active slide via IntersectionObserver */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    slideItemsRef.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActiveSlide(i);
          }
        },
        {
          root: sliderRef.current,
          threshold: 0.6,
        },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* Scroll to slide — only moves the slider container horizontally, never the page */
  const goToSlide = (i: number) => {
    const el = slideItemsRef.current[i];
    const container = sliderRef.current;
    if (!el || !container) return;
    const targetLeft =
      el.offsetLeft - (container.offsetWidth - el.offsetWidth) / 2;
    container.scrollTo({ left: targetLeft, behavior: 'smooth' });
  };

  /* Auto-slide — only runs when the section is visible on screen */
  const sectionVisibleRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { sectionVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.4 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!sectionVisibleRef.current) return;
      const nextSlide = (activeSlide + 1) % testimonials.length;
      goToSlide(nextSlide);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
    <section ref={sectionRef} className="py-12 md:py-20 px-4">
      <div className="max-w-[1100px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight" style={{ color: '#2A2522' }}>
            ACHIEVEMENTS &
          </h2>
          <span
            className="text-2xl md:text-3xl lg:text-4xl -mt-1 block"
            style={{ color: '#D97706', fontFamily: "'Caveat', cursive" }}
          >
            certifications
          </span>
        </div>

        {/* ── Mobile Slider (hidden md+) ── */}
        <div ref={mobileSliderWrapRef} className="md:hidden">
          {/* Scroll track */}
          <div
            ref={sliderRef}
            className="slider-hide-scrollbar flex overflow-x-auto gap-5 pb-6 px-2"
            style={{
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              /* hide scrollbar */
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                ref={(el) => { slideItemsRef.current[i] = el; }}
                className="flex-shrink-0 pt-4"
                style={{
                  scrollSnapAlign: 'center',
                  width: 'calc(85vw)',
                  maxWidth: '340px',
                }}
              >
                <TestimonialCard
                  t={t}
                  floatClass="animate-note-float-2"
                  floatDelay={`${i * 0.4}s`}
                />
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2.5 mt-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: activeSlide === i ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: activeSlide === i ? '#D97706' : '#D5D0C8',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'width 300ms ease, background-color 300ms ease',
                }}
              />
            ))}
          </div>

          {/* Swipe hint */}
          <p
            className="text-center mt-3 text-lg"
            style={{ color: '#A09A94', fontFamily: "'Caveat', cursive" }}
          >
            swipe to explore →
          </p>
        </div>

        {/* ── Desktop Grid (hidden below md) ── */}
        <div className="hidden md:grid grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              t={t}
              refCallback={(el) => { desktopCardsRef.current[i] = el; }}
              floatClass="animate-note-float-2"
              floatDelay={`${i * 0.4}s`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
