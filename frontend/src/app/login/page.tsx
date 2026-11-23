'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10 text-white"
        style={{ background: 'linear-gradient(160deg, #1B5E20 0%, #2E7D32 60%, #388E3C 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg backdrop-blur-sm">
            🏠
          </div>
          <span className="font-semibold tracking-tight">Apartment Concierge</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold leading-snug">
            Manage your 17-unit complex from one place.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Bookings, check-ins, service providers and reports — all for agents and admins in a single portal.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-white/60">
          <span>17 units</span>
          <span>·</span>
          <span>4 roles</span>
          <span>·</span>
          <span>10 service categories</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA] px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#2E7D32] flex items-center justify-center text-lg">
              🏠
            </div>
            <span className="font-semibold text-[#333333]">Apartment Concierge</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Welcome back</h1>
            <p className="text-[#757575] text-sm mt-1">Sign in to the staff portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#555555] uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#E0E0E0] rounded-xl px-4 py-3 text-sm text-[#333333] bg-white placeholder:text-[#BBBBBB] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#555555] uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#E0E0E0] rounded-xl px-4 py-3 text-sm text-[#333333] bg-white placeholder:text-[#BBBBBB] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 text-sm text-[#C62828] bg-[#FEF2F2] border border-[#C62828]/20 rounded-xl px-4 py-3">
                <span className="w-4 h-4 rounded-full bg-[#C62828] text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white font-semibold rounded-xl py-3 text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
