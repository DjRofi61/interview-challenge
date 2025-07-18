"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '../../constants';

export default function NewAssignmentPage() {
  const [patients, setPatients] = useState<{ id: number; name: string }[]>([]);
  const [medications, setMedications] = useState<{ id: number; name: string }[]>([]);
  const [patientId, setPatientId] = useState('');
  const [medicationId, setMedicationId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientsRes, medicationsRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/patients`),
          axios.get(`${BACKEND_URL}/medications`),
        ]);
        setPatients(patientsRes.data);
        setMedications(medicationsRes.data);
      } catch {
        setError('Erreur lors du chargement des données.');
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${BACKEND_URL}/assignments`, {
        patientId: Number(patientId),
        medicationId: Number(medicationId),
        startDate,
        days: Number(days),
      });
      router.push('/patients');
    } catch (err: any) {
      setError('Erreur lors de l\'assignation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1 className="mb-4">Assign Medication to Patient</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Patient</label>
          <select
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            required
          >
            <option value="">Select a patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Medication</label>
          <select
            value={medicationId}
            onChange={e => setMedicationId(e.target.value)}
            required
          >
            <option value="">Select a medication</option>
            {medications.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Number of Days</label>
          <input
            type="number"
            min="1"
            value={days}
            onChange={e => setDays(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error.replace("Erreur lors de l'assignation.", 'Error assigning medication.')}</p>}
        <div className="flex" style={{ justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="button"
            disabled={loading}
            style={{ minWidth: 140, fontSize: '1.08rem', letterSpacing: '0.5px' }}
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </form>
    </main>
  );
} 