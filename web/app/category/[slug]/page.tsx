'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@lib/firebase';
import Header from '@components/Header';
import Footer from '@components/Footer';
import ArticleCard from '@components/ArticleCard';

const categoryNames: Record<string, string> = {
  politics: '\u0C30\u0C3E\u0C1C\u0C15\u0C40\u0C2F\u0C3E\u0C32\u0C41',
  sports: '\u0C15\u0C4D\u0C30\u0C40\u0C21\u0C32\u0C41',
  entertainment: '\u0C35\u0C3F\u0C28\u0C4B\u0C26\u0C02',
  crime: '\u0C28\u0C47\u0C30\u0C02',
  business: '\u0C35\u0C4D\u0C2F\u0C3E\u0C2A\u0C3E\u0C30\u0C02',
  technology: '\u0C1F\u0C46\u0C15\u0C4D\u0C28\u0C3E\u0C32\u0C1C\u0C40',
  education: '\u0C35\u0C3F\u0C26\u0C4D\u0C2F',
  health: '\u0C06\u0C30\u0C4B\u0C17\u0C4D\u0C2F\u0C02',
  agriculture: '\u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C3E\u0C2F\u0C02',
  devotional: '\u0C06\u0C27\u0C4D\u0C2F\u0C3E\u0C24\u0C4D\u0C2E\u0C3F\u0C15\u0C02',
  district: '\u0C1C\u0C3F\u0C32\u0C4D\u0C32\u0C3E \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41',
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryName = categoryNames[params.slug] || params.slug;

  useEffect(() => {
    async function fetch() {
      const snap = await getDocs(
        query(collection(db, 'articles'), where('status', '==', 'published'), where('category', '==', params.slug), orderBy('publishedAt', 'desc'))
      );
      setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    fetch();
  }, [params.slug]);

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="telugu" style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px', borderBottom: '3px solid var(--saffron)', paddingBottom: '12px', display: 'inline-block' }}>
          {categoryName}
        </h1>
        {loading ? <div className="spinner" /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {articles.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        )}
        {!loading && articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <p className="telugu" style={{ fontSize: '18px' }}>\u0C08 \u0C35\u0C30\u0C4D\u0C17\u0C02\u0C32\u0C4B \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41 \u0C32\u0C47\u0C35\u0C41</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
