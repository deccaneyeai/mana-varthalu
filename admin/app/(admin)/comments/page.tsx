'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { Check, X, Trash2, MessageSquare, AlertTriangle } from 'lucide-react';

export default function CommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [filter]);

  async function fetchComments() {
    setLoading(true);
    let q;
    if (filter === 'all') {
      q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'comments'), where('status', '==', filter), orderBy('createdAt', 'desc'));
    }
    const snap = await getDocs(q);
    setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  async function moderateComment(id: string, status: 'approved' | 'rejected') {
    await updateDoc(doc(db, 'comments', id), { status });
    setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  }

  async function deleteComment(id: string) {
    if (!confirm('ఈ కామెంట్ తొలగించాలా?')) return;
    await deleteDoc(doc(db, 'comments', id));
    setComments(prev => prev.filter(c => c.id !== id));
  }

  const pendingCount = comments.filter(c => c.status === 'pending').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="telugu">కామెంట్లు</h1>
          {pendingCount > 0 && (
            <p style={{ fontSize: '13px', color: 'var(--warning)', marginTop: '4px' }}>
              <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              {' '}{pendingCount} pending comments
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
            <button
              key={f}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f)}
              style={{ textTransform: 'capitalize' }}
            >{f}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-container"><div className="loading-spinner" /></div>
      ) : comments.length === 0 ? (
        <div className="empty-state">
          <MessageSquare size={64} />
          <p className="telugu">కామెంట్లు లేవు</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {comments.map(comment => (
            <div key={comment.id} className="card" style={{
              borderLeft: `4px solid ${comment.status === 'pending' ? '#F59E0B' : comment.status === 'approved' ? '#10B981' : '#EF4444'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <strong>{comment.userName || 'Anonymous'}</strong>
                    <span className={`badge badge-${comment.status === 'approved' ? 'published' : comment.status === 'pending' ? 'pending' : 'rejected'}`}>
                      {comment.status}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {comment.createdAt?.toDate?.()?.toLocaleDateString?.() || ''}
                    </span>
                  </div>
                  <p className="telugu" style={{ fontSize: '15px', lineHeight: 1.8 }}>{comment.text}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Article: {comment.articleId}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginLeft: '16px' }}>
                  {comment.status === 'pending' && (
                    <>
                      <button className="btn btn-sm" style={{ background: '#D1FAE5', color: '#065F46' }}
                        onClick={() => moderateComment(comment.id, 'approved')} title="Approve">
                        <Check size={16} />
                      </button>
                      <button className="btn btn-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}
                        onClick={() => moderateComment(comment.id, 'rejected')} title="Reject">
                        <X size={16} />
                      </button>
                    </>
                  )}
                  <button className="btn btn-sm btn-secondary" onClick={() => deleteComment(comment.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
