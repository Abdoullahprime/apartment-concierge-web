'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { STATUS_COLORS } from '@/lib/types';
import { StatTileSkeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

interface Stats { occupied: number; total: number; free: number }

function OccupancyRing({ pct }: { pct: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const filled = circ * (pct / 100);
  return (
    <svg viewBox="0 0 72 72" className="w-16 h-16 -rotate-90">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#EBEBEB" strokeWidth="6" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="#2E7D32" strokeWidth="6"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function OverviewPage() {
  const [occupancy, setOccupancy] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  function load() {
    setFetchError(false);
    Promise.all([
      api.get('/units/occupancy'),
      api.get('/bookings?limit=5'),
    ]).then(([occRes, bookRes]) => {
      setOccupancy(occRes.data);
      setRecentBookings(bookRes.data);
      setLoading(false);
    }).catch(() => {
      setFetchError(true);
      setLoading(false);
    });
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse bg-[#EBEBEB] rounded-xl" />
        <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <StatTileSkeleton key={i} />)}</div>
        <CardSkeleton />
      </div>
    );
  }

  if (fetchError) return <ErrorState onRetry={() => { setLoading(true); load(); }} />;

  const pct = Math.round(((occupancy?.occupied ?? 0) / (occupancy?.total ?? 17)) * 100);

  const tiles = [
    { label: 'Occupied', value: occupancy?.occupied ?? 0, sub: `of ${occupancy?.total ?? 17} units`, color: '#2E7D32', tint: '#2E7D3215' },
    { label: 'Free', value: occupancy?.free ?? 0, sub: 'available now', color: '#1565C0', tint: '#1565C015' },
    { label: 'Occupancy', value: `${pct}%`, sub: 'of total capacity', color: '#F9A825', tint: '#F9A82515', ring: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Overview</h2>
        <p className="text-sm text-[#999999] mt-0.5">Live snapshot of the complex</p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="bg-white rounded-2xl border border-[#EBEBEB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-[#999999] uppercase tracking-wide mb-1">{tile.label}</p>
              <p className="text-3xl font-bold text-[#1A1A1A] tabular-nums">{tile.value}</p>
              <p className="text-xs text-[#BBBBBB] mt-1">{tile.sub}</p>
            </div>
            {tile.ring ? (
              <div className="relative flex-shrink-0">
                <OccupancyRing pct={pct} />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#1A1A1A] rotate-90">
                  {pct}%
                </span>
              </div>
            ) : (
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: tile.tint }}
              >
                <span className="text-xl font-bold" style={{ color: tile.color }}>
                  {tile.value}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F5F5F5] flex items-center justify-between">
          <h3 className="font-semibold text-[#1A1A1A] text-sm">Recent Bookings</h3>
          <a href="/admin/bookings" className="text-xs text-[#2E7D32] font-medium hover:underline">View all →</a>
        </div>
        {recentBookings.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-[#BBBBBB]">No bookings yet</div>
        ) : (
          <div className="divide-y divide-[#F5F5F5]">
            {recentBookings.map((b) => {
              const color = STATUS_COLORS[b.status as keyof typeof STATUS_COLORS] ?? '#999';
              return (
                <div key={b.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{b.serviceName}</p>
                    <p className="text-xs text-[#AAAAAA] mt-0.5">{b.userName} · {b.date}</p>
                  </div>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                    style={{ color, backgroundColor: `${color}20` }}
                  >
                    {b.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
