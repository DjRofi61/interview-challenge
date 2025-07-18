"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { BACKEND_URL } from '../../../constants';

export default function EditAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [patients, setPatients] = useState<{ id: number; name: string }[]>([]);
  const [medications, setMedications] = useState<{ id: number; name: string }[]>([]);
  const [patientId, setPatientId] = useState('');
  const [medicationId, setMedicationId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientsRes, medicationsRes, assignmentRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/patients`),
          axios.get(`${BACKEND_URL}/medications`),
          axios.get(`${BACKEND_URL}/assignments/${id}`),
        ]);
        setPatients(patientsRes.data);
        setMedications(medicationsRes.data);
        setPatientId(assignmentRes.data.patient.id.toString());
        setMedicationId(assignmentRes.data.medication.id.toString());
        setStartDate(assignmentRes.data.startDate);
        setDays(assignmentRes.data.days.toString());
      } catch {
        setError('Error loading assignment.');
      } finally {
        setFetching(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`${BACKEND_URL}/assignments/${id}`, {
        patientId: Number(patientId),
        medicationId: Number(medicationId),
        startDate,
        days: Number(days),
      });
      router.push('/assignments');
    } catch {
      setError('Error updating assignment.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <main><p>Loading...</p></main>;

  return (
    <main>
      <h1 className="mb-4">Edit Assignment</h1>
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