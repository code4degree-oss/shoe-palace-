'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Star, Clock, Filter, Image as ImageIcon, Star as StarOutline } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return r.approved === false && r.featured === false; // Simplification
    if (filter === 'approved') return r.approved === true;
    if (filter === 'rejected') return r.approved === false; // In a real app we might have a 3-state approved: true|false|null
    return true;
  });

  const toggleApproval = async (id: string, approved: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      });
      if (res.ok) {
        setReviews(reviews.map(r => r.id === id ? { ...r, approved } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured })
      });
      if (res.ok) {
        setReviews(reviews.map(r => r.id === id ? { ...r, featured } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = reviews.filter(r => r.approved === false && r.featured === false).length; // Rough approx

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          <p className="text-sm text-gray-500 mt-1">{reviews.length} total reviews</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'approved', 'pending'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === tab
                ? 'bg-white shadow-sm border border-gray-200 text-gray-900'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className={`bg-white rounded-xl shadow-sm border p-5 ${review.featured ? 'border-brand-accent' : 'border-gray-100'}`}>
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900">{review.name}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{review.phone}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? 'text-brand-accent' : 'text-gray-200'} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4">{review.text}</p>

                {review.image && (
                  <div className="mb-4 rounded-md overflow-hidden bg-gray-100 w-32 h-32 border border-gray-200">
                    <img src={review.image} alt="Review attachment" className="w-full h-full object-cover" />
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  Product: <span className="font-medium text-gray-600">{review.product?.name || 'Unknown'}</span>
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  {review.approved ? (
                    <button
                      onClick={() => toggleApproval(review.id, false)}
                      className="flex-1 justify-center flex items-center gap-1.5 px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-xs font-medium transition-colors"
                    >
                      <CheckCircle2 size={14} /> Approved
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleApproval(review.id, true)}
                      className="flex-1 justify-center flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg text-xs font-medium transition-colors border border-gray-200"
                    >
                      Approve
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {review.featured ? (
                    <button
                      onClick={() => toggleFeatured(review.id, false)}
                      className="flex-1 justify-center flex items-center gap-1.5 px-3 py-2 bg-brand-accent/20 text-brand-dark hover:bg-brand-accent/30 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Star size={14} fill="currentColor" /> Featured
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleFeatured(review.id, true)}
                      className="flex-1 justify-center flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 hover:bg-brand-accent/10 hover:text-brand-dark rounded-lg text-xs font-medium transition-colors border border-gray-200"
                      disabled={!review.approved}
                      title={!review.approved ? "Must be approved first" : ""}
                    >
                      <StarOutline size={14} /> Feature on Home
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center text-gray-400">
            <Filter size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
}
