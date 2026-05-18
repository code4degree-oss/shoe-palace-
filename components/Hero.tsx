'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface BannerData {
  id: string;
  slot: string;
  imageUrl: string;
  mobileImageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  linkedProductId: string;
  showText?: boolean;
  isActive: boolean;
}

interface Slide {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  mobileImage: string;
  showText: boolean;
}

const FALLBACK: Slide[] = [
  {
    title: 'Ancient Wisdom,\nModern Results',
    subtitle: 'Ayurvedic hair & skin care crafted from 100% organic herbs',
    cta: 'Shop Bestsellers',
    href: '#shop',
    image: 'https://picsum.photos/seed/hero1/1400/600',
    mobileImage: 'https://picsum.photos/seed/hero1m/800/1000',
    showText: true,
  },
];

function getLink(id: string): string {
  if (!id) return '#shop';
  if (id.startsWith('cat-')) return `/category/${id.replace('cat-', '')}`;
  return `/product/${id}`;
}

export function Hero({ banners = [] }: { banners?: BannerData[] }) {
  const heroSlides = banners
    .filter(b => b.slot === 'hero' && b.isActive && b.imageUrl)
    .map(b => ({
      title: b.title || '',
      subtitle: b.subtitle || '',
      cta: b.buttonText || 'Shop Now',
      href: getLink(b.linkedProductId),
      image: b.imageUrl,
      mobileImage: b.mobileImageUrl || b.imageUrl,
      showText: b.showText !== false, // default true
    }));

  const slides = heroSlides.length > 0 ? heroSlides : FALLBACK;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prev = () => setCurrent((current - 1 + slides.length) % slides.length);
  const next = () => setCurrent((current + 1) % slides.length);

  return (
    <section className="relative w-full overflow-hidden pt-16 md:pt-20">
      <div className="relative h-[480px] md:h-[540px] lg:h-[600px]">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Clickable Overlay for the whole banner */}
            <a href={s.href} className="absolute inset-0 z-10 block" aria-label={s.title || "Banner link"} />
            
            <Image src={s.image} alt={s.title || 'Banner'} fill priority={i === 0} className="hidden md:block object-cover" sizes="100vw" />
            <Image src={s.mobileImage} alt={s.title || 'Banner'} fill priority={i === 0} className="block md:hidden object-cover" sizes="100vw" />
            
            {s.showText && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/40 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 flex items-center z-20 pointer-events-none">
                  <div className="w-full px-6 md:px-16 lg:px-24 max-w-3xl pointer-events-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight whitespace-pre-line mb-4 drop-shadow-lg">{s.title}</h1>
                    <p className="text-white/80 text-sm sm:text-base md:text-lg mb-6 max-w-xl">{s.subtitle}</p>
                    <a href={s.href} className="inline-flex items-center gap-2 bg-brand-accent text-black font-bold px-8 py-3.5 rounded-sm hover:bg-brand-accent-hover transition-colors shadow-lg shadow-brand-accent/30 tracking-wide text-sm md:text-base">
                      {s.cta}
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2.5 bg-brand-accent' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
