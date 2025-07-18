"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';

export default function MedicationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [med, setMed] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string|null>(null);

  useEffect(() => {
    async function fetchMed() {
      try {
        const res = await axios.get(`${BACKEND_URL}/medications/${id}`);
        setMed(res.data);
      } catch {
        setError('Failed to load medication.');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchMed();
  }, [id]);

  async function confirmDelete() {
    try {
      await axios.delete(`${BACKEND_URL}/medications/${id}`);
      setToast('Medication deleted.');
      setTimeout(() => router.push('/medications'), 1200);
    } catch {
      setToast('Error deleting medication.');
    } finally {
      setShowModal(false);
    }
  }

  if (loading) return <main><p>Loading...</p></main>;
  if (error) return <main><p style={{ color: 'red' }}>{error}</p></main>;
  if (!med) return <main><p>Medication not found.</p></main>;

  return (
    <main>
      <div className="card" style={{ maxWidth: 480, margin: '40px auto' }}>
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
              onClick={() => setShowModal(true)}
            >
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 8a1 1 0 0 1 1 1v6a1 1 0 0 0 2 0V9a1 1 0 1 1 2 0v6a1 1 0 0 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a1 1 0 0 1 1-1zM4 6a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z"/></svg>
              <span className="icon-tooltip">Delete</span>
            </button>
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 12 }}>{med.name}</h2>
          <div className="text-muted mb-2" style={{ fontSize: 16 }}>Dosage: {med.dosage}</div>
          <div className="text-muted mb-4" style={{ fontSize: 16 }}>Frequency: {med.frequency}</div>
        </div>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,44,68,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(34,44,68,0.18)', padding: 32, minWidth: 320, textAlign: 'center' }}>
            <h2 style={{ marginBottom: 16 }}>Delete Medication</h2>
            <p>Are you sure you want to delete <b>{med.name}</b>?</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
              <button className="button" style={{ background: '#ef4444' }} onClick={confirmDelete}>Delete</button>
              <button className="button" style={{ background: '#6366f1' }} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: '#222c44', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px rgba(34,44,68,0.18)', zIndex: 2000 }}>{toast}</div>
      )}
    </main>
  );
} 