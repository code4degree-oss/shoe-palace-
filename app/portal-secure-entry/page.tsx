'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ShoppingBag } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      router.push('/portal-secure-entry/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <ShoppingBag className="text-white" size={28} />
            <span className="font-serif text-3xl font-bold text-white tracking-[0.1em] uppercase">Shoe Place</span>
          </div>
          <p className="text-white/30 text-sm tracking-wider uppercase">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-8">
          <h1 className="text-xl font-bold text-white mb-1.5">Welcome back</h1>
          <p className="text-white/40 text-sm mb-8">Sign in to manage your store</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-medium text-white/50 mb-2 uppercase tracking-[0.15em]">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shoeplace.com"
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/25 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-medium text-white/50 mb-2 uppercase tracking-[0.15em]">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] pl-11 pr-11 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/25 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-brand-black font-bold py-3.5 hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-[0.2em]"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/15 text-[10px] mt-6 uppercase tracking-wider">
          © {new Date().getFullYear()} Shoe Place
        </p>
      </div>
    </div>
  );
}
