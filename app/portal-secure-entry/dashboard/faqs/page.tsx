'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, ChevronUp, ChevronDown, MessageCircle } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
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

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  });

  useEffect(() => {
    fetch('/api/faqs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFaqs(data);
      })
      .catch(() => {});
  }, []);

  const saveFaqs = async (updated: FAQ[]) => {
    setFaqs(updated);
    setSaving(true);
    try {
      await fetch('/api/faqs', {
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
    setEditingFaq(null);
    setFormData({ question: '', answer: '' });
    setShowForm(true);
  };

  const openEditForm = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.question.trim() || !formData.answer.trim()) return;

    let updated: FAQ[];
    if (editingFaq) {
      updated = faqs.map(f => f.id === editingFaq.id ? { ...f, ...formData } : f);
    } else {
      const newFaq: FAQ = {
        id: `faq-${Date.now()}`,
        question: formData.question,
        answer: formData.answer,
        isActive: true,
      };
      updated = [...faqs, newFaq];
    }
    saveFaqs(updated);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this FAQ?')) {
      saveFaqs(faqs.filter(f => f.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    saveFaqs(faqs.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === faqs.length - 1) return;

    const newFaqs = [...faqs];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newFaqs[index], newFaqs[swapIndex]] = [newFaqs[swapIndex], newFaqs[index]];
    saveFaqs(newFaqs);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">FAQs</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage the Frequently Asked Questions shown below the reviews.
            {saving && <span className="ml-2 text-brand-accent font-medium">• Saving...</span>}
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-brand-accent text-brand-dark font-bold px-5 py-2.5 rounded-lg hover:bg-brand-accent-hover transition-colors text-sm"
        >
          <Plus size={18} />
          Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq.id} className={`bg-white rounded-xl shadow-sm border transition-all ${faq.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
            <div className="flex flex-col md:flex-row gap-4 p-5">
              <div className="flex flex-col gap-1 items-center justify-center text-gray-400 shrink-0 border-r border-gray-100 pr-4 hidden md:flex">
                <button onClick={() => moveFaq(index, 'up')} disabled={index === 0} className="hover:text-blue-500 disabled:opacity-30 disabled:hover:text-gray-400">
                  <ChevronUp size={20} />
                </button>
                <span className="text-xs font-medium">{index + 1}</span>
                <button onClick={() => moveFaq(index, 'down')} disabled={index === faqs.length - 1} className="hover:text-blue-500 disabled:opacity-30 disabled:hover:text-gray-400">
                  <ChevronDown size={20} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-start gap-2">
                  <span className="text-gray-400 mt-1"><MessageCircle size={16} /></span>
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap pl-6">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0 md:flex-col md:items-end md:justify-between border-t border-gray-100 md:border-t-0 pt-4 md:pt-0">
                <ToggleSwitch isOn={faq.isActive} onToggle={() => toggleActive(faq.id)} label="show" />
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditForm(faq)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(faq.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center text-gray-400">
            <MessageCircle size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No FAQs yet</p>
            <p className="text-xs mt-1 text-gray-300">Click &quot;Add FAQ&quot; to create your first question and answer</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Question</label>
                <input 
                  type="text" 
                  value={formData.question} 
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })} 
                  placeholder="e.g. How long does shipping take?" 
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Answer</label>
                <textarea 
                  value={formData.answer} 
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })} 
                  placeholder="e.g. Standard shipping takes 3-5 business days across India." 
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 resize-none" 
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
              <button 
                onClick={handleSave} 
                disabled={!formData.question.trim() || !formData.answer.trim()}
                className="px-5 py-2.5 text-sm font-bold bg-brand-accent text-brand-dark rounded-lg hover:bg-brand-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingFaq ? 'Save Changes' : 'Add FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
