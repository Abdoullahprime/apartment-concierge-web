'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Booking, BookingStatus, STATUS_COLORS } from '@/lib/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/contexts/ToastContext';

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

export default function TodayPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  async function load() {
    setFetchError(false);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await api.get(`/bookings?date=${today}`);
      setBookings(data);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: BookingStatus) {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      const labels: Record<string, string> = {
        confirmed: 'Booking confirmed', rejected: 'Booking rejected',
        completed: 'Booking marked completed',
      };
      toast(labels[status] ?? 'Status updated', status === 'rejected' ? 'info' : 'success');
    } catch {
      toast('Failed to update status — please try again', 'error');
    }
  }

  const pending = bookings.filter((b) => b.status === 'pending');

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorState onRetry={() => { setLoading(true); load(); }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#333333]">Today's Bookings</h2>
        {pending.length > 0 && (
          <span className="bg-[#F9A825] text-white text-xs font-semibold px-3 py-1 rounded-full">
            {pending.length} awaiting
          </span>
        )}
      </div>

      {bookings.length === 0 && (
        <EmptyState
          title="No bookings today"
          description="There are no service bookings scheduled for today."
        />
      )}

      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-[#333333]">{booking.serviceName}</p>
              <p className="text-sm text-[#757575]">{booking.userName} · {booking.time}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
          {booking.notes && (
            <p className="text-sm text-[#757575] mb-3 italic">"{booking.notes}"</p>
          )}
          {booking.status === 'pending' && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => updateStatus(booking.id, 'confirmed')}
                className="flex-1 bg-[#2E7D32] text-white text-sm font-semibold rounded-xl py-2 hover:bg-[#1B5E20] transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => updateStatus(booking.id, 'rejected')}
                className="flex-1 border border-[#C62828] text-[#C62828] text-sm font-semibold rounded-xl py-2 hover:bg-red-50 transition-colors"
              >
                Reject
              </button>
            </div>
          )}
          {booking.status === 'confirmed' && (
            <button
              onClick={() => updateStatus(booking.id, 'completed')}
              className="w-full mt-3 bg-[#1565C0] text-white text-sm font-semibold rounded-xl py-2 hover:bg-blue-800 transition-colors"
            >
              Mark Completed
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
