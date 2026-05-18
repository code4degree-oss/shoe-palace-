'use client';

import { useState, useEffect } from 'react';
import { Truck, Save } from 'lucide-react';

export default function DeliveryPage() {
  const [maharashtraCharge, setMaharashtraCharge] = useState('');
  const [outsideCharge, setOutsideCharge] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/delivery-zones')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setMaharashtraCharge(data.maharashtra.toString());
          setOutsideCharge(data.outside.toString());
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/admin/delivery-zones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maharashtra: maharashtraCharge, outside: outsideCharge })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Delivery Zones</h2>
        <p className="text-sm text-gray-500 mt-1">Configure delivery charges based on pincode</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Truck size={20} className="text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Shipping Charges</h3>
            <p className="text-xs text-gray-500">Based on delivery zone (Maharashtra vs Outside)</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
            Maharashtra (Pincode starts with 4xxxxx)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
            <input
              type="number"
              value={maharashtraCharge}
              onChange={(e) => setMaharashtraCharge(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
            Outside Maharashtra (All other pincodes)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
            <input
              type="number"
              value={outsideCharge}
              onChange={(e) => setOutsideCharge(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
          <strong>How it works:</strong> Indian pincodes starting with <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-mono">4</code> belong to Maharashtra. All other pincodes are charged the outside rate.
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-brand-accent text-brand-dark font-bold px-6 py-3 rounded-lg hover:bg-brand-accent-hover transition-colors text-sm"
        >
          <Save size={16} />
          {saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
