'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { Bell, Send } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title_te: '', body_te: '', targetAudience: 'all', targetValue: '' });

  useEffect(() => {
    async function fetch() {
      const snap = await getDocs(query(collection(db, 'notifications'), orderBy('sentAt', 'desc')));
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    fetch();
  }, []);

  async function handleSend() {
    await addDoc(collection(db, 'notifications'), {
      ...form, type: 'category', articleId: '', sentAt: new Date(), scheduledAt: null, status: 'sent',
    });
    setShowForm(false);
    setForm({ title_te: '', body_te: '', targetAudience: 'all', targetValue: '' });
  }

  if (loading) return <div className="loading-container"><div className="loading-spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="telugu">నోటిఫికేషన్స్</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Send size={18} /> <span className="telugu">కొత్త నోటిఫికేషన్</span>
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="form-group">
            <label className="form-label telugu">శీర్షిక (తెలుగు)</label>
            <input className="form-input telugu" value={form.title_te} onChange={e => setForm(p => ({ ...p, title_te: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label telugu">వివరాలు (తెలుగు)</label>
            <textarea className="form-input telugu" value={form.body_te} onChange={e => setForm(p => ({ ...p, body_te: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select className="form-input" value={form.targetAudience} onChange={e => setForm(p => ({ ...p, targetAudience: e.target.value }))}>
                <option value="all">All</option>
                <option value="district">District</option>
                <option value="category">Category</option>
              </select>
            </div>
            {form.targetAudience !== 'all' && (
              <div className="form-group">
                <label className="form-label">Target Value</label>
                <input className="form-input" value={form.targetValue} onChange={e => setForm(p => ({ ...p, targetValue: e.target.value }))} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={handleSend}>పంపండి</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>రద్దు</button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th className="telugu">శీర్షిక</th>
              <th>Type</th>
              <th>Target</th>
              <th>Status</th>
              <th>Sent At</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(n => (
              <tr key={n.id}>
                <td className="telugu">{n.title_te}</td>
                <td>{n.type}</td>
                <td>{n.targetAudience === 'all' ? 'All' : `${n.targetAudience}: ${n.targetValue}`}</td>
                <td><span className={`badge badge-${n.status === 'sent' ? 'published' : 'pending'}`}>{n.status}</span></td>
                <td>{n.sentAt?.toDate?.()?.toLocaleDateString?.() || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
