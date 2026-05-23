'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, GripVertical, Package, X, Upload, Loader2 } from 'lucide-react';
import { compressImage } from '@/lib/image-compression';

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ProductRow {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  price: number;
  salePrice: number;
  stock: number;
  weightGrams: number;
  displayWeight: number;
  weightUnit: string;
  shippingWeightGrams: number;
  image: string;
  badge: string | null;
  sku: string | null;
  position: number;
  howToUse?: string | null;
  ingredients?: string | null;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  colorImages?: any;
  variantPrices?: any;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    stock: '',
    weightGrams: '',
    displayWeight: '',
    weightUnit: 'g',
    shippingWeightGrams: '',
    categoryId: '',
    image: '',
    badge: '',
    sku: '',
    howToUse: '',
    ingredients: '',
    images: [] as string[],
    sizes: '',
    colors: '',
    colorImages: {} as any,
    variantPrices: [] as any[],
  });

  // Load products & categories on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      salePrice: '',
      stock: '',
      weightGrams: '',
      displayWeight: '',
      weightUnit: 'g',
      shippingWeightGrams: '',
      categoryId: categories[0]?.id || '',
      image: '',
      badge: '',
      sku: '',
      howToUse: '',
      ingredients: '',
      images: [],
      sizes: '',
      colors: '',
      colorImages: {},
      variantPrices: [],
    });
    setShowForm(true);
  };

  const openEditForm = (product: ProductRow) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      salePrice: product.salePrice.toString(),
      stock: product.stock.toString(),
      weightGrams: product.weightGrams.toString(),
      displayWeight: (product.displayWeight || 0).toString(),
      weightUnit: product.weightUnit || 'g',
      shippingWeightGrams: (product.shippingWeightGrams || 0).toString(),
      categoryId: product.categoryId,
      image: product.image,
      badge: product.badge || '',
      sku: product.sku || '',
      howToUse: product.howToUse || '',
      ingredients: product.ingredients || '',
      images: product.images || [],
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      colorImages: typeof product.colorImages === 'string' ? JSON.parse(product.colorImages || '{}') : (product.colorImages || {}),
      variantPrices: typeof product.variantPrices === 'string' ? JSON.parse(product.variantPrices || '[]') : (product.variantPrices || []),
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressedFile = await compressImage(file, 1000, 1000, 0.85);
      const fd = new FormData();
      fd.append('file', compressedFile);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, image: data.url });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressedFile = await compressImage(file, 1000, 1000, 0.85);
      const fd = new FormData();
      fd.append('file', compressedFile);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, images: [...formData.images, data.url] });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.salePrice || !formData.categoryId) {
      alert('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const updated = await res.json();
        if (res.ok) {
          setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
        } else {
          alert(updated.error || 'Failed to update');
        }
      } else {
        // Create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const created = await res.json();
        if (res.ok) {
          setProducts([...products, created]);
        } else {
          alert(created.error || 'Failed to create');
        }
      }
      setShowForm(false);
    } catch {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Failed to delete');
    }
  };

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newProducts = [...products];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProducts.length) return;
    [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];
    setProducts(newProducts);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand-black" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-1">{products.length} products in store</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-brand-black text-brand-dark font-bold px-5 py-2.5 rounded-none hover:bg-brand-black-hover transition-colors text-sm"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30 focus:border-brand-black/50"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider w-10"></th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">MRP</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Sale Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Weight</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Badge</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveProduct(index, 'up')} className="text-gray-300 hover:text-gray-500 transition-colors" title="Move up">
                        <GripVertical size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-none object-cover bg-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-none bg-gray-100 flex items-center justify-center">
                          <Package size={16} className="text-gray-300" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-brand-light text-brand-blue">
                      {product.categoryName || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 line-through">₹{product.price}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">₹{product.salePrice}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <div>
                      <span>{product.displayWeight || product.weightGrams}{product.weightUnit || 'g'}</span>
                      <span className="text-[10px] text-gray-400 block">Ship: {product.shippingWeightGrams || product.weightGrams}g</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {product.badge ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-black/15 text-brand-dark">
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditForm(product)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-none transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-none transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-none shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  className="w-full border border-gray-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description"
                  rows={3}
                  className="w-full border border-gray-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g. BHR-OIL-100"
                  className="w-full border border-gray-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">MRP (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="599"
                    className="w-full border border-gray-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Sale Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="449"
                    className="w-full border border-gray-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="25"
                    className="w-full border border-gray-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Product Weight *</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.displayWeight}
                      onChange={(e) => setFormData({ ...formData, displayWeight: e.target.value })}
                      placeholder="100"
                      className="flex-1 border border-gray-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30"
                    />
                    <select
                      value={formData.weightUnit}
                      onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                      className="w-20 border border-gray-200 rounded-none px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30 bg-white"
                    >
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Shown to customer (e.g. 100ml for oil)</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Shipping Weight (Product + Packaging) in grams *</label>
                <input
                  type="number"
                  value={formData.shippingWeightGrams}
                  onChange={(e) => setFormData({ ...formData, shippingWeightGrams: e.target.value })}
                  placeholder="250"
                  className="w-full border border-gray-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30"
                />
                <p className="text-[10px] text-gray-400 mt-1">Used for India Post shipping calculations (include box weight)</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30 bg-white"
                  >
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Badge</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30 bg-white"
                  >
                    <option value="">No Badge</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Sale">Sale</option>
                    <option value="Limited">Limited Edition</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Product Image</label>
                <input type="file" ref={fileRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                {uploading ? (
                  <div className="border-2 border-dashed border-brand-black/30 rounded-none p-6 text-center">
                    <Loader2 size={24} className="mx-auto text-brand-black animate-spin mb-2" />
                    <p className="text-sm text-gray-500">Uploading...</p>
                  </div>
                ) : formData.image ? (
                  <div className="relative rounded-none overflow-hidden h-32 bg-gray-100 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="bg-white text-gray-700 text-xs font-bold px-3 py-1.5 rounded-none hover:bg-gray-100"
                        type="button"
                      >
                        Change
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-none hover:bg-red-600"
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 rounded-none p-6 text-center hover:border-brand-black/50 transition-colors cursor-pointer"
                    type="button"
                  >
                    <Upload size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload</p>
                    <p className="text-xs text-gray-300 mt-1">PNG, JPG up to 5MB</p>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Additional Gallery Images</label>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative rounded-none overflow-hidden h-24 bg-gray-100 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => removeGalleryImage(idx)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                          type="button"
                          title="Remove Image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {uploading && (
                    <div className="border-2 border-dashed border-brand-black/30 rounded-none h-24 flex items-center justify-center">
                      <Loader2 size={20} className="text-brand-black animate-spin" />
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <input type="file" id="gallery-upload" accept="image/*" onChange={handleGalleryImageUpload} className="hidden" />
                  <label
                    htmlFor="gallery-upload"
                    className="w-full border-2 border-dashed border-gray-200 rounded-none p-3 text-center hover:border-brand-black/50 transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm text-gray-500"
                  >
                    <Plus size={16} /> Add Gallery Image
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">How to Use</label>
                <textarea
                  value={formData.howToUse}
                  onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30 resize-none whitespace-pre-wrap"
                  placeholder="E.g., Apply directly to scalp..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Ingredients</label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30 resize-none whitespace-pre-wrap"
                  placeholder="E.g., Onion Extract, Coconut Oil..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Sizes (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30"
                    placeholder="E.g., 7, 8, 9, 10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Colors (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-black/30"
                    placeholder="E.g., Black, White, Red"
                  />
                </div>
              </div>

              {formData.colors && formData.colors.length > 0 && formData.sizes && formData.sizes.length > 0 && (
                <div className="bg-gray-50 p-4 border border-gray-200 mt-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Variant Pricing (Optional)</h4>
                  <p className="text-xs text-gray-500 mb-4">Set specific prices for color and size combinations. If left blank, default MRP and Sale Price will be used.</p>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {formData.colors.split(',').map(c => c.trim()).filter(Boolean).map(color => (
                      formData.sizes.split(',').map(s => s.trim()).filter(Boolean).map(size => {
                        const existing = formData.variantPrices.find((v: any) => v.color === color && v.size === size) || { price: '', salePrice: '' };
                        return (
                          <div key={`${color}-${size}`} className="flex items-center gap-3 bg-white p-2 border border-gray-100">
                            <div className="w-1/3 text-sm font-medium text-gray-700">{color} - UK {size}</div>
                            <input 
                              type="number" 
                              placeholder="MRP ₹" 
                              value={existing.price}
                              onChange={(e) => {
                                const newPrices = [...formData.variantPrices];
                                const idx = newPrices.findIndex(v => v.color === color && v.size === size);
                                if (idx >= 0) newPrices[idx].price = e.target.value;
                                else newPrices.push({ color, size, price: e.target.value, salePrice: existing.salePrice });
                                setFormData({ ...formData, variantPrices: newPrices });
                              }}
                              className="w-1/3 border border-gray-200 px-2 py-1.5 text-sm"
                            />
                            <input 
                              type="number" 
                              placeholder="Sale ₹" 
                              value={existing.salePrice}
                              onChange={(e) => {
                                const newPrices = [...formData.variantPrices];
                                const idx = newPrices.findIndex(v => v.color === color && v.size === size);
                                if (idx >= 0) newPrices[idx].salePrice = e.target.value;
                                else newPrices.push({ color, size, price: existing.price, salePrice: e.target.value });
                                setFormData({ ...formData, variantPrices: newPrices });
                              }}
                              className="w-1/3 border border-gray-200 px-2 py-1.5 text-sm"
                            />
                          </div>
                        );
                      })
                    ))}
                  </div>
                </div>
              )}

              {formData.colors && formData.colors.length > 0 && (
                <div className="bg-gray-50 p-4 border border-gray-200 mt-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Color Images (Optional)</h4>
                  <p className="text-xs text-gray-500 mb-4">Paste image URLs for specific colors. If empty, gallery images match colors sequentially.</p>
                  <div className="space-y-2">
                    {formData.colors.split(',').map(c => c.trim()).filter(Boolean).map(color => (
                      <div key={color} className="flex items-center gap-3 bg-white p-2 border border-gray-100">
                        <div className="w-1/3 text-sm font-medium text-gray-700">{color}</div>
                        <input 
                          type="text" 
                          placeholder="Image URL..." 
                          value={formData.colorImages[color]?.[0] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            const newColorImages = { ...formData.colorImages };
                            if (val) newColorImages[color] = [val];
                            else delete newColorImages[color];
                            setFormData({ ...formData, colorImages: newColorImages });
                          }}
                          className="w-2/3 border border-gray-200 px-2 py-1.5 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-bold bg-brand-black text-brand-dark rounded-none hover:bg-brand-black-hover transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
