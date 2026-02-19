'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const snap = await getDocs(query(collection(db, 'articles'), orderBy('createdAt', 'desc')));
      setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) return <div className="loading-container"><div className="loading-spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="telugu">\u0C05\u0C28\u0C4D\u0C28\u0C3F \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41</h1>
        <a href="/articles/editor/new" className="btn btn-primary">
          <Plus size={18} />
          <span className="telugu">\u0C15\u0C4A\u0C24\u0C4D\u0C24 \u0C35\u0C3E\u0C30\u0C4D\u0C24</span>
        </a>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th className="telugu">\u0C36\u0C40\u0C30\u0C4D\u0C37\u0C3F\u0C15</th>
                <th className="telugu">\u0C35\u0C30\u0C4D\u0C17\u0C02</th>
                <th className="telugu">\u0C38\u0C4D\u0C25\u0C3F\u0C24\u0C3F</th>
                <th className="telugu">\u0C35\u0C4D\u0C2F\u0C42\u0C38\u0C4D</th>
                <th className="telugu">\u0C30\u0C3E\u0C38\u0C3F\u0C28\u0C35\u0C3E\u0C30\u0C41</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td className="telugu" style={{ maxWidth: '250px' }}>{a.title_te || a.title_en || 'Untitled'}</td>
                  <td className="telugu">{a.category}</td>
                  <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                  <td>{a.views || 0}</td>
                  <td>{a.authorName || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a href={`/articles/editor/${a.id}`} className="btn btn-sm btn-secondary">
                        <Edit size={14} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
