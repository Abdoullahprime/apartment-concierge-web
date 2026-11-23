'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/lib/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export default function DirectoryPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  function load() {
    setFetchError(false);
    api.get('/users')
      .then(({ data }) => { setUsers(data); setLoading(false); })
      .catch(() => { setFetchError(true); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.unitNumber?.toString() ?? '').includes(q)
    );
  }).filter((u) => u.role === 'resident' || u.role === 'guest');

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorState onRetry={() => { setLoading(true); load(); }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-[#333333]">Directory</h2>
      <input
        type="search"
        placeholder="Search by name, email or unit…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-[#E0E0E0] rounded-xl px-4 py-3 text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
      />
      {filtered.length === 0 && (
        <EmptyState
          title={query ? 'No results' : 'No residents or guests yet'}
          description={query ? `No one matches "${query}".` : 'Residents and guests will appear here once added.'}
        />
      )}
      <div className="space-y-2">
        {filtered.map((u) => (
          <div key={u.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[#333333]">{u.name}</p>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                  style={{
                    color: u.role === 'guest' ? '#FF6B35' : '#2E7D32',
                    backgroundColor: u.role === 'guest' ? '#FF6B351F' : '#2E7D321F',
                  }}
                >
                  {u.role}
                </span>
              </div>
              <p className="text-sm text-[#757575]">{u.email}</p>
              {u.unitNumber && <p className="text-sm text-[#757575]">Unit {u.unitNumber}</p>}
            </div>
            <div className="flex gap-2">
              {u.phone && (
                <a
                  href={`tel:${u.phone}`}
                  className="w-9 h-9 rounded-xl bg-[#2E7D321F] flex items-center justify-center text-[#2E7D32] hover:bg-[#2E7D3233] transition-colors"
                >
                  📞
                </a>
              )}
              <a
                href={`mailto:${u.email}`}
                className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center text-[#757575] hover:bg-[#E0E0E0] transition-colors"
              >
                ✉️
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
