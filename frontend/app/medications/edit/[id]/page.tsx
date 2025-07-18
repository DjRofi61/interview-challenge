"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { BACKEND_URL } from '../../../constants';

export default function EditMedicationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchMedication() {
      try {
        const res = await axios.get(`${BACKEND_URL}/medications/${id}`);
        setName(res.data.name);
        setDosage(res.data.dosage);
        setFrequency(res.data.frequency);
      } catch {
        setError('Error loading medication.');
      } finally {
        setFetching(false);
      }
    }
    if (id) fetchMedication();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`${BACKEND_URL}/medications/${id}`, { name, dosage, frequency });
      router.push('/medications');
    } catch {
      setError('Error updating medication.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <main><p>Loading...</p></main>;

  return (
    <main>
      <h1 className="mb-4">Edit Medication</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Dosage</label>
          <input
            type="text"
            value={dosage}
            onChange={e => setDosage(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Frequency</label>
          <input
            type="text"
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="flex" style={{ justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="button"
            disabled={loading}
            style={{ minWidth: 140, fontSize: '1.08rem', letterSpacing: '0.5px' }}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </main>
  );
} 