'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { Grid3X3, ToggleLeft, ToggleRight } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const snap = await getDocs(collection(db, 'categories'));
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => a.order - b.order));
      setLoading(false);
    }
    fetch();
  }, []);

  const toggleActive = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'categories', id), { isActive: !current });
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !current } : c));
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner" /></div>;

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }} className="telugu">వర్గాలు</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {categories.map((cat) => (
          <div key={cat.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 className="telugu" style={{ fontSize: '18px', fontWeight: 600 }}>{cat.name_te}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{cat.name_en} • {cat.slug}</p>
            </div>
            <button
              onClick={() => toggleActive(cat.id, cat.isActive)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: cat.isActive ? 'var(--success)' : 'var(--text-muted)' }}
            >
              {cat.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>
        ))}
      </div>
      {categories.length === 0 && (
        <div className="empty-state">
          <Grid3X3 size={64} />
          <p className="telugu">వర్గాలు లేవు. seedCategories ఫంక్షన్ రన్ చేయండి.</p>
        </div>
      )}
    </div>
  );
}
