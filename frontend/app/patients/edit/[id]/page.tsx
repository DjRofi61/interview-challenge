"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { BACKEND_URL } from '../../../constants';

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchPatient() {
      try {
        const res = await axios.get(`${BACKEND_URL}/patients/${id}`);
        setName(res.data.name);
        setDateOfBirth(res.data.dateOfBirth);
      } catch {
        setError('Error loading patient.');
      } finally {
        setFetching(false);
      }
    }
    if (id) fetchPatient();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`${BACKEND_URL}/patients/${id}`, { name, dateOfBirth });
      router.push('/patients');
    } catch {
      setError('Error updating patient.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <main><p>Loading...</p></main>;

  return (
    <main>
      <h1 className="mb-4">Edit Patient</h1>
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
          <label>Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={e => setDateOfBirth(e.target.value)}
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