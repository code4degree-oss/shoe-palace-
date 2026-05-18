'use client';

import { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

export default function RevenuePage() {
  const [dailyData, setDailyData] = useState<{ date: string; revenue: number; orders: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetch('/api/admin/revenue')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDailyData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch revenue:', err);
        setLoading(false);
      });
  }, []);

  const filteredData = dailyData.filter(d => {
    if (dateFrom && d.date < dateFrom) return false;
    if (dateTo && d.date > dateTo) return false;
    return true;
  });

  const maxRevenue = Math.max(1, ...filteredData.map(d => d.revenue));
  const totalRevenue = filteredData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = filteredData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Revenue</h2>
        <p className="text-sm text-gray-500 mt-1">Track your store&apos;s financial performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <IndianRupee size={20} className="text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          <p className="text-sm text-gray-500 mt-1">Total Orders</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <IndianRupee size={20} className="text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{avgOrderValue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Avg. Order Value</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={16} />
          Custom Date Range
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          </div>
          <button className="bg-brand-accent text-brand-dark font-bold px-5 py-2.5 rounded-lg hover:bg-brand-accent-hover transition-colors text-sm">
            Apply
          </button>
        </div>
      </div>

      {/* Revenue Chart (CSS bars) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-6">Daily Revenue</h3>
        {filteredData.length > 0 ? (
          <div className="space-y-3">
            {filteredData.map((day) => (
              <div key={day.date} className="flex items-center gap-4">
                <span className="text-xs text-gray-500 w-16 shrink-0">{day.date}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-accent to-brand-accent-hover rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                  >
                    <span className="text-xs font-bold text-brand-dark whitespace-nowrap">₹{day.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 w-20 text-right shrink-0">{day.orders} orders</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400">
            <BarChart3 size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">No revenue data yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
