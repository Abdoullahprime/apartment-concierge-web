'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const NAV = [
  { href: '/agent/today', label: 'Today', icon: '📋' },
  { href: '/agent/checkin', label: 'Check-in', icon: '🏠' },
  { href: '/agent/directory', label: 'Directory', icon: '👥' },
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

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Top bar */}
      <header className="bg-[#2E7D32] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs opacity-80">Agent Portal</p>
          <h1 className="font-semibold">{user.name}</h1>
        </div>
        <button onClick={logout} className="text-xs opacity-80 hover:opacity-100">Sign out</button>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>

      {/* Bottom nav */}
      <nav className="bg-white border-t border-[#E0E0E0] flex">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${
                active ? 'text-[#2E7D32]' : 'text-[#757575]'
              }`}
            >
              <span className="text-lg mb-0.5">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
