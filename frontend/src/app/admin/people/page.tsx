'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User, Role } from '@/lib/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/contexts/ToastContext';

const ROLE_COLOR: Record<string, { text: string; bg: string }> = {
  resident: { text: '#2E7D32', bg: '#2E7D321F' },
  guest: { text: '#FF6B35', bg: '#FF6B351F' },
  agent: { text: '#1565C0', bg: '#1565C01F' },
};

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Residents', value: 'resident' },
  { label: 'Guests', value: 'guest' },
  { label: 'Agents', value: 'agent' },
];

export default function PeoplePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'resident' as Role, unitNumber: '', employeeId: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load(role?: string) {
    setFetchError(false);
    try {
      const url = role ? `/users?role=${role}` : '/users';
      const { data } = await api.get(url);
      setUsers(data);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(filter || undefined); }, [filter]);

  async function addPerson() {
    setError('');
    setSaving(true);
    try {
      const { data } = await api.post('/users', {
        ...form,
        unitNumber: form.unitNumber ? parseInt(form.unitNumber) : undefined,
        employeeId: form.employeeId || undefined,
      });
      setUsers((prev) => [...prev, data]);
      setShowForm(false);
      setForm({ name: '', email: '', password: '', phone: '', role: 'resident', unitNumber: '', employeeId: '' });
      toast('Person added', 'success');
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to add person');
    } finally {
      setSaving(false);
    }
  }

  async function removePerson(id: string) {
    if (!confirm('Remove this person? This cannot be undone.')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast('Person removed', 'success');
    } catch {
      toast('Failed to remove person', 'error');
    }
  }

  if (fetchError) {
    return (
      <div className="max-w-3xl mx-auto">
        <ErrorState onRetry={() => { setLoading(true); load(filter || undefined); }} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#333333]">People</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#2E7D32] text-white text-sm font-semibold rounded-xl px-4 py-2 hover:bg-[#1B5E20] transition-colors"
        >
          + Add person
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2">
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

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 space-y-3">
          <h3 className="font-semibold text-[#333333]">New Person</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Full name', key: 'name' },
              { label: 'Email', key: 'email' },
              { label: 'Password', key: 'password' },
              { label: 'Phone (optional)', key: 'phone' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-[#333333] mb-1">{label}</label>
                <input
                  type={key === 'password' ? 'password' : 'text'}
                  value={(form as any)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-[#E0E0E0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                className="w-full border border-[#E0E0E0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              >
                <option value="resident">Resident</option>
                <option value="guest">Guest</option>
                <option value="agent">Agent</option>
              </select>
            </div>
            {form.role === 'agent' ? (
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1">Employee ID</label>
                <input
                  value={form.employeeId}
                  onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
                  className="w-full border border-[#E0E0E0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1">Unit (optional)</label>
                <input
                  type="number"
                  min={1}
                  max={17}
                  value={form.unitNumber}
                  onChange={(e) => setForm((f) => ({ ...f, unitNumber: e.target.value }))}
                  className="w-full border border-[#E0E0E0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            )}
          </div>
          {error && <p className="text-sm text-[#C62828]">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={addPerson}
              disabled={saving || !form.name || !form.email || !form.password}
              className="flex-1 bg-[#2E7D32] text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-[#1B5E20] disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving…' : 'Add person'}
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
        {users.map((u) => {
          const colors = ROLE_COLOR[u.role] ?? { text: '#757575', bg: '#7575751F' };
          return (
            <div key={u.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center font-semibold text-[#333333] flex-shrink-0">
                {u.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#333333] truncate">{u.name}</p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0"
                    style={{ color: colors.text, backgroundColor: colors.bg }}>
                    {u.role}
                  </span>
                </div>
                <p className="text-sm text-[#757575] truncate">{u.email}</p>
                {u.unitNumber && <p className="text-xs text-[#757575]">Unit {u.unitNumber}</p>}
                {u.employeeId && <p className="text-xs text-[#757575]">ID: {u.employeeId}</p>}
              </div>
              <button
                onClick={() => removePerson(u.id)}
                className="text-sm text-[#C62828] hover:underline flex-shrink-0"
              >
                Remove
              </button>
            </div>
          );
        })}
        {users.length === 0 && (
          <EmptyState
            title="No people found"
            description={filter ? `No ${filter}s match the current filter.` : 'Add team members or residents to get started.'}
            actionLabel="Add person"
            onAction={() => setShowForm(true)}
          />
        )}
      </div>
    </div>
  );
}
