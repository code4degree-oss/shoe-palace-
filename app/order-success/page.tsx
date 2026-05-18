'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold font-playfair mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
        
        {orderId && (
          <div className="bg-gray-50 p-4 rounded-md mb-8 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="font-mono font-bold text-gray-900">{orderId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/account"
            className="block w-full py-3 px-4 bg-brand-accent text-black rounded-sm font-bold hover:bg-brand-accent-hover transition-colors"
          >
            View Orders
          </Link>
          <Link 
            href="/"
            className="block w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
