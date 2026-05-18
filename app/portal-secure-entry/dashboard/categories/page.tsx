'use client';

import { Layers, Plus, Trash2, Loader2, Edit2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { compressImage } from '@/lib/image-compression';

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
      const compressedFile = await compressImage(file, 800, 800, 0.85);
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
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
      <input type="file" ref={fileRef} accept="image/*" onChange={handleFile} className="hidden" />
      
      <div 
        onClick={() => fileRef.current?.click()}
        className={`relative w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-all ${
          currentImage ? 'border-brand-accent/50 bg-brand-light/20' : 'border-gray-200 hover:border-brand-accent/50 hover:bg-brand-light/10'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center text-brand-blue">
            <Loader2 size={24} className="animate-spin mb-2" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        ) : currentImage ? (
          <>
            <img src={currentImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-bold text-brand-dark shadow-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
              Change Image
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-400 group-hover:text-brand-blue transition-colors">
            <Plus size={24} className="mb-2" />
            <span className="text-sm font-medium">Click to upload</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  image?: string;
  products: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState('');
  const [saving, setSaving] = useState(false);

  // Load categories from API
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openAddForm = () => {
    setEditingCategoryId(null);
    setNewName('');
    setNewImage('');
    setShowForm(true);
  };

  const openEditForm = (cat: CategoryRow) => {
    setEditingCategoryId(cat.id);
    setNewName(cat.name);
    setNewImage(cat.image || '');
    setShowForm(true);
  };

  const saveCategory = async () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setSaving(true);
    try {
      if (editingCategoryId) {
        // Edit existing
        const res = await fetch(`/api/categories/${editingCategoryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName, slug, image: newImage }),
        });
        const updatedCat = await res.json();
        if (res.ok) {
          setCategories(categories.map(c => c.id === editingCategoryId ? { ...c, name: updatedCat.name, slug: updatedCat.slug, image: updatedCat.image } : c));
          setShowForm(false);
        } else {
          alert(updatedCat.error || 'Failed to update category');
        }
      } else {
        // Add new
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName, slug, image: newImage }),
        });
        const newCat = await res.json();
        if (res.ok) {
          setCategories([...categories, newCat]);
          setNewName('');
          setNewImage('');
          setShowForm(false);
        } else {
          alert(newCat.error || 'Failed to create category');
        }
      }
    } catch {
      alert(`Failed to ${editingCategoryId ? 'update' : 'create'} category`);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-brand-accent text-brand-dark font-bold px-5 py-2.5 rounded-lg hover:bg-brand-accent-hover transition-colors text-sm"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <Layers size={20} className="text-brand-blue opacity-50" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{cat.name}</h3>
                  <p className="text-xs text-gray-400">/{cat.slug}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => openEditForm(cat)}
                  className="text-gray-300 hover:text-brand-blue p-1"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-gray-300 hover:text-red-500 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">{cat.products} products</p>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center text-gray-400">
          <Layers size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No categories yet</p>
          <p className="text-xs mt-1 text-gray-300">Click &quot;Add Category&quot; to create your first category</p>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingCategoryId ? 'Edit Category' : 'Add Category'}</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name"
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 mb-4"
              onKeyDown={(e) => e.key === 'Enter' && saveCategory()}
            />
            
            <ImageUploader 
              label="Category Image" 
              currentImage={newImage} 
              dimension="Square format"
              onImageSelect={setNewImage} 
            />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button 
                onClick={saveCategory} 
                disabled={saving}
                className="px-5 py-2 text-sm font-bold bg-brand-accent text-brand-dark rounded-lg hover:bg-brand-accent-hover disabled:opacity-50"
              >
                {saving ? 'Saving...' : (editingCategoryId ? 'Save Changes' : 'Add Category')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
