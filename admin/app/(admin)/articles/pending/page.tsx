'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function PendingApprovalsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    const snap = await getDocs(
      query(collection(db, 'articles'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'))
    );
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setArticles(items);
    if (items.length > 0 && !selected) setSelected(items[0]);
    setLoading(false);
  }

  async function handleApprove(articleId: string) {
    await updateDoc(doc(db, 'articles', articleId), {
      status: 'published',
      publishedAt: new Date(),
    });
    setSelected(null);
    fetchPending();
  }

  async function handleReject(articleId: string) {
    await updateDoc(doc(db, 'articles', articleId), {
      status: 'rejected',
      rejectionReason,
    });
    setRejectionReason('');
    setShowReject(false);
    setSelected(null);
    fetchPending();
  }

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner" /><p className="telugu">\u0C32\u0C4B\u0C21\u0C4D \u0C05\u0C35\u0C41\u0C24\u0C4B\u0C02\u0C26\u0C3F...</p></div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }} className="telugu">
        \u0C06\u0C2E\u0C4B\u0C26\u0C02 \u0C15\u0C4B\u0C38\u0C02 \u0C09\u0C28\u0C4D\u0C28 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41
      </h1>

      {articles.length === 0 ? (
        <div className="empty-state">
          <CheckCircle size={64} />
          <h3 className="telugu">\u0C06\u0C2E\u0C4B\u0C26\u0C02 \u0C15\u0C4B\u0C38\u0C02 \u0C0F\u0C2E\u0C40 \u0C32\u0C47\u0C35\u0C41</h3>
          <p className="telugu">\u0C05\u0C28\u0C4D\u0C28\u0C3F \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41 \u0C38\u0C2E\u0C40\u0C15\u0C4D\u0C37\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C4D\u0C21\u0C3E\u0C2F\u0C3F</p>
        </div>
      ) : (
        <div className="two-panel-equal">
          {/* Left: Article list */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => { setSelected(article); setShowReject(false); }}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  background: selected?.id === article.id ? 'var(--saffron-bg)' : 'white',
                  borderLeft: selected?.id === article.id ? '3px solid var(--saffron)' : '3px solid transparent',
                }}
              >
                <h4 className="telugu" style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
                  {article.title_te || article.title_en || 'Untitled'}
                </h4>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>{article.authorName || 'Unknown'}</span>
                  <span className="telugu">{article.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Article preview */}
          <div className="card">
            {selected ? (
              <>
                {selected.imageUrl && (
                  <img
                    src={selected.imageUrl}
                    alt=""
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
                  />
                )}
                <span className="badge badge-pending" style={{ marginBottom: '12px' }}>{selected.category}</span>
                <h2 className="telugu" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.5 }}>
                  {selected.title_te || selected.title_en}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {selected.authorName} | {selected.createdAt?.toDate?.()?.toLocaleDateString?.('te-IN') || ''}
                </p>
                <div className="telugu" style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '24px', color: 'var(--text-secondary)' }}>
                  {(selected.body_te || selected.body_en || '').substring(0, 500)}...
                </div>

                {!showReject ? (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" onClick={() => handleApprove(selected.id)}>
                      <CheckCircle size={18} />
                      <span className="telugu">\u0C06\u0C2E\u0C4B\u0C26\u0C3F\u0C02\u0C1A\u0C41</span>
                    </button>
                    <button className="btn btn-danger" onClick={() => setShowReject(true)}>
                      <XCircle size={18} />
                      <span className="telugu">\u0C24\u0C3F\u0C30\u0C38\u0C4D\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C41</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="form-group">
                      <label className="form-label telugu">\u0C24\u0C3F\u0C30\u0C38\u0C4D\u0C15\u0C30\u0C23 \u0C15\u0C3E\u0C30\u0C23\u0C02</label>
                      <textarea
                        className="form-input telugu"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="\u0C15\u0C3E\u0C30\u0C23\u0C02 \u0C30\u0C3E\u0C2F\u0C02\u0C21\u0C3F..."
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-danger" onClick={() => handleReject(selected.id)}>\u0C24\u0C3F\u0C30\u0C38\u0C4D\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C41</button>
                      <button className="btn btn-secondary" onClick={() => setShowReject(false)}>\u0C30\u0C26\u0C4D\u0C26\u0C41</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <Eye size={48} />
                <p className="telugu">\u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C28\u0C41 \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
