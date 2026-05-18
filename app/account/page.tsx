'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ArrowLeft, LogOut, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AccountPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phone, setPhone] = useState<string | null>(null);
  const router = useRouter();

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
        if (data.orders) setOrders(data.orders);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch orders:', err);
        setIsLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('customer_phone');
    router.push('/');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black font-medium mb-6 transition-colors">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-playfair flex items-center gap-2">
              <Package className="text-brand-accent" />
              My Orders
            </h1>
            <p className="text-gray-600 mt-1">Showing orders for {phone}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Orders Found</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders with this number yet.</p>
            <Link href="/" className="inline-block px-6 py-3 bg-brand-accent text-black font-bold rounded-sm hover:bg-brand-accent-hover transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderAgeMs = Date.now() - new Date(order.createdAt).getTime();
              const canCancel = order.status === 'NEW' && orderAgeMs < 4 * 60 * 60 * 1000;
              return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order Placed</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                    <p className="font-medium">₹{order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order #</p>
                    <p className="font-mono text-sm">{order.orderNumber || order.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {order.status}
                    </span>
                    <a
                      href={`/invoice/${order.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-brand-accent hover:underline flex items-center gap-1"
                    >
                      <FileText size={16} />
                      Invoice
                    </a>
                    {canCancel && (
                      <Link
                        href={`/cancel-order/${order.id}`}
                        className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                      >
                        Cancel Order
                      </Link>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-medium">
                          ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
