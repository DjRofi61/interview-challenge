"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Assignment {
  id: number;
  medication: { name: string; dosage: string; frequency: string };
  startDate: string;
  days: number;
  remainingDays: number;
  patient: { id: number };
}

interface Patient {
  id: number;
  name: string;
  dateOfBirth: string;
  assignments: Assignment[];
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<{id: number|null, name: string}>({id: null, name: ''});
  const [errorModal, setErrorModal] = useState<string|null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await axios.get(`${BACKEND_URL}/patients`);
        const patientsData: Patient[] = res.data;
        const assignmentsRes = await axios.get(`${BACKEND_URL}/assignments/with-remaining-days`);
        const assignments: Assignment[] = assignmentsRes.data;
        const patientsWithAssignments = patientsData.map(p => ({
          ...p,
          assignments: assignments.filter(a => a.patient.id === p.id),
        }));
        setPatients(patientsWithAssignments);
      } catch (err: any) {
        setError('Failed to load patients.');
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  function handleDelete(id: number) {
    const p = patients.find(p => p.id === id);
    setShowModal({id, name: p ? p.name : ''});
  }

  async function confirmDelete() {
    if (!showModal.id) return;
    try {
      await axios.delete(`${BACKEND_URL}/patients/${showModal.id}`);
      setPatients(list => list.filter(p => p.id !== showModal.id));
      // setToast(`Patient "${showModal.name}" deleted.`); // Assuming setToast is defined elsewhere or removed
    } catch (err: any) {
      if (err.response && err.response.status === 400 && err.response.data?.message?.includes('assignments')) {
        setErrorModal(err.response.data.message);
      } else {
        // setToast('Error deleting patient.'); // Assuming setToast is defined elsewhere or removed
      }
    } finally {
      setShowModal({id: null, name: ''});
      // setTimeout(() => setToast(null), 2500); // Assuming setToast is defined elsewhere or removed
    }
  }

  return (
    <main>
      <div className="flex flex-between mb-4">
        <h1>Patients</h1>
        <Link href="/patients/new" className="button">Add Patient</Link>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {errorModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,44,68,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(34,44,68,0.18)', padding: 32, minWidth: 340, textAlign: 'center' }}>
            <h2 style={{ marginBottom: 16, color: '#ef4444' }}>Cannot Delete Patient</h2>
            <p style={{ marginBottom: 16 }}>{errorModal}</p>
            <p style={{ fontSize: 15, color: '#888', marginBottom: 20 }}>You must first delete all assignments for this patient.<br />
              <Link href="/assignments" style={{ color: '#2563eb', textDecoration: 'underline' }}>View Assignments</Link>
            </p>
            <button className="button" style={{ background: '#6366f1', minWidth: 120 }} onClick={() => setErrorModal(null)}>OK</button>
          </div>
        </div>
      )}
      {showModal.id && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,44,68,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(34,44,68,0.18)', padding: 32, minWidth: 320, textAlign: 'center' }}>
            <h2 style={{ marginBottom: 16 }}>Delete Patient</h2>
            <p>Are you sure you want to delete <b>{showModal.name}</b>?</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
              <button className="button" style={{ background: '#ef4444' }} onClick={confirmDelete}>Delete</button>
              <button className="button" style={{ background: '#6366f1' }} onClick={() => setShowModal({id: null, name: ''})}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {patients.map(patient => (
          <div key={patient.id} className="card">
            <div className="card-accent" />
            <div className="card-content" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 4 }}>{patient.name}</div>
              </div>
              <div className="card-actions">
                <Link
                  href={`/patients/edit/${patient.id}`}
                  className="icon-btn edit"
                  title="Edit"
                  tabIndex={0}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M15.232 5.232l-1.464-1.464a2 2 0 0 0-2.828 0l-6.536 6.536a2 2 0 0 0-.586 1.414V15a1 1 0 0 0 1 1h3.282a2 2 0 0 0 1.414-.586l6.536-6.536a2 2 0 0 0 0-2.828zm-7.07 8.485H5v-3.162l6.293-6.293 3.162 3.162-6.293 6.293z"/></svg>
                  <span className="icon-tooltip">Edit</span>
                </Link>
                <button
                  className="icon-btn delete"
                  title="Delete"
                  tabIndex={0}
                  onClick={() => handleDelete(patient.id)}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 8a1 1 0 0 1 1 1v6a1 1 0 0 0 2 0V9a1 1 0 1 1 2 0v6a1 1 0 0 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a1 1 0 0 1 1-1zM4 6a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z"/></svg>
                  <span className="icon-tooltip">Delete</span>
                </button>
              </div>
              <div className="text-muted mb-2" style={{ fontSize: 14 }}>Date of birth: {patient.dateOfBirth}</div>
              <div>
                <span style={{ fontWeight: 500 }}>Treatments:</span>
                {patient.assignments.length === 0 ? (
                  <span className="text-muted" style={{ marginLeft: 8 }}>No treatments assigned</span>
                ) : (
                  <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                    {patient.assignments.map(ass => (
                      <li key={ass.id} style={{ marginBottom: 8 }}>
                        <span style={{ fontWeight: 600 }}>{ass.medication.name}</span> <span className="text-muted">({ass.medication.dosage}, {ass.medication.frequency})</span><br />
                        <span className="text-muted">Start: {ass.startDate} | Duration: {ass.days} days</span><br />
                        <span style={{ color: '#2563eb', fontWeight: 700 }}>Days left: {ass.remainingDays}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 