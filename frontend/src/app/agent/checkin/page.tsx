'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/lib/types';

interface Unit { number: number; occupant_id: string | null; }

export default function CheckInPage() {
  const [guests, setGuests] = useState<User[]>([]);
  const [freeUnits, setFreeUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<User | null>(null);
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  async function load() {
    const [guestsRes, unitsRes] = await Promise.all([
      api.get('/users?role=guest'),
      api.get('/units/free'),
    ]);
    setGuests(guestsRes.data);
    setFreeUnits(unitsRes.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function checkIn() {
    if (!selected || !unit) return;
    setSaving(true);
    try {
      await api.post('/stays/checkin', { userId: selected.id, unitNumber: parseInt(unit), checkInDate: date });
      await load();
      setSelected(null);
    } finally {
      setSaving(false);
    }
  }

  async function checkOut(userId: string) {
    await api.post('/stays/checkout', { userId });
    await load();
  }

  if (loading) return <p className="text-[#757575] text-sm">Loading…</p>;

  const checkedIn = guests.filter((g) => g.unitNumber);
  const notCheckedIn = guests.filter((g) => !g.unitNumber);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-[#333333]">Check-in / Check-out</h2>

      {/* Currently staying */}
      {checkedIn.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-[#757575] uppercase mb-2">Currently Staying</h3>
          <div className="space-y-2">
            {checkedIn.map((g) => (
              <div key={g.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#333333]">{g.name}</p>
                  <p className="text-sm text-[#757575]">Unit {g.unitNumber}</p>
                </div>
                <button
                  onClick={() => checkOut(g.id)}
                  className="text-sm font-semibold text-[#FF6B35] border border-[#FF6B35] rounded-xl px-4 py-1.5 hover:bg-orange-50 transition-colors"
                >
                  Check out
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Check in form */}
      <section className="bg-white rounded-2xl border border-[#E0E0E0] p-5 space-y-4">
        <h3 className="font-semibold text-[#333333]">New Check-in</h3>
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">Guest</label>
          <select
            value={selected?.id ?? ''}
            onChange={(e) => setSelected(guests.find((g) => g.id === e.target.value) ?? null)}
            className="w-full border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          >
            <option value="">Select guest…</option>
            {notCheckedIn.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          >
            <option value="">Select unit…</option>
            {freeUnits.map((u) => (
              <option key={u.number} value={u.number}>Unit {u.number}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1">Check-in date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          />
        </div>
        <button
          onClick={checkIn}
          disabled={!selected || !unit || saving}
          className="w-full bg-[#2E7D32] text-white font-semibold rounded-xl py-3 text-sm hover:bg-[#1B5E20] transition-colors disabled:opacity-60"
        >
          {saving ? 'Checking in…' : 'Check in'}
        </button>
      </section>
    </div>
  );
}
