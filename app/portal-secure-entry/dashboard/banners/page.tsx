'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Trash2, ExternalLink, ImageIcon, Edit2, X, Info, Monitor, Smartphone, Upload, EyeOff, Loader2 } from 'lucide-react';
import { compressImage } from '@/lib/image-compression';

type BannerSlot = 'hero' | 'mid' | 'bottom-left' | 'bottom-right';

interface BannerItem {
  id: string;
  slot: BannerSlot;
  imageUrl: string;
  mobileImageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  linkedProductId: string;
  linkedProductName: string;
  showText?: boolean;
  isActive: boolean;
}

const SLOT_CONFIG: Record<BannerSlot, { label: string; desc: string; desktopDim: string; mobileDim: string }> = {
  hero: {
    label: 'Hero Slider',
    desc: 'Full-width top banner. You can add multiple — they auto-slide.',
    desktopDim: '1400 × 600 px',
    mobileDim: '800 × 1000 px',
  },
  mid: {
    label: 'Mid Banner',
    desc: 'Full-width banner between Bestsellers and New Arrivals.',
    desktopDim: '1400 × 500 px',
    mobileDim: '800 × 500 px',
  },
  'bottom-left': {
    label: 'Bottom Left',
    desc: 'Left side of the two-column banner near the bottom.',
    desktopDim: '700 × 400 px',
    mobileDim: '800 × 400 px',
  },
  'bottom-right': {
    label: 'Bottom Right',
    desc: 'Right side of the two-column banner near the bottom.',
    desktopDim: '700 × 400 px',
    mobileDim: '800 × 400 px',
  },
};

// AVAILABLE_PRODUCTS is now loaded from the API — see useEffect below

// Toggle Switch
function ToggleSwitch({ isOn, onToggle, label }: { isOn: boolean; onToggle: () => void; label?: string }) {
  return (
    <button onClick={onToggle} className="flex items-center gap-2.5 group" type="button">
      <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isOn ? 'bg-green-500' : 'bg-gray-300'}`}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      {label && (
        <span className={`text-sm font-medium ${isOn ? 'text-green-600' : 'text-gray-400'}`}>
          {isOn ? 'ON' : 'OFF'}
        </span>
      )}
    </button>
  );
}

// Image Uploader — uploads to /api/upload and returns a real URL
function ImageUploader({ label, currentImage, dimension, onImageSelect }: {
  label: string;
  currentImage: string;
  dimension: string;
  onImageSelect: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressedFile = await compressImage(file, 1600, 1600, 0.85);
      const formData = new FormData();
      formData.append('file', compressedFile);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        onImageSelect(data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
      <p className="text-[11px] text-gray-400 mb-2">Recommended: <strong>{dimension}</strong> • JPG or PNG</p>
      <input type="file" ref={fileRef} accept="image/*" onChange={handleFile} className="hidden" />

      {uploading ? (
        <div className="w-full border-2 border-dashed border-brand-accent/30 rounded-lg p-6 text-center">
          <Loader2 size={24} className="mx-auto text-brand-accent animate-spin mb-2" />
          <p className="text-sm text-gray-500">Uploading...</p>
        </div>
      ) : currentImage ? (
        <div className="relative rounded-lg overflow-hidden h-32 bg-gray-100 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="bg-white text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-100"
              type="button"
            >
              Change Image
            </button>
            <button
              onClick={() => onImageSelect('')}
              className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600"
              type="button"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-brand-accent/50 transition-colors cursor-pointer group"
          type="button"
        >
          <Upload size={24} className="mx-auto text-gray-300 mb-2 group-hover:text-brand-accent transition-colors" />
          <p className="text-sm text-gray-500 font-medium">Click to upload image</p>
          <p className="text-xs text-gray-300 mt-1">{dimension}</p>
        </button>
      )}
    </div>
  );
}

export default function BannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [activeSlotFilter, setActiveSlotFilter] = useState<BannerSlot | 'all'>('all');
  const [saving, setSaving] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState({
    slot: 'hero' as BannerSlot,
    imageUrl: '',
    mobileImageUrl: '',
    title: '',
    subtitle: '',
    buttonText: 'Shop Now',
    linkedProductId: '',
    showText: true,
  });

  // Load banners + products/categories from API on mount
  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => setBanners(data))
      .catch(() => {});

    // Load products and categories for the link dropdown
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([products, categories]) => {
      const prodOptions = (products || []).map((p: { id: string; name: string }) => ({
        id: p.id,
        name: p.name,
      }));
      const catOptions = (categories || []).map((c: { id: string; name: string; slug: string }) => ({
        id: `cat-${c.slug}`,
        name: `→ ${c.name} (Category)`,
      }));
      setAvailableProducts([...prodOptions, ...catOptions]);
    }).catch(() => {});
  }, []);

  // Save banners to API
  const saveBanners = useCallback(async (updated: BannerItem[]) => {
    setBanners(updated);
    setSaving(true);
    try {
      await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }, []);

  const openAddForm = (slot?: BannerSlot) => {
    setEditingBanner(null);
    setFormData({
      slot: slot || 'hero',
      imageUrl: '',
      mobileImageUrl: '',
      title: '',
      subtitle: '',
      buttonText: 'Shop Now',
      linkedProductId: '',
      showText: true,
    });
    setShowForm(true);
  };

  const openEditForm = (banner: BannerItem) => {
    setEditingBanner(banner);
    setFormData({
      slot: banner.slot,
      imageUrl: banner.imageUrl,
      mobileImageUrl: banner.mobileImageUrl,
      title: banner.title,
      subtitle: banner.subtitle,
      buttonText: banner.buttonText,
      linkedProductId: banner.linkedProductId,
      showText: banner.showText !== false, // default true
    });
    setShowForm(true);
  };

  const handleSave = () => {
    const linkedProduct = availableProducts.find(p => p.id === formData.linkedProductId);
    let updated: BannerItem[];
    if (editingBanner) {
      updated = banners.map(b => b.id === editingBanner.id ? {
        ...b,
        ...formData,
        linkedProductName: linkedProduct?.name || '',
      } : b);
    } else {
      const newBanner: BannerItem = {
        id: `ban-${Date.now()}`,
        ...formData,
        linkedProductName: linkedProduct?.name || '',
        isActive: true,
      };
      updated = [...banners, newBanner];
    }
    saveBanners(updated);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this banner?')) {
      saveBanners(banners.filter(b => b.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    saveBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const filtered = activeSlotFilter === 'all' ? banners : banners.filter(b => b.slot === activeSlotFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Banners</h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload images, set button text, link to products, and toggle ON/OFF
            {saving && <span className="ml-2 text-brand-accent font-medium">• Saving...</span>}
          </p>
        </div>
        <button
          onClick={() => openAddForm()}
          className="flex items-center gap-2 bg-brand-accent text-brand-dark font-bold px-5 py-2.5 rounded-lg hover:bg-brand-accent-hover transition-colors text-sm"
        >
          <Plus size={18} />
          Add Banner
        </button>
      </div>

      {/* Dimension Guide */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Info size={16} className="text-blue-500" />
          Where do banners appear on the website?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.entries(SLOT_CONFIG) as [BannerSlot, typeof SLOT_CONFIG['hero']][]).map(([key, config]) => (
            <div key={key} className="border border-gray-100 rounded-lg p-4 hover:border-brand-accent/30 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{config.label}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{config.desc}</p>
                </div>
                <button
                  onClick={() => openAddForm(key)}
                  className="text-brand-accent hover:text-brand-accent-hover shrink-0 ml-3"
                  title={`Add ${config.label}`}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Monitor size={12} className="text-gray-400" />
                  <strong className="text-gray-700">{config.desktopDim}</strong>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Smartphone size={12} className="text-gray-400" />
                  <strong className="text-gray-700">{config.mobileDim}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {[
          { key: 'all' as const, label: 'All' },
          ...Object.entries(SLOT_CONFIG).map(([k, v]) => ({ key: k as BannerSlot, label: v.label })),
        ].map((tab) => {
          const count = tab.key === 'all' ? banners.length : banners.filter(b => b.slot === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSlotFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeSlotFilter === tab.key ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-500 hover:bg-white/50'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {filtered.map((banner) => {
          const slotInfo = SLOT_CONFIG[banner.slot];
          return (
            <div key={banner.id} className={`bg-white rounded-xl shadow-sm border transition-all ${banner.isActive ? 'border-gray-100' : 'border-gray-200 opacity-50'}`}>
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* Preview */}
                <div className="w-full md:w-48 h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                  {banner.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  {!banner.isActive && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <EyeOff size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 rounded-full">
                      {slotInfo.label}
                    </span>
                    <h3 className="font-bold text-gray-900 truncate">{banner.title || 'Untitled Banner'}</h3>
                  </div>
                  {banner.subtitle && <p className="text-xs text-gray-400 mb-2">{banner.subtitle}</p>}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {banner.showText !== false && (
                      <span className="bg-brand-accent/10 text-brand-dark font-medium px-2 py-0.5 rounded">
                        Button: &quot;{banner.buttonText}&quot;
                      </span>
                    )}
                    {!banner.showText && banner.showText !== undefined && (
                      <span className="bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded">
                        Text Overlay Hidden
                      </span>
                    )}
                    {banner.linkedProductName && (
                      <span className="bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded flex items-center gap-1">
                        <ExternalLink size={10} />
                        {banner.linkedProductName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 shrink-0 md:flex-col md:items-end md:justify-between">
                  <ToggleSwitch isOn={banner.isActive} onToggle={() => toggleActive(banner.id)} label="show" />
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditForm(banner)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(banner.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center text-gray-400">
            <ImageIcon size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No banners yet</p>
            <p className="text-xs mt-1 text-gray-300">Click &quot;Add Banner&quot; to upload your first banner image</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Where should this banner appear?</label>
                <select
                  value={formData.slot}
                  onChange={(e) => setFormData({ ...formData, slot: e.target.value as BannerSlot })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 bg-white"
                >
                  {(Object.entries(SLOT_CONFIG) as [BannerSlot, typeof SLOT_CONFIG['hero']][]).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              <ImageUploader
                label="Desktop Banner Image"
                currentImage={formData.imageUrl}
                dimension={SLOT_CONFIG[formData.slot].desktopDim}
                onImageSelect={(url) => setFormData({ ...formData, imageUrl: url })}
              />
              <ImageUploader
                label="Mobile Banner Image"
                currentImage={formData.mobileImageUrl}
                dimension={SLOT_CONFIG[formData.slot].mobileDim}
                onImageSelect={(url) => setFormData({ ...formData, mobileImageUrl: url })}
              />

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Headline Text</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Buy 2, Get 1 Free" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Subtitle (optional)</label>
                <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} placeholder="e.g. Limited time offer" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Button Text</label>
                <input type="text" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} placeholder="Shop Now" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
                <p className="text-xs text-gray-400 mt-1">e.g. &quot;Shop Now&quot;, &quot;View Combo&quot;, &quot;Buy Now&quot;</p>
              </div>

              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Show Text & Button Overlay</h4>
                  <p className="text-xs text-gray-500 mt-0.5">If OFF, the banner will just be the image (the whole image will be clickable).</p>
                </div>
                <ToggleSwitch isOn={formData.showText} onToggle={() => setFormData({ ...formData, showText: !formData.showText })} />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">When button is clicked, go to...</label>
                <select value={formData.linkedProductId} onChange={(e) => setFormData({ ...formData, linkedProductId: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 bg-white">
                  <option value="">— No redirect —</option>
                  <optgroup label="Products">
                    {availableProducts.filter(p => !p.id.startsWith('cat-')).map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Category Pages">
                    {availableProducts.filter(p => p.id.startsWith('cat-')).map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm font-bold bg-brand-accent text-brand-dark rounded-lg hover:bg-brand-accent-hover transition-colors">
                {editingBanner ? 'Save Changes' : 'Add Banner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
