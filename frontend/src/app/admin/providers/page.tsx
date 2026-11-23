'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Service } from '@/lib/types';

const CATEGORY_EMOJI: Record<string, string> = {
  restaurants: '🍽️', vehicle_hire: '🚗', private_chefs: '👨‍🍳',
  co_working: '💼', room_service: '🛎️', hospitals: '🏥',
  attractions: '🎯', events: '🎉', government_offices: '🏛️', emergency: '🚨',
};

function ServiceRow({ service, onToggle, onDelete }: {
  service: Service;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] flex items-center justify-center text-xl flex-shrink-0">
        {CATEGORY_EMOJI[service.category] ?? '📦'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#333333] truncate">{service.name}</p>
        <p className="text-xs text-[#757575] capitalize">{service.category.replace(/_/g, ' ')}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={service.active}
          onChange={() => onToggle(service.id, !service.active)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-[#E0E0E0] peer-checked:bg-[#2E7D32] rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
      </label>
      <button
        onClick={() => onDelete(service.id)}
        className="text-[#C62828] text-sm hover:underline flex-shrink-0"
      >
        Delete
      </button>
    </div>
  );
}

export default function ProvidersPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: 'restaurants', features: '', contact: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const { data } = await api.get('/services');
    setServices(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggle(id: string, active: boolean) {
    await api.patch(`/services/${id}/active`, { active });
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, active } : s));
  }

  async function deleteService(id: string) {
    if (!confirm('Delete this service? This cannot be undone if no active bookings exist.')) return;
    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      alert(e.response?.data?.message ?? 'Cannot delete — active bookings exist. Deactivate instead.');
    }
  }

  async function addService() {
    setError('');
    setSaving(true);
    try {
      const { data } = await api.post('/services', {
        ...form,
        features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
        active: true,
      });
      setServices((prev) => [...prev, data]);
      setShowForm(false);
      setForm({ name: '', description: '', category: 'restaurants', features: '', contact: '' });
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to add service');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-[#757575] text-sm">Loading…</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#333333]">Service Providers</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#2E7D32] text-white text-sm font-semibold rounded-xl px-4 py-2 hover:bg-[#1B5E20] transition-colors"
        >
          + Add service
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 space-y-3">
          <h3 className="font-semibold text-[#333333]">New Service</h3>
          {[
            { label: 'Name', key: 'name', type: 'text' },
            { label: 'Contact (optional)', key: 'contact', type: 'text' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[#333333] mb-1">{label}</label>
              <input
                type={type}
                value={(form as any)[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            >
              {Object.keys(CATEGORY_EMOJI).map((c) => (
                <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">Features (one per line)</label>
            <textarea
              value={form.features}
              onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
              rows={3}
              className="w-full border border-[#E0E0E0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>
          {error && <p className="text-sm text-[#C62828]">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={addService}
              disabled={saving || !form.name}
              className="flex-1 bg-[#2E7D32] text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-[#1B5E20] disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 border border-[#E0E0E0] rounded-xl text-sm text-[#757575] hover:bg-[#F5F5F5] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {services.map((s) => (
          <ServiceRow key={s.id} service={s} onToggle={toggle} onDelete={deleteService} />
        ))}
      </div>
    </div>
  );
}
