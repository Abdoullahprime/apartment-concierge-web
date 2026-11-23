'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.role === 'admin') router.replace('/admin/overview');
    else if (user.role === 'agent') router.replace('/agent/today');
    else router.replace('/login');
  }, [user, loading, router]);

  return null;
}
