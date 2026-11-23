'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Stats {
  occupied: number;
  total: number;
  free: number;
}

export default function OverviewPage() {
  const [occupancy, setOccupancy] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/units/occupancy'),
      api.get('/bookings?limit=5'),
    ]).then(([occRes, bookRes]) => {
      setOccupancy(occRes.data);
      setRecentBookings(bookRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-[#757575] text-sm">Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-[#333333]">Overview</h2>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Occupied units', value: occupancy?.occupied ?? 0, caption: `of ${occupancy?.total ?? 17}` },
          { label: 'Free units', value: occupancy?.free ?? 0, caption: 'available now' },
          { label: 'Occupancy', value: `${Math.round(((occupancy?.occupied ?? 0) / 17) * 100)}%`, caption: 'of capacity' },
        ].map((tile) => (
          <div key={tile.label} className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
            <p className="text-xs font-medium text-[#757575] uppercase mb-1">{tile.label}</p>
            <p className="text-3xl font-bold text-[#333333]">{tile.value}</p>
            <p className="text-xs text-[#757575] mt-1">{tile.caption}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
        <h3 className="font-semibold text-[#333333] mb-4">Recent Bookings</h3>
        {recentBookings.length === 0 ? (
          <p className="text-sm text-[#757575]">No bookings yet</p>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-[#F5F5F5] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#333333]">{b.serviceName}</p>
                  <p className="text-xs text-[#757575]">{b.userName} · {b.date}</p>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                  style={{ color: '#F9A825', backgroundColor: '#F9A8251F' }}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
