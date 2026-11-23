'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const NAV = [
  { href: '/admin/overview', label: 'Overview', icon: '📊' },
  { href: '/admin/providers', label: 'Providers', icon: '🛎️' },
  { href: '/admin/people', label: 'People', icon: '👥' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📋' },
  { href: '/admin/reports', label: 'Reports', icon: '📈' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-[#E0E0E0] flex flex-col">
        <div className="p-6 border-b border-[#E0E0E0]">
          <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center mb-3">
            <span className="text-lg">🏠</span>
          </div>
          <p className="font-bold text-[#333333] text-sm">Apartment Concierge</p>
          <p className="text-xs text-[#757575]">Admin Portal</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#2E7D321F] text-[#2E7D32]'
                    : 'text-[#757575] hover:bg-[#F5F5F5]'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#E0E0E0]">
          <p className="text-xs font-medium text-[#333333] truncate">{user.name}</p>
          <button onClick={logout} className="text-xs text-[#757575] hover:text-[#333333] mt-1">Sign out</button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
