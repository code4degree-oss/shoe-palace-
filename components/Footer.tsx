'use client';

import { Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Footer() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  return (
    <footer id="contact" className="bg-brand-black text-white">
      {/* Newsletter Banner */}
      <div className="border-b border-white/[0.06]">
        <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl md:text-3xl font-bold uppercase tracking-tight mb-1.5">Stay in the Loop</h3>
            <p className="text-white/35 text-xs md:text-sm">Get early access to new drops, exclusive offers, and more.</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-0">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full sm:flex-1 md:w-72 bg-transparent border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors"
            />
            <button className="w-full sm:w-auto px-6 py-3 bg-white text-black font-medium text-xs uppercase tracking-[0.15em] hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
              Subscribe
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-lg font-bold tracking-[0.15em] uppercase">
                SHOE PLACE
              </span>
            </Link>
            <p className="text-white/30 text-sm leading-relaxed mb-8 max-w-xs">
              Performance meets style. Premium footwear crafted for athletes and trendsetters.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                <Instagram size={15} />
              </a>
              <a href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                <Twitter size={15} />
              </a>
              <a href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                <Youtube size={15} />
              </a>
            </div>
          </div>

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


          {/* Shop */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-6 text-white/50">Shop</h4>
            <ul className="space-y-3 text-sm text-white/30">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-white/15 italic">Loading...</li>
              )}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-6 text-white/50">Help</h4>
            <ul className="space-y-3 text-sm text-white/30">
              <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/return-and-refund-policy" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-white transition-colors">Cancellation</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-6 text-white/50">Legal</h4>
            <ul className="space-y-3 text-sm text-white/30">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/our-story" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/20 uppercase tracking-wider">
          <p>© {new Date().getFullYear()} Shoe Place. All Rights Reserved.</p>
          <p>
            Crafted by{' '}
            <a 
              href="https://dybusiness-solutions.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white/50 transition-colors"
            >
              DY Business Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
