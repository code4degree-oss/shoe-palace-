'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, ImageIcon, X, Upload, Loader2, EyeOff } from 'lucide-react';
import { compressImage } from '@/lib/image-compression';

interface ResultItem {
  id: string;
  imageUrl: string;
  isActive: boolean;
}

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

export default function ResultsPage() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    imageUrl: '',
    isActive: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/results')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setResults(data);
      })
      .catch(() => {});
  }, []);

  const saveResults = async (updated: ResultItem[]) => {
    setResults(updated);
    setSaving(true);
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const openAddForm = () => {
    setFormData({ imageUrl: '', isActive: true });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const compressedFile = await compressImage(file, 1200, 1200, 0.85);
      const form = new FormData();
      form.append('file', compressedFile);

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (!formData.imageUrl) return;

    const newResult: ResultItem = {
      id: `result-${Date.now()}`,
      imageUrl: formData.imageUrl,
      isActive: formData.isActive,
    };
    const updated = [...results, newResult];
    saveResults(updated);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this image?')) {
      saveResults(results.filter(b => b.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    saveResults(results.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Before & After Results</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage the transformation images shown above the reviews.
            {saving && <span className="ml-2 text-brand-accent font-medium">• Saving...</span>}
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-brand-accent text-brand-dark font-bold px-5 py-2.5 rounded-lg hover:bg-brand-accent-hover transition-colors text-sm"
        >
          <Plus size={18} />
          Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {results.map((result) => (
          <div key={result.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden relative group transition-all ${result.isActive ? 'border-gray-100' : 'border-gray-200 opacity-70'}`}>
            <div className="aspect-square bg-gray-100 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.imageUrl} alt="Result" className="w-full h-full object-cover" />
              {!result.isActive && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <EyeOff size={14} /> Hidden
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-gray-100 flex items-center justify-between bg-white relative z-10">
              <ToggleSwitch isOn={result.isActive} onToggle={() => toggleActive(result.id)} />
              <button onClick={() => handleDelete(result.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center text-gray-400">
            <ImageIcon size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No results images yet</p>
            <p className="text-xs mt-1 text-gray-300">Click &quot;Add Image&quot; to upload your first before/after picture</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Add Result Image</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden group
                    ${formData.imageUrl ? 'border-brand-accent/50 hover:border-brand-accent' : 'border-gray-200 hover:border-brand-accent/50 hover:bg-brand-light/30'}
                    ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2 text-brand-dark">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-sm font-medium">Uploading...</span>
                    </div>
                  ) : formData.imageUrl ? (
                    <div className="relative w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium flex items-center gap-2">
                          <Upload size={16} /> Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Upload size={24} className="group-hover:text-brand-accent transition-colors" />
                      <span className="text-sm font-medium group-hover:text-brand-dark transition-colors">Click to upload image</span>
                      <span className="text-xs text-gray-400">Square dimension (e.g. 800x800)</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-bold text-gray-900">Visibility</p>
                  <p className="text-xs text-gray-500 mt-0.5">Show this image on website?</p>
                </div>
                <ToggleSwitch isOn={formData.isActive} onToggle={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))} />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
              <button 
                onClick={handleSave} 
                disabled={!formData.imageUrl || uploadingImage}
                className="px-5 py-2.5 text-sm font-bold bg-brand-accent text-brand-dark rounded-lg hover:bg-brand-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
