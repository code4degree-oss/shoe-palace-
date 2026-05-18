'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Package, Users, IndianRupee, Clock, ArrowUpRight } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  PACKED: 'bg-yellow-100 text-yellow-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
      </div>
      <div className="h-7 bg-gray-200 rounded w-24 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-32" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-8" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16" /></td>
      <td className="px-6 py-4"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
    </tr>
  );
}

export default function DashboardHomePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Today's Revenue", value: '₹0', change: '', icon: IndianRupee, color: 'bg-emerald-500' },
    { label: "Today's Orders", value: '0', change: '', icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Total Products', value: '0', change: '', icon: Package, color: 'bg-purple-500' },
    { label: 'Total Customers', value: '0', change: '', icon: Users, color: 'bg-orange-500' },
  ]);
  const [recentOrders, setRecentOrders] = useState<{ id: string; customer: string; items: number; total: number; status: string; date: string }[]>([]);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setStats([
            { label: "Today's Revenue", value: `₹${data.revenueToday.toLocaleString()}`, change: '', icon: IndianRupee, color: 'bg-emerald-500' },
            { label: "Today's Orders", value: data.ordersTodayCount.toString(), change: '', icon: ShoppingCart, color: 'bg-blue-500' },
            { label: 'Total Products', value: data.totalProducts.toString(), change: '', icon: Package, color: 'bg-purple-500' },
            { label: 'Total Customers', value: data.totalCustomers.toString(), change: '', icon: Users, color: 'bg-orange-500' },
          ]);
          setRecentOrders(data.recentOrders);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {loading ? (
          <>
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </>
        ) : (
          stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                {stat.change && (
                  <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight size={12} />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link href="/portal-secure-entry/dashboard/orders" className="text-sm font-medium text-brand-blue hover:underline flex items-center gap-1">
            View All <ArrowUpRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Items</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <SkeletonRow /><SkeletonRow /><SkeletonRow />
              </tbody>
            </table>
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Items</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-600">{order.items}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400">
            <ShoppingCart size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">No orders yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/portal-secure-entry/dashboard/orders" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Clock size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Pending Orders</p>
              <p className="text-sm text-gray-500">View orders needing packing</p>
            </div>
          </div>
        </Link>
        <Link href="/portal-secure-entry/dashboard/reviews" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
              <ArrowUpRight size={20} className="text-yellow-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Pending Reviews</p>
              <p className="text-sm text-gray-500">Approve customer reviews</p>
            </div>
          </div>
        </Link>
        <Link href="/portal-secure-entry/dashboard/products" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <Package size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Add Product</p>
              <p className="text-sm text-gray-500">Add new items to your store</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
