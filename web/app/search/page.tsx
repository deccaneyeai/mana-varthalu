'use client';

import { useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@lib/firebase';
import Header from '@components/Header';
import Footer from '@components/Footer';
import ArticleCard from '@components/ArticleCard';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    // Full-text search: fetch recent published articles and filter client-side
    // (for production, integrate Algolia or Typesense)
    const snap = await getDocs(
      query(collection(db, 'articles'), where('status', '==', 'published'), orderBy('publishedAt', 'desc'))
    );
    const q = searchQuery.toLowerCase();
    const filtered = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter((a: any) =>
        a.title_te?.toLowerCase().includes(q) ||
        a.title_en?.toLowerCase().includes(q) ||
        a.tags?.some((t: string) => t.toLowerCase().includes(q)) ||
        a.category?.toLowerCase().includes(q)
      );
    setResults(filtered);
    setLoading(false);
  }

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="telugu" style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px' }}>\u0C35\u0C46\u0C24\u0C15\u0C02\u0C21\u0C3F</h1>

        <div className="search-bar">
          <input
            className="search-input telugu"
            placeholder="\u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41 \u0C35\u0C46\u0C24\u0C15\u0C02\u0C21\u0C3F..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            style={{ padding: '14px 28px', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Search size={20} /> <span className="telugu">\u0C35\u0C46\u0C24\u0C15\u0C02\u0C21\u0C3F</span>
          </button>
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {searched && (
              <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
                {results.length} results for &quot;{searchQuery}&quot;
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {results.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
