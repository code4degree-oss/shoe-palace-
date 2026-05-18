'use client';

import { Leaf, Instagram, Facebook, Youtube, Store } from 'lucide-react';
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
    <footer id="contact" className="bg-brand-dark text-brand-light pt-20 pb-10">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2 group mb-6 text-white">
              <Store className="text-brand-accent" />
              <span className="font-serif text-2xl font-semibold tracking-tight">
                Shoe Place
              </span>
            </a>
            <p className="text-brand-light/60 text-sm leading-relaxed mb-6">
              Bringing premium footwear to your doorstep. Experience the perfect blend of style, comfort, and tradition with Shoe Place.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/kesurved_herbal_product/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-accent hover:text-brand-dark transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/shubhangi.randive.98?mibextid=wwXIfr&rdid=3VVkGrnefn0fOzH3&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18QkUuEn4b%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-accent hover:text-brand-dark transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://www.youtube.com/@shubhangirandive9145" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-accent hover:text-brand-dark transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Shop Categories</h4>
            <ul className="space-y-4 text-sm text-brand-light/60">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-brand-accent transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-brand-light/40 italic">Loading categories...</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Terms and Conditions</h4>
            <ul className="space-y-4 text-sm text-brand-light/60">
              <li><Link href="/privacy-policy" className="hover:text-brand-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/return-and-refund-policy" className="hover:text-brand-accent transition-colors">Return & Refund Policy</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-brand-accent transition-colors">Cancellation Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-brand-accent transition-colors">Shipping Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-brand-accent transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4 text-sm text-brand-light/60">
              <li><a href="tel:7447201252" className="hover:text-brand-accent transition-colors">+91 7447201252</a></li>
              <li><a href="tel:9270201252" className="hover:text-brand-accent transition-colors">+91 9270201252</a></li>
              <li><a href="mailto:kesurvedherbalproducts@gmail.com" className="hover:text-brand-accent transition-colors">kesurvedherbalproducts@gmail.com</a></li>
              <li className="leading-relaxed">Hivare Tarfe Narayangaon, Taluka – Junnar, District – Pune, Maharashtra – 410504</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-light/40">
          <p>Copyright©{new Date().getFullYear()} Shoe Place</p>
          <p>
            Designed by{' '}
            <a 
              href="https://dybusiness-solutions.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors"
            >
              DY Business Solutions Pvt Ltd
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
