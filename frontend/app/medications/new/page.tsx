"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '../../constants';

export default function NewMedicationPage() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${BACKEND_URL}/medications`, { name, dosage, frequency });
      router.push('/patients');
    } catch (err: any) {
      setError('Error creating medication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Medication</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Dosage</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={dosage}
            onChange={e => setDosage(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Frequency</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex" style={{ justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="button"
            disabled={loading}
            style={{ minWidth: 140, fontSize: '1.08rem', letterSpacing: '0.5px' }}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </main>
  );
} 