'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { Youtube, Save } from 'lucide-react';

export default function YouTubePage() {
  const [config, setConfig] = useState({ channelId: '', channelName: '', isLive: false, liveStreamId: '', latestVideos: [] as any[] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetch() {
      const snap = await getDoc(doc(db, 'youtube', 'config'));
      if (snap.exists()) setConfig(snap.data() as any);
      setLoading(false);
    }
    fetch();
  }, []);

  async function handleSave() {
    setSaving(true);
    await updateDoc(doc(db, 'youtube', 'config'), { channelId: config.channelId, channelName: config.channelName });
    setSaving(false);
  }

  if (loading) return <div className="loading-container"><div className="loading-spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>YouTube</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Channel Configuration</h3>
          <div className="form-group">
            <label className="form-label">Channel ID</label>
            <input className="form-input" value={config.channelId} onChange={e => setConfig(p => ({ ...p, channelId: e.target.value }))} placeholder="UC..." />
          </div>
          <div className="form-group">
            <label className="form-label">Channel Name</label>
            <input className="form-input" value={config.channelName} onChange={e => setConfig(p => ({ ...p, channelName: e.target.value }))} />
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Live Status</h3>
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 16px',
              background: config.isLive ? '#EF4444' : 'var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: config.isLive ? 'pulse 2s infinite' : 'none',
            }}>
              <Youtube size={32} color="white" />
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: config.isLive ? '#EF4444' : 'var(--text-muted)' }}>
              {config.isLive ? '🔴 LIVE NOW' : 'Not Live'}
            </div>
            {config.liveStreamId && <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>Stream: {config.liveStreamId}</p>}
          </div>
        </div>
      </div>

      {config.latestVideos?.length > 0 && (
        <>
          <h3 style={{ margin: '24px 0 16px', fontWeight: 600 }}>Latest Videos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {config.latestVideos.map((v: any) => (
              <div key={v.videoId} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <img src={v.thumbnail} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '12px 16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>{v.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{v.publishedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
