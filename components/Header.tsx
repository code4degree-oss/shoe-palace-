'use client';

import { useCart } from './CartContext';
import { ShoppingBag, Menu, X, User, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header() {
  const { openCart, cartCount } = useCart();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className="w-full z-40 bg-white border-b border-gray-100"
      >

        <div className="w-full px-4 md:px-8 lg:px-12 h-14 md:h-16 flex items-center justify-between">
          
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-1.5 -ml-1 text-brand-black"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Mobile Menu"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-lg md:text-2xl font-bold tracking-[0.15em] uppercase text-brand-black">
                SHOE PLACE
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8 text-[13px] tracking-[0.1em] uppercase font-medium text-brand-steel">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="relative py-1 hover:text-brand-black transition-colors group"
              >
                {cat.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-black group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            <Link href="/our-story" className="relative py-1 hover:text-brand-black transition-colors group">
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-black group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center justify-end gap-1 md:gap-3">
            
            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  const phone = localStorage.getItem('customer_phone');
                  if (phone) {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  } else {
                    router.push('/login');
                  }
                }}
                className="relative p-1.5 text-brand-black hover:text-brand-steel transition-colors"
                aria-label="User Account"
              >
                <User size={18} />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-none shadow-xl py-1.5 z-50"
                    >
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{localStorage.getItem('customer_phone')}</p>
                      </div>
                      <Link 
                        href="/account" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-accent transition-colors"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem('customer_phone');
                          setIsProfileDropdownOpen(false);
                          window.location.reload();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-1.5 text-brand-black hover:text-brand-steel transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-black text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="font-serif text-xl font-bold tracking-[0.15em] uppercase text-black">
                  SHOE PLACE
                </span>
              </Link>
              <button 
                className="p-2 -mr-2 text-black hover:text-brand-steel transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Mobile Menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-0 flex-1">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    href={`/category/${cat.id}`} 
                    className="block px-6 py-5 text-lg font-serif font-bold uppercase tracking-wider text-black border-b border-gray-50 hover:bg-gray-50 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: categories.length * 0.05 }}
              >
                <Link 
                  href="/our-story" 
                  className="block px-6 py-5 text-lg font-serif font-bold uppercase tracking-wider text-black border-b border-gray-50 hover:bg-gray-50 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Story
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (categories.length + 1) * 0.05 }}
              >
                <button 
                  className="w-full text-left px-6 py-5 text-lg font-serif font-bold uppercase tracking-wider text-black border-b border-gray-50 hover:bg-gray-50 transition-all flex items-center gap-3"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    const phone = localStorage.getItem('customer_phone');
                    router.push(phone ? '/account' : '/login');
                  }}
                >
                  <Package size={20} className="text-brand-steel" />
                  Track Order
                </button>
              </motion.div>
            </nav>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openCart();
                }}
                className="w-full py-4 px-6 bg-brand-black text-white font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 hover:bg-brand-graphite transition-colors"
              >
                <ShoppingBag size={18} />
                View Bag ({cartCount})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
