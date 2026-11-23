'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const NAV = [
  { href: '/agent/today', label: 'Today', icon: (active: boolean) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  )},
  { href: '/agent/checkin', label: 'Check-in', icon: (active: boolean) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  )},
  { href: '/agent/directory', label: 'Directory', icon: (active: boolean) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  )},
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'agent' && user.role !== 'admin'))) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const initials = user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-[#E8E8E8] px-5 py-3 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-[#999999] leading-none">Agent Portal</p>
            <p className="text-sm font-semibold text-[#1A1A1A] leading-tight mt-0.5">{user.name}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs text-[#757575] hover:text-[#333333] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F5F5F5]"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Sign out
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-5 max-w-2xl mx-auto w-full">{children}</main>

      {/* Bottom nav */}
      <nav className="bg-white border-t border-[#E8E8E8] flex shadow-[0_-1px_3px_rgba(0,0,0,0.04)] safe-area-pb">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center pt-2.5 pb-3 gap-1 relative"
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#2E7D32]" />
              )}
              <span className={active ? 'text-[#2E7D32]' : 'text-[#AAAAAA]'}>
                {item.icon(active)}
              </span>
              <span className={`text-[10px] font-semibold tracking-wide ${active ? 'text-[#2E7D32]' : 'text-[#AAAAAA]'}`}>
                {item.label.toUpperCase()}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
