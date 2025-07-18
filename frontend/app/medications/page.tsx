"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { BACKEND_URL } from '../constants';
import { useRouter } from 'next/navigation';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<{id: number|null, name: string}>({id: null, name: ''});
  const [toast, setToast] = useState<string|null>(null);
  const [errorModal, setErrorModal] = useState<string|null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchMedications() {
      try {
        const res = await axios.get(`${BACKEND_URL}/medications`);
        setMedications(res.data);
      } catch {
        setError('Failed to load medications.');
      } finally {
        setLoading(false);
      }
    }
    fetchMedications();
  }, []);

  async function handleDelete(id: number) {
    setShowModal({id, name: medications.find(m => m.id === id)?.name || ''});
  }

  async function confirmDelete() {
    if (!showModal.id) return;
    try {
      await axios.delete(`${BACKEND_URL}/medications/${showModal.id}`);
      setMedications(meds => meds.filter(m => m.id !== showModal.id));
      setToast(`Medication "${showModal.name}" deleted.`);
    } catch (err: any) {
      if (err.response && err.response.status === 400 && err.response.data?.message?.includes('assigned')) {
        setErrorModal(err.response.data.message);
      } else {
        setToast('Error deleting medication.');
      }
    } finally {
      setShowModal({id: null, name: ''});
      setTimeout(() => setToast(null), 2500);
    }
  }

  return (
    <main>
      <div className="flex flex-between mb-4">
        <h1>Medications</h1>
        <Link href="/medications/new" className="button">Add Medication</Link>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {medications.map(med => (
          <div key={med.id} className="card">
            <div className="card-accent" />
            <div className="card-content" style={{ position: 'relative' }}>
              <div className="card-actions">
                <Link
                  href={`/medications/edit/${med.id}`}
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
                  onClick={() => handleDelete(med.id)}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 8a1 1 0 0 1 1 1v6a1 1 0 0 0 2 0V9a1 1 0 1 1 2 0v6a1 1 0 0 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a1 1 0 0 1 1-1zM4 6a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z"/></svg>
                  <span className="icon-tooltip">Delete</span>
                </button>
              </div>
              <Link href={`/medications/${med.id}`} style={{ fontWeight: 600, fontSize: 20, marginBottom: 4, color: '#2563eb', textDecoration: 'none' }}>{med.name}</Link>
              <div className="text-muted mb-2" style={{ fontSize: 14 }}>Dosage: {med.dosage}</div>
              <div className="text-muted mb-2" style={{ fontSize: 14 }}>Frequency: {med.frequency}</div>
            </div>
          </div>
        ))}
      </div>
      {showModal.id && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,44,68,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(34,44,68,0.18)', padding: 32, minWidth: 320, textAlign: 'center' }}>
            <h2 style={{ marginBottom: 16 }}>Delete Medication</h2>
            <p>Are you sure you want to delete <b>{showModal.name}</b>?</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
              <button className="button" style={{ background: '#ef4444' }} onClick={confirmDelete}>Delete</button>
              <button className="button" style={{ background: '#6366f1' }} onClick={() => setShowModal({id: null, name: ''})}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {errorModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,44,68,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(34,44,68,0.18)', padding: 32, minWidth: 340, textAlign: 'center' }}>
            <h2 style={{ marginBottom: 16, color: '#ef4444' }}>Cannot Delete Medication</h2>
            <p style={{ marginBottom: 16 }}>{errorModal}</p>
            <p style={{ fontSize: 15, color: '#888', marginBottom: 20 }}>You must first delete all assignments for this medication.<br />
              <Link href="/assignments" style={{ color: '#2563eb', textDecoration: 'underline' }}>View Assignments</Link>
            </p>
            <button className="button" style={{ background: '#6366f1', minWidth: 120 }} onClick={() => setErrorModal(null)}>OK</button>
          </div>
        </div>
      )}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: '#222c44', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px rgba(34,44,68,0.18)', zIndex: 2000 }}>{toast}</div>
      )}
    </main>
  );
} 