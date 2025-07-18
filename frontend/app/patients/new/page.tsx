"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '../../constants';

export default function NewPatientPage() {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${BACKEND_URL}/patients`, { name, dateOfBirth });
      router.push('/patients');
    } catch (err: any) {
      setError('Error creating patient.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1 className="mb-4">Create Patient</h1>
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
        {error && <p style={{ color: 'red' }}>{error.replace('Erreur lors de la création du patient.', 'Error creating patient.')}</p>}
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