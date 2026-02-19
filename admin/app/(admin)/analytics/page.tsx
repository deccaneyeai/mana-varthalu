'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { BarChart3, TrendingUp, Eye, FileText } from 'lucide-react';

export default function AnalyticsPage() {
  const [topArticles, setTopArticles] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      // Top articles by views
      const artSnap = await getDocs(
        query(collection(db, 'articles'), where('status', '==', 'published'), orderBy('views', 'desc'))
      );
      setTopArticles(artSnap.docs.slice(0, 10).map(d => ({ id: d.id, ...d.data() })));

      // Category distribution
      const stats: Record<string, number> = {};
      artSnap.docs.forEach(d => {
        const cat = d.data().category || 'uncategorized';
        stats[cat] = (stats[cat] || 0) + 1;
      });
      setCategoryStats(stats);
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) return <div className="loading-container"><div className="loading-spinner" /></div>;

  const maxViews = Math.max(...topArticles.map(a => a.views || 0), 1);

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }} className="telugu">అనలిటిక్స్</h1>

      <div className="charts-grid">
        {/* Category Distribution */}
        <div className="chart-card">
          <h3 className="telugu">వర్గం వారీ వార్తలు</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(categoryStats).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '100px', fontSize: '13px' }} className="telugu">{cat}</span>
                <div style={{ flex: 1, height: '24px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${(count / Math.max(...Object.values(categoryStats))) * 100}%`,
                    background: 'linear-gradient(90deg, #FF6B00, #FF8C00)', borderRadius: '4px',
                    display: 'flex', alignItems: 'center', paddingLeft: '8px',
                    color: 'white', fontSize: '12px', fontWeight: 600, minWidth: '30px',
                  }}>{count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="chart-card">
          <h3 className="telugu">సారాంశం</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
            <div style={{ textAlign: 'center', padding: '20px', background: 'var(--saffron-bg)', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--saffron)' }}>{topArticles.length}</div>
              <div className="telugu" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ప్రచురించినవి</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: '#F0FDF4', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--success)' }}>
                {topArticles.reduce((acc, a) => acc + (a.views || 0), 0)}
              </div>
              <div className="telugu" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>మొత్తం వ్యూస్</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: '#EFF6FF', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#3B82F6' }}>
                {topArticles.reduce((acc, a) => acc + (a.shares || 0), 0)}
              </div>
              <div className="telugu" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>షేర్లు</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: '#FEF3C7', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#D97706' }}>
                {Object.keys(categoryStats).length}
              </div>
              <div className="telugu" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>వర్గాలు</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Articles Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <h3 style={{ fontWeight: 600 }} className="telugu">\u0C1F\u0C3E\u0C2A\u0C4D 10 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th className="telugu">శీర్షిక</th>
              <th className="telugu">వర్గం</th>
              <th>వ్యూస్</th>
              <th>షేర్లు</th>
            </tr>
          </thead>
          <tbody>
            {topArticles.map((a, i) => (
              <tr key={a.id}>
                <td>{i + 1}</td>
                <td className="telugu" style={{ maxWidth: '300px' }}>{a.title_te || a.title_en}</td>
                <td className="telugu">{a.category}</td>
                <td>{a.views || 0}</td>
                <td>{a.shares || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
