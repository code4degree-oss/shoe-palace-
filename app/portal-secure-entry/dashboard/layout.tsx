'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  TrendingUp,
  Layers,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  ChevronRight,
  Truck,
  Settings,
  ImageIcon,
  MessageCircle,
  ImagePlay,
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/portal-secure-entry/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/portal-secure-entry/dashboard/products', icon: Package },
  { label: 'Categories', href: '/portal-secure-entry/dashboard/categories', icon: Layers },
  { label: 'Banners', href: '/portal-secure-entry/dashboard/banners', icon: ImageIcon },
  { label: 'Orders', href: '/portal-secure-entry/dashboard/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/portal-secure-entry/dashboard/customers', icon: Users },
  { label: 'Reviews', href: '/portal-secure-entry/dashboard/reviews', icon: Star },
  { label: 'Revenue', href: '/portal-secure-entry/dashboard/revenue', icon: TrendingUp },
  { label: 'Analytics', href: '/portal-secure-entry/dashboard/analytics', icon: TrendingUp },
  { label: 'Delivery Zones', href: '/portal-secure-entry/dashboard/delivery', icon: Truck },
  { label: 'Results (Before/After)', href: '/portal-secure-entry/dashboard/results', icon: ImagePlay },
  { label: 'FAQs', href: '/portal-secure-entry/dashboard/faqs', icon: MessageCircle },
  { label: 'Settings', href: '/portal-secure-entry/dashboard/settings', icon: Settings },
];


/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/portal-secure-entry');
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-brand-black text-white flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={20} className="text-white" />
            <span className="font-serif text-base font-bold tracking-[0.1em] uppercase">Shoe Place</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/40 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-0.5">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                  }`}
                >
                  <item.icon size={17} className={isActive ? 'text-white' : 'text-white/25 group-hover:text-white/50'} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="text-white/30" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-bold text-brand-black uppercase tracking-wider hidden sm:block">
              {SIDEBAR_ITEMS.find((i) => i.href === pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-black flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
