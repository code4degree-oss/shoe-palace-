'use client';

import { useState, useEffect } from 'react';
import { Package, TrendingUp, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface AnalyticsRow {
  id: string;
  name: string;
  image: string;
  sku: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load analytics', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Track your best performing products</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <TrendingUp size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Top Selling Products</h3>
            <p className="text-sm text-gray-500">Ranked by total quantity sold</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider w-16">Rank</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">SKU</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Units Sold</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-400">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} width={40} height={40} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package size={16} className="text-gray-300" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {item.sku}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                      {item.totalQuantitySold}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    ₹{item.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Package size={40} className="mb-3 opacity-30" />
              <p className="text-sm">No sales data available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
