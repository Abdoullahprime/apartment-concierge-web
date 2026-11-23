'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import api from '@/lib/api';
import { BookingStatus, STATUS_COLORS } from '@/lib/types';

const DAYS_OPTIONS = [7, 14, 30, 60, 90];

const CATEGORY_EMOJI: Record<string, string> = {
  restaurants: '🍽️', vehicle_hire: '🚗', private_chefs: '👨‍🍳',
  co_working: '💼', room_service: '🛎️', hospitals: '🏥',
  attractions: '🎯', events: '🎉', government_offices: '🏛️', emergency: '🚨',
};

interface OccupancyPoint { date: string; occupied: number; }
interface StatusCount { status: BookingStatus; count: number; }

function StatTile({ label, value, caption }: { label: string; value: string | number; caption?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <p className="text-xs font-semibold text-[#757575] uppercase mb-1">{label}</p>
      <p className="text-3xl font-bold text-[#333333]">{value}</p>
      {caption && <p className="text-xs text-[#757575] mt-1">{caption}</p>}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-[#333333]">{children}</h3>;
}

export default function ReportsPage() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [occupancy, setOccupancy] = useState<OccupancyPoint[]>([]);
  const [byCategory, setByCategory] = useState<{ name: string; count: number; emoji: string }[]>([]);
  const [byStatus, setByStatus] = useState<StatusCount[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get(`/reports/summary?days=${days}`).then(({ data }) => {
      setOccupancy(data.occupancy);

      const cats = Object.entries(data.byCategory as Record<string, number>)
        .map(([name, count]) => ({
          name: name.replace(/_/g, ' '),
          count,
          emoji: CATEGORY_EMOJI[name] ?? '📦',
        }))
        .sort((a, b) => b.count - a.count);
      setByCategory(cats);
      setByStatus(data.byStatus);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [days]);

  const totalBookings = byStatus.reduce((sum, s) => sum + s.count, 0);
  const avgOccupancy = occupancy.length
    ? Math.round(occupancy.reduce((s, p) => s + p.occupied, 0) / occupancy.length)
    : 0;
  const peakOccupancy = occupancy.length
    ? Math.max(...occupancy.map((p) => p.occupied))
    : 0;

  // Thin out x-axis labels so they don't crowd
  const xAxisInterval = days <= 14 ? 1 : days <= 30 ? 4 : 9;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header + date range */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#333333]">Reports</h2>
        <div className="flex gap-1 bg-white border border-[#E0E0E0] rounded-xl p-1">
          {DAYS_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                days === d ? 'bg-[#2E7D32] text-white' : 'text-[#757575] hover:bg-[#F5F5F5]'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-[#757575] text-sm">Loading…</p>
      ) : (
        <>
          {/* Summary tiles */}
          <div className="grid grid-cols-3 gap-4">
            <StatTile label="Total bookings" value={totalBookings} caption={`last ${days} days`} />
            <StatTile label="Avg occupancy" value={`${avgOccupancy} / 17`} caption="units per day" />
            <StatTile label="Peak occupancy" value={`${peakOccupancy} / 17`} caption={`last ${days} days`} />
          </div>

          {/* Occupancy line chart */}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 space-y-4">
            <SectionHeader>Occupancy over time</SectionHeader>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={occupancy} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#757575' }}
                  interval={xAxisInterval}
                  tickFormatter={(v) => v.slice(5)} // MM-DD
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#757575' }}
                  domain={[0, 17]}
                  tickCount={6}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E0E0E0', fontSize: 12 }}
                  formatter={(v: number | undefined) => [`${v ?? 0} units`, 'Occupied']}
                  labelFormatter={(l) => `Date: ${l}`}
                />
                <Line
                  type="monotone"
                  dataKey="occupied"
                  stroke="#2E7D32"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bookings by category bar chart */}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 space-y-4">
            <SectionHeader>Bookings by service category</SectionHeader>
            {byCategory.length === 0 ? (
              <p className="text-sm text-[#757575]">No bookings in this period</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={byCategory}
                  margin={{ top: 4, right: 8, bottom: 40, left: -20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#757575' }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#757575' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #E0E0E0', fontSize: 12 }}
                    formatter={(v: number | undefined) => [v ?? 0, 'Bookings']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {byCategory.map((_, i) => (
                      <Cell
                        key={i}
                        fill={`hsl(${140 - i * 12}, 55%, ${42 + i * 3}%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Status breakdown */}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 space-y-4">
            <SectionHeader>Booking status breakdown</SectionHeader>
            <div className="space-y-3">
              {byStatus.map(({ status, count }) => {
                const pct = totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0;
                const color = STATUS_COLORS[status];
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span
                      className="w-20 text-xs font-medium capitalize text-right flex-shrink-0"
                      style={{ color }}
                    >
                      {status}
                    </span>
                    <div className="flex-1 bg-[#F5F5F5] rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="w-12 text-xs text-[#757575] text-right flex-shrink-0">
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
              {totalBookings === 0 && (
                <p className="text-sm text-[#757575]">No bookings in this period</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
