'use client';

import { useState, useEffect } from 'react';
import { Search, Users, Phone, MapPin, ShoppingBag } from 'lucide-react';

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCustomers(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch customers:', err);
        setLoading(false);
      });
  }, []);

  const states = ['all', ...new Set(customers.map(c => c.state).filter(Boolean))];

  const filtered = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone && c.phone.includes(search));
    const matchesState = stateFilter === 'all' || c.state === stateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <p className="text-sm text-gray-500 mt-1">{customers.length} registered customers</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
          />
        </div>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
        >
          {states.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All States' : s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Orders</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Total Spent</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-brand-dark">{c.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 flex items-center gap-1.5">
                    <Phone size={13} className="text-gray-400" />
                    {c.phone}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-gray-400" />
                      {c.city}, {c.state}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-900">{c.totalOrders}</td>
                  <td className="px-5 py-4 font-bold text-gray-900">₹{c.totalSpent.toLocaleString()}</td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{c.lastOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
