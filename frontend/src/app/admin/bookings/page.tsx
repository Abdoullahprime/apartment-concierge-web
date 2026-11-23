'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Booking, BookingStatus, STATUS_COLORS } from '@/lib/types';

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

function StatusBadge({ status }: { status: BookingStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
      style={{ color, backgroundColor: `${color}1F` }}
    >
      {status}
    </span>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  async function load(status?: string) {
    const url = status ? `/bookings?status=${status}` : '/bookings';
    const { data } = await api.get(url);
    setBookings(data);
    setLoading(false);
  }

  useEffect(() => { load(filter || undefined); }, [filter]);

  async function updateStatus(id: string, status: BookingStatus) {
    await api.patch(`/bookings/${id}/status`, { status });
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
  }

  if (loading) return <p className="text-[#757575] text-sm">Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-[#333333]">All Bookings</h2>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-[#2E7D32] text-white'
                : 'bg-white border border-[#E0E0E0] text-[#757575] hover:bg-[#F5F5F5]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#E0E0E0]">
            <tr className="text-left">
              {['Guest', 'Service', 'Date & Time', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-[#757575] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F5]">
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#757575]">No bookings found</td>
              </tr>
            )}
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-[#F5F5F5] transition-colors">
                <td className="px-4 py-3 font-medium text-[#333333]">{b.userName}</td>
                <td className="px-4 py-3 text-[#333333]">
                  <p>{b.serviceName}</p>
                  <p className="text-xs text-[#757575] capitalize">{b.category.replace(/_/g, ' ')}</p>
                </td>
                <td className="px-4 py-3 text-[#333333]">
                  <p>{b.date}</p>
                  <p className="text-xs text-[#757575]">{b.time}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(b.id, 'confirmed')}
                          className="text-xs font-semibold text-[#2E7D32] hover:underline"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(b.id, 'rejected')}
                          className="text-xs font-semibold text-[#C62828] hover:underline"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {b.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => updateStatus(b.id, 'completed')}
                          className="text-xs font-semibold text-[#1565C0] hover:underline"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateStatus(b.id, 'cancelled')}
                          className="text-xs font-semibold text-[#C62828] hover:underline"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
