'use client';

import { useCart } from './CartContext';
import { ShoppingBag, Store, Menu, X, User, Package } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header() {
  const { openCart, cartCount } = useCart();
  const { scrollY } = useScroll();
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
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 1)']
  );
  
  const borderColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.08)']
  );

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
      <motion.header
        style={{ backgroundColor, borderColor }}
        className="fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-md transition-colors duration-300"
      >
        <div className="w-full px-4 md:px-8 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Mobile Menu & Logo (Left) */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-black hover:text-brand-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Mobile Menu"
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <Store className="text-black group-hover:scale-110 transition-transform" />
              <span className="font-serif text-2xl font-semibold tracking-tight text-black">
                Shoe Place
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8 text-[15px] text-black">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.id}`} className="hover:text-brand-accent transition-colors px-2 py-1">
                {cat.name}
              </Link>
            ))}
            <Link href="/our-story" className="hover:text-brand-accent transition-colors px-2 py-1">Our Story</Link>
            <a href="#contact" className="hover:text-brand-accent transition-colors px-2 py-1">Contact</a>
          </nav>

          {/* Icons (Right) */}
          <div className="flex items-center justify-end gap-2 md:gap-4">
            
            {/* User Profile / Login */}
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
                className="relative p-2 text-black hover:text-brand-accent transition-colors"
                aria-label="User Account"
              >
                <User size={24} />
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
                      className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50"
                    >
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Signed in as</p>
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

            <button
              onClick={openCart}
              className="relative p-2 text-black hover:text-brand-accent transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-5 h-5 bg-brand-accent text-brand-dark text-xs font-bold rounded-full flex items-center justify-center border-2 border-brand-light"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>

        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-light z-50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-4 h-20 border-b border-brand-blue/10">
                <a href="#" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Store className="text-black" />
                  <span className="font-serif text-2xl font-semibold tracking-tight text-black">
                    Shoe Place
                  </span>
                </a>
                <button 
                  className="p-2 -mr-2 text-black hover:text-brand-accent bg-gray-100 rounded-full transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close Mobile Menu"
                >
                  <X size={24} />
                </button>
              </div>
              
              <nav className="flex flex-col gap-6 p-8 text-2xl font-serif text-black">
                {categories.map((cat) => (
                  <Link 
                    key={cat.id}
                    href={`/category/${cat.id}`} 
                    className="pb-4 border-b border-brand-blue/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link 
                  href="/our-story" 
                  className="pb-4 border-b border-brand-blue/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Story
                </Link>
                <a 
                  href="#contact" 
                  className="pb-4 border-b border-brand-blue/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <button 
                  className="pb-4 border-b border-brand-blue/10 flex items-center gap-3 text-left w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    const phone = localStorage.getItem('customer_phone');
                    router.push(phone ? '/account' : '/login');
                  }}
                >
                  <Package size={22} className="text-brand-accent" />
                  Track Order
                </button>
              </nav>
              
              <div className="mt-auto p-8 bg-brand-blue/5">
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openCart();
                    }}
                    className="w-full py-4 px-6 bg-brand-blue text-white rounded-full font-medium flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={20} />
                    View Basket ({cartCount})
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
