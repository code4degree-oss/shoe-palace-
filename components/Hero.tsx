'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

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
    title: 'STEP INTO\nGREATNESS',
    subtitle: 'Performance engineered. Style refined. Built for champions.',
    cta: 'Shop Collection',
    href: '#shop',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1600&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800&auto=format&fit=crop',
    showText: true,
  },
];

function getLink(id: string): string {
  if (!id) return '#shop';
  if (id.startsWith('cat-')) return `/category/${id.replace('cat-', '')}`;
  return `/product/${id}`;
}


/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

export function Hero({ banners = [] }: { banners?: BannerData[] }) {
  const heroSlides = banners
    .filter(b => b.slot === 'hero' && b.isActive && b.imageUrl)
    .map(b => ({
      title: b.title || '',
      subtitle: b.subtitle || '',
      cta: b.buttonText || 'Shop Collection',
      href: getLink(b.linkedProductId),
      image: b.imageUrl,
      mobileImage: b.mobileImageUrl || b.imageUrl,
      showText: b.showText !== false,
    }));

  const slides = heroSlides.length > 0 ? heroSlides : FALLBACK;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prev = () => setCurrent((current - 1 + slides.length) % slides.length);
  const next = () => setCurrent((current + 1) % slides.length);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Mobile: 65vh — compact, content-first. Desktop: 100vh — immersive */}
      <div className="relative h-[65vh] md:h-[100vh] min-h-[400px] md:min-h-[600px] max-h-[600px] md:max-h-[900px]">
        <AnimatePresence mode="wait">
          {slides.map((s, i) => i === current && (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              {/* Background image */}
              <Image
                src={s.image}
                alt={s.title || 'Banner'}
                fill
                priority={i === 0}
                className="hidden md:block object-cover"
                sizes="100vw"
              />
              <Image
                src={s.mobileImage}
                alt={s.title || 'Banner'}
                fill
                priority={i === 0}
                className="block md:hidden object-cover"
                sizes="100vw"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10 z-10" />

              {s.showText && (
                <div className="absolute inset-0 flex items-end md:items-center z-20">
                  <div className="w-full px-5 pb-12 md:px-16 lg:px-24 md:pb-0 max-w-3xl">

                    {/* Title — smaller on mobile */}
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-3xl sm:text-4xl md:text-6xl lg:text-[5.5rem] font-serif font-bold text-white leading-[0.92] tracking-tight whitespace-pre-line mb-4 md:mb-6 uppercase"
                    >
                      {s.title}
                    </motion.h1>

                    {/* Subtle divider */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: 36 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="h-[1px] bg-white/40 mb-4 md:mb-6"
                    />

                    {/* Subtitle — smaller on mobile */}
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="text-white/50 text-xs md:text-base mb-6 md:mb-10 max-w-sm md:max-w-md font-light tracking-wide leading-relaxed"
                    >
                      {s.subtitle}
                    </motion.p>

                    {/* CTA — compact on mobile */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <Link
                        href={s.href}
                        className="group inline-flex items-center gap-2 md:gap-3 border border-white/80 text-white px-5 py-2.5 md:px-8 md:py-3.5 hover:bg-white hover:text-black transition-all duration-300 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium"
                      >
                        {s.cta}
                        <ArrowRight size={12} className="md:w-[14px] md:h-[14px] group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              )}

              {!s.showText && (
                <Link href={s.href} className="absolute inset-0 z-10 block" aria-label={s.title || "Banner link"} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Navigation — hidden on mobile, visible on desktop */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 border border-white/20 items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 border border-white/20 items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all"
            >
              <ChevronRight size={18} />
            </button>

            {/* Slide counter */}
            <div className="absolute bottom-4 md:bottom-10 left-5 md:left-16 lg:left-24 z-30 flex items-center gap-3 md:gap-4">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-[1px] transition-all duration-500 ${
                    i === current ? 'w-8 md:w-12 bg-white' : 'w-4 md:w-6 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
              <span className="text-white/30 text-[10px] md:text-[11px] font-mono ml-1 md:ml-2 tracking-wider">
                {String(current + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
