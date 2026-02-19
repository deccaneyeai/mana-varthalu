'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { Settings, Save } from 'lucide-react';

export default function ConfigPage() {
  const [config, setConfig] = useState({
    breakingNewsTicker: '', tickerActive: false,
    adFrequencyNative: 3, adFrequencyInterstitial: 10,
    liveEnabled: true, maintenanceMode: false,
    minAppVersion: '1.0.0', geminiEnabled: true, ttsEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetch() {
      const snap = await getDoc(doc(db, 'appConfig', 'main'));
      if (snap.exists()) setConfig(snap.data() as any);
      setLoading(false);
    }
    fetch();
  }, []);

  async function handleSave() {
    setSaving(true);
    await updateDoc(doc(db, 'appConfig', 'main'), config);
    setSaving(false);
  }

  if (loading) return <div className="loading-container"><div className="loading-spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="telugu">సెట్టింగ్స్</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'సేవ్ చేయండి'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>బ్రేకింగ్ న్యూస్ టిక్కర్</h3>
          <div className="form-group">
            <label className="form-label">టిక్కర్ టెక్స్ట్</label>
            <input className="form-input telugu" value={config.breakingNewsTicker} onChange={e => setConfig(p => ({ ...p, breakingNewsTicker: e.target.value }))} />
          </div>
          <label className="toggle">
            <div className={`toggle-switch ${config.tickerActive ? 'active' : ''}`} onClick={() => setConfig(p => ({ ...p, tickerActive: !p.tickerActive }))} />
            <span>Ticker Active</span>
          </label>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>ప్రకటనల సెట్టింగ్స్</h3>
          <div className="form-group">
            <label className="form-label">Native Ad Frequency (every N articles)</label>
            <input type="number" className="form-input" value={config.adFrequencyNative} onChange={e => setConfig(p => ({ ...p, adFrequencyNative: parseInt(e.target.value) || 3 }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Interstitial Frequency (every N swipes)</label>
            <input type="number" className="form-input" value={config.adFrequencyInterstitial} onChange={e => setConfig(p => ({ ...p, adFrequencyInterstitial: parseInt(e.target.value) || 10 }))} />
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Feature Flags</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label className="toggle">
              <div className={`toggle-switch ${config.liveEnabled ? 'active' : ''}`} onClick={() => setConfig(p => ({ ...p, liveEnabled: !p.liveEnabled }))} />
              <span>Live Streaming</span>
            </label>
            <label className="toggle">
              <div className={`toggle-switch ${config.geminiEnabled ? 'active' : ''}`} onClick={() => setConfig(p => ({ ...p, geminiEnabled: !p.geminiEnabled }))} />
              <span>Gemini AI</span>
            </label>
            <label className="toggle">
              <div className={`toggle-switch ${config.ttsEnabled ? 'active' : ''}`} onClick={() => setConfig(p => ({ ...p, ttsEnabled: !p.ttsEnabled }))} />
              <span>Text-to-Speech</span>
            </label>
            <label className="toggle">
              <div className={`toggle-switch ${config.maintenanceMode ? 'active' : ''}`} onClick={() => setConfig(p => ({ ...p, maintenanceMode: !p.maintenanceMode }))} />
              <span style={{ color: config.maintenanceMode ? 'var(--error)' : undefined }}>Maintenance Mode</span>
            </label>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>App Version</h3>
          <div className="form-group">
            <label className="form-label">Minimum App Version</label>
            <input className="form-input" value={config.minAppVersion} onChange={e => setConfig(p => ({ ...p, minAppVersion: e.target.value }))} />
          </div>
        </div>
      </div>
    </div>
  );
}
