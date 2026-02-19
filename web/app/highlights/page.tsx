'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@lib/firebase';
import Header from '@components/Header';
import Footer from '@components/Footer';
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

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="telugu" style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
          <Sparkles size={24} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--saffron)' }} /> \u0C39\u0C48\u0C32\u0C48\u0C1F\u0C4D\u0C38\u0C4D
        </h1>
        <p className="telugu" style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>\u0C2A\u0C4D\u0C30\u0C24\u0C3F\u0C30\u0C4B\u0C1C\u0C41 AI \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C24\u0C2F\u0C3E\u0C30\u0C41 \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C28 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32 \u0C38\u0C3E\u0C30\u0C3E\u0C02\u0C36\u0C02</p>

        {loading ? <div className="spinner" /> : highlights.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
            <Sparkles size={48} style={{ margin: '0 auto 16px', display: 'block' }} />
            <p className="telugu">\u0C39\u0C48\u0C32\u0C48\u0C1F\u0C4D\u0C38\u0C4D \u0C24\u0C4D\u0C35\u0C30\u0C32\u0C4B \u0C35\u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C3F</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {highlights.map(h => (
              <div key={h.id} className="highlight-card">
                <h3>\uD83D\uDCC5 {h.date} {h.isAIGenerated && <span style={{ fontSize: '12px', background: '#F3E8FF', color: '#7C3AED', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>\uD83E\uDD16 AI</span>}</h3>
                <p className="telugu" style={{ fontSize: '16px', lineHeight: 2, marginBottom: '12px' }}>{h.summaryText_te}</p>
                {h.bulletPoints_te?.map((b: string, i: number) => (
                  <div key={i} className="highlight-bullet">{b}</div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
