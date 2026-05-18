'use client';

import { Settings, Save, Trash2, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

const CLEAR_SECTIONS = [
  { key: 'banners', label: 'Banners', desc: 'Clear all banner images & config' },
  { key: 'uploads', label: 'Uploaded Images', desc: 'Delete all images from /uploads folder' },
  { key: 'reviews', label: 'Reviews', desc: 'Delete all customer reviews' },
  { key: 'orders', label: 'Orders', desc: 'Delete all orders & order items' },
  { key: 'products', label: 'Products & Combos', desc: 'Delete all products, combos & gallery images' },
  { key: 'categories', label: 'Categories', desc: 'Delete all categories (requires products to be cleared)' },
  { key: 'customers', label: 'Customers', desc: 'Delete all customer accounts (requires orders to be cleared)' },
  { key: 'faqs', label: 'FAQs', desc: 'Clear all FAQ entries' },
  { key: 'results', label: 'Results (Before/After)', desc: 'Clear all before/after result images' },
];

export default function SettingsPage() {
  const [storeName, setStoreName] = useState('Shoe Place Herbal Products');
  const [cancelHours, setCancelHours] = useState('4');
  const [saved, setSaved] = useState(false);

  // Clear database state
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [confirmText, setConfirmText] = useState('');
  const [clearing, setClearing] = useState(false);
  const [clearResult, setClearResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleSection = (key: string) => {
    setSelectedSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    setClearResult(null);
  };

  const selectAll = () => {
    if (selectedSections.length === CLEAR_SECTIONS.length) {
      setSelectedSections([]);
    } else {
      setSelectedSections(CLEAR_SECTIONS.map((s) => s.key));
    }
    setClearResult(null);
  };

  const handleClearDatabase = async () => {
    if (confirmText !== 'DELETE') return;
    if (selectedSections.length === 0) return;

    setClearing(true);
    setClearResult(null);

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('admin_token='))
        ?.split('=')[1];

      const res = await fetch('/api/admin/clear-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sections: selectedSections }),
      });

      const data = await res.json();

      if (res.ok) {
        setClearResult({ success: true, message: data.message });
        setSelectedSections([]);
        setConfirmText('');
      } else {
        setClearResult({ success: false, message: data.error || 'Something went wrong' });
      }
    } catch {
      setClearResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Store configuration & database management</p>
      </div>

      {/* ── Store Settings ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg space-y-5">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <Settings size={18} className="text-gray-400" />
          Store Configuration
        </h3>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Order Cancel Window (hours)</label>
          <input
            type="number"
            value={cancelHours}
            onChange={(e) => setCancelHours(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
          />
          <p className="text-xs text-gray-400 mt-1">Customers can cancel orders within this many hours of placing</p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-brand-accent text-brand-dark font-bold px-6 py-3 rounded-lg hover:bg-brand-accent-hover transition-colors text-sm"
        >
          <Save size={16} />
          {saved ? 'Saved ✓' : 'Save Settings'}
        </button>
      </div>

      {/* ── Reset Database ── */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">Reset Database</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Select what you want to clear before launching. This action is <span className="text-red-600 font-semibold">irreversible</span>.
            </p>
          </div>
        </div>

        {/* Section selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Select sections to clear</span>
            <button
              onClick={selectAll}
              className="text-xs font-medium text-brand-accent hover:underline"
            >
              {selectedSections.length === CLEAR_SECTIONS.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CLEAR_SECTIONS.map((section) => {
              const isSelected = selectedSections.includes(section.key);
              return (
                <button
                  key={section.key}
                  onClick={() => toggleSection(section.key)}
                  className={`text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-red-300 bg-red-50/50'
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-red-500 border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${isSelected ? 'text-red-700' : 'text-gray-700'}`}>
                      {section.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-6">{section.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirmation */}
        {selectedSections.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-800">
                You are about to permanently delete <strong>{selectedSections.length}</strong> section(s).
                Type <strong className="font-mono">DELETE</strong> below to confirm.
              </p>
            </div>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="w-full max-w-xs border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 font-mono"
            />

            <button
              onClick={handleClearDatabase}
              disabled={confirmText !== 'DELETE' || clearing}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                confirmText === 'DELETE' && !clearing
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {clearing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Clear Selected Data
                </>
              )}
            </button>
          </div>
        )}

        {/* Result message */}
        {clearResult && (
          <div
            className={`flex items-start gap-2 p-4 rounded-lg border ${
              clearResult.success
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {clearResult.success ? (
              <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{clearResult.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
