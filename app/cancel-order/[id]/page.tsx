'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function CancelOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id;
  const router = useRouter();
  
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState<string>('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedPhone = localStorage.getItem('customer_phone');
    if (!storedPhone) {
      router.push('/login');
      return;
    }
    setPhone(storedPhone);

    fetch(`/api/customer/orders?phone=${storedPhone}`)
      .then(res => res.json())
      .then(data => {
        if (data.orders) {
          const foundOrder = data.orders.find((o: any) => o.id === orderId);
          setOrder(foundOrder);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details.');
        setIsLoading(false);
      });
  }, [orderId, router]);

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/customer/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, reason })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Order cancelled successfully.');
        router.push('/account');
      } else {
        setError(data.error || 'Failed to cancel order.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading order details...</div>;
  }

  if (!order) {

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <Link href="/account" className="text-brand-accent hover:underline">Return to My Orders</Link>
      </div>
    );
  }

  const orderAgeMs = Date.now() - new Date(order.createdAt).getTime();
  const isCancellable = order.status === 'NEW' && orderAgeMs < 12 * 60 * 60 * 1000;

  if (!isCancellable) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Cannot Cancel Order</h2>
          <p className="text-gray-600 mb-6">
            {order.status === 'CANCELLED' 
              ? 'This order has already been cancelled.' 
              : 'Orders can only be cancelled within 12 hours of placement and must not be processed yet.'}
          </p>
          <Link href="/account" className="inline-block w-full py-3 bg-gray-100 text-gray-800 font-bold rounded-md hover:bg-gray-200 transition-colors">
            Return to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/account" className="inline-flex items-center gap-2 text-gray-600 hover:text-black font-medium mb-8 transition-colors">
          <ArrowLeft size={18} />
          Back to My Orders
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-red-50 px-6 py-4 border-b border-red-100">
            <h1 className="text-2xl font-bold text-red-800">Cancel Order</h1>
            <p className="text-red-600 text-sm mt-1">Please confirm your cancellation below.</p>
          </div>
          
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-gray-800 mb-2">Order Details</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-gray-500">Order #</div>
                <div className="font-medium text-right">{order.orderNumber || order.id}</div>
                <div className="text-gray-500">Customer</div>
                <div className="font-medium text-right">{order.shippingName || phone}</div>
                <div className="text-gray-500">Mobile</div>
                <div className="font-medium text-right">{phone}</div>
                <div className="text-gray-500">Total Amount</div>
                <div className="font-medium text-right">₹{order.total.toFixed(2)}</div>
              </div>
            </div>

            <form onSubmit={handleCancel}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="reason" className="block text-sm font-bold text-gray-700 mb-2">
                  Reason for cancellation (Optional)
                </label>
                <textarea
                  id="reason"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors resize-none"
                  placeholder="Tell us why you are cancelling this order..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/account"
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-800 text-center font-bold rounded-md hover:bg-gray-200 transition-colors"
                >
                  Keep My Order
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
