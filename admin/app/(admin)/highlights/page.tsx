'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { Sparkles } from 'lucide-react';

export default function HighlightsPage() {
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const snap = await getDocs(query(collection(db, 'highlights'), orderBy('createdAt', 'desc')));
      setHighlights(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) return <div className="loading-container"><div className="loading-spinner" /></div>;

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }} className="telugu">హైలైట్స్</h1>
      {highlights.length === 0 ? (
        <div className="empty-state">
          <Sparkles size={64} />
          <h3 className="telugu">హైలైట్స్ లేవు</h3>
          <p className="telugu">ప్రతిరోజు ఉదయం 7 గంటలకు ఆటోమేటిక్ గా తయారవుతాయి</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {highlights.map(h => (
            <div key={h.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontWeight: 600 }}>📅 {h.date}</h3>
                {h.isAIGenerated && <span className="badge" style={{ background: '#F3E8FF', color: '#7C3AED' }}>🤖 AI Generated</span>}
              </div>
              <p className="telugu" style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '12px' }}>{h.summaryText_te}</p>
              {h.bulletPoints_te?.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {h.bulletPoints_te.map((b: string, i: number) => (
                    <li key={i} className="telugu" style={{ padding: '4px 0', fontSize: '14px', borderLeft: '3px solid var(--saffron)', paddingLeft: '12px', marginBottom: '6px' }}>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
