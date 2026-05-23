'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, Package, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Auto-redirect if already logged in
  useEffect(() => {
    const storedPhone = localStorage.getItem('customer_phone');
    if (storedPhone) {
      router.push('/account');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mobile.length === 10) {
      // Check if this phone has any orders
      try {
        const res = await fetch(`/api/customer/orders?phone=${mobile}`);
        const data = await res.json();
        
        localStorage.setItem('customer_phone', mobile);
        
        if (data.orders && data.orders.length > 0) {
          router.push('/account');
        } else {
          // Phone is saved, but no orders yet — redirect to account anyway
          router.push('/account');
        }
      } catch {
        localStorage.setItem('customer_phone', mobile);
        router.push('/account');
      }
    }
  };


/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <Leaf className="text-black group-hover:scale-110 transition-transform" />
        <span className="font-serif text-2xl font-semibold tracking-tight text-black">Shoe Place</span>
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={24} className="text-brand-accent" />
          </div>
          <h1 className="text-2xl font-bold font-serif mb-2">Track Your Orders</h1>
          <p className="text-gray-500 text-sm">Enter the mobile number you used while placing your order to view order status and history.</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone size={18} />
              </span>
              <input
                required
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent text-lg transition-all"
                placeholder="Enter 10-digit number"
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit mobile number"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={mobile.length !== 10}
            className="w-full py-3.5 px-6 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed group text-base"
          >
            <span>View My Orders</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account? Just shop and checkout — we&apos;ll create one for you automatically!
          </p>
          <Link href="/" className="inline-block mt-3 text-sm font-medium text-black hover:text-brand-accent transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
