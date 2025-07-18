"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { BACKEND_URL } from '../constants';
import { useRouter } from 'next/navigation';

interface Assignment {
  id: number;
  patient: { id: number; name: string };
  medication: { id: number; name: string; dosage: string; frequency: string };
  startDate: string;
  days: number;
  remainingDays: number;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<{id: number|null, label: string}>({id: null, label: ''});
  const [toast, setToast] = useState<string|null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const res = await axios.get(`${BACKEND_URL}/assignments/with-remaining-days`);
        setAssignments(res.data);
      } catch {
        setError('Failed to load assignments.');
      } finally {
        setLoading(false);
      }
    }
    fetchAssignments();
  }, []);

  function handleDelete(id: number) {
    const a = assignments.find(a => a.id === id);
    setShowModal({id, label: a ? `${a.medication.name} for ${a.patient.name}` : ''});
  }

  async function confirmDelete() {
    if (!showModal.id) return;
    try {
      await axios.delete(`${BACKEND_URL}/assignments/${showModal.id}`);
      setAssignments(list => list.filter(a => a.id !== showModal.id));
      setToast(`Assignment "${showModal.label}" deleted.`);
    } catch {
      setToast('Error deleting assignment.');
    } finally {
      setShowModal({id: null, label: ''});
      setTimeout(() => setToast(null), 2500);
    }
  }

  return (
    <main>
      <div className="flex flex-between mb-4">
        <h1>Assignments</h1>
        <Link href="/assignments/new" className="button">Assign Medication</Link>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        {assignments.map(ass => (
          <div key={ass.id} className="card">
            <div className="card-accent" />
            <div className="card-content" style={{ position: 'relative' }}>
              <div className="card-actions">
                <Link
                  href={`/assignments/edit/${ass.id}`}
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
                  onClick={() => handleDelete(ass.id)}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 8a1 1 0 0 1 1 1v6a1 1 0 0 0 2 0V9a1 1 0 1 1 2 0v6a1 1 0 0 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a1 1 0 0 1 1-1zM4 6a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z"/></svg>
                  <span className="icon-tooltip">Delete</span>
                </button>
              </div>
              <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 4 }}>{ass.medication.name} <span className="text-muted" style={{ fontWeight: 400, fontSize: 16 }}>({ass.medication.dosage}, {ass.medication.frequency})</span></div>
              <div className="mb-2" style={{ fontSize: 15 }}><b>Patient:</b> {ass.patient.name}</div>
              <div className="text-muted mb-2" style={{ fontSize: 14 }}>Start: {ass.startDate} | Duration: {ass.days} days</div>
              <div style={{ color: '#2563eb', fontWeight: 700, fontSize: 15 }}>Days left: {ass.remainingDays}</div>
            </div>
          </div>
        ))}
      </div>
      {showModal.id && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,44,68,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(34,44,68,0.18)', padding: 32, minWidth: 320, textAlign: 'center' }}>
            <h2 style={{ marginBottom: 16 }}>Delete Assignment</h2>
            <p>Are you sure you want to delete <b>{showModal.label}</b>?</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
              <button className="button" style={{ background: '#ef4444' }} onClick={confirmDelete}>Delete</button>
              <button className="button" style={{ background: '#6366f1' }} onClick={() => setShowModal({id: null, label: ''})}>Cancel</button>
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