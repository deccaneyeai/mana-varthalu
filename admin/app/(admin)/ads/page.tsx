'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { Plus, Eye, Pause, Play, BarChart3 } from 'lucide-react';

export default function AdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: 'banner', imageUrl: '', videoUrl: '', targetUrl: '',
    placementType: 'auto', autoEveryN: 3, manualPosition: 0, isActive: true,
  });

  useEffect(() => {
    fetchAds();
  }, []);

  async function fetchAds() {
    const snap = await getDocs(query(collection(db, 'ads'), orderBy('createdAt', 'desc')));
    setAds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  async function handleSave() {
    await addDoc(collection(db, 'ads'), {
      ...form, clicks: 0, impressions: 0,
      startDate: new Date(), endDate: null,
      createdBy: '', createdAt: new Date(),
    });
    setShowForm(false);
    fetchAds();
  }

  async function toggleAd(id: string, current: boolean) {
    await updateDoc(doc(db, 'ads', id), { isActive: !current });
    setAds(prev => prev.map(a => a.id === id ? { ...a, isActive: !current } : a));
  }

  if (loading) return <div className="loading-container"><div className="loading-spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="telugu">ప్రకటనలు</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} /> <span className="telugu">కొత్త ప్రకటన</span>
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }} className="telugu">కొత్త ప్రకటన</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="banner">Banner</option>
                <option value="native">Native</option>
                <option value="video">Video</option>
                <option value="interstitial">Interstitial</option>
                <option value="sponsored">Sponsored</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input className="form-input" value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Target URL</label>
              <input className="form-input" value={form.targetUrl} onChange={e => setForm(p => ({ ...p, targetUrl: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Placement</label>
              <select className="form-input" value={form.placementType} onChange={e => setForm(p => ({ ...p, placementType: e.target.value }))}>
                <option value="auto">Auto</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button className="btn btn-primary" onClick={handleSave}>సేవ్</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>రద్దు</button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Placement</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>CTR</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map(ad => (
              <tr key={ad.id}>
                <td><span className="badge" style={{ background: '#FFF8F2', color: '#FF6B00' }}>{ad.type}</span></td>
                <td>{ad.placementType}</td>
                <td>{ad.impressions}</td>
                <td>{ad.clicks}</td>
                <td>{ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) + '%' : '0%'}</td>
                <td>{ad.isActive ? <span className="badge badge-published">Active</span> : <span className="badge badge-draft">Paused</span>}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => toggleAd(ad.id, ad.isActive)}>
                    {ad.isActive ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
