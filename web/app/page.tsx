'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@lib/firebase';
import Header from '@components/Header';
import Footer from '@components/Footer';
import ArticleCard from '@components/ArticleCard';
import Link from 'next/link';
import { TrendingUp, Sparkles, Eye, Clock, Zap } from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [breakingArticles, setBreakingArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch published articles
      const artSnap = await getDocs(
        query(collection(db, 'articles'), where('status', '==', 'published'), orderBy('publishedAt', 'desc'), limit(30))
      );
      const allArticles = artSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setArticles(allArticles);
      setBreakingArticles(allArticles.filter((a: any) => a.isBreaking));

      // Categories
      const catSnap = await getDocs(query(collection(db, 'categories'), where('isActive', '==', true), orderBy('order')));
      setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // App config for ticker
      const cfgSnap = await getDoc(doc(db, 'appConfig', 'main'));
      if (cfgSnap.exists()) setConfig(cfgSnap.data());

      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = selectedCat === 'all' ? articles : articles.filter(a => a.category === selectedCat);
  const heroArticle = filtered[0];
  const restArticles = filtered.slice(1);

  if (loading) return (
    <>
      <Header />
      <div className="spinner" />
    </>
  );

  return (
    <>
      <Header />

      {/* Breaking News Ticker */}
      {config?.tickerActive && config?.breakingNewsTicker && (
        <div className="ticker">
          <div className="ticker-inner">
            <span className="ticker-badge">\u0C2C\u0C4D\u0C30\u0C47\u0C15\u0C3F\u0C02\u0C17\u0C4D</span>
            <div className="ticker-text">
              <span className="ticker-scroll telugu">{config.breakingNewsTicker}</span>
            </div>
          </div>
        </div>
      )}

      {/* Categories Bar */}
      <div className="categories-bar">
        <div className="categories-bar-inner">
          <button className={`cat-tab telugu ${selectedCat === 'all' ? 'active' : ''}`} onClick={() => setSelectedCat('all')}>\u0C05\u0C28\u0C4D\u0C28\u0C40</button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`cat-tab telugu ${selectedCat === cat.slug ? 'active' : ''}`}
              onClick={() => setSelectedCat(cat.slug)}
            >{cat.name_te}</button>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="main-grid">
          {/* Main Content */}
          <div>
            {/* Hero */}
            {heroArticle && (
              <Link href={`/article/${heroArticle.id}`} className="hero-card" style={{ display: 'block', marginBottom: '24px' }}>
                <img src={heroArticle.imageUrl || '/placeholder.jpg'} alt="" />
                <div className="hero-card-overlay">
                  <span className="article-card-category">{heroArticle.category}</span>
                  <h1 className="hero-card-title">{heroArticle.title_te}</h1>
                  <div className="article-card-meta" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <span>{heroArticle.authorName}</span>
                    <span><Eye size={12} /> {heroArticle.views || 0}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Article Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {restArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {articles.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
                <Zap size={48} style={{ margin: '0 auto 16px' }} />
                <p className="telugu" style={{ fontSize: '18px' }}>\u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41 \u0C24\u0C4D\u0C35\u0C30\u0C32\u0C4B \u0C35\u0C38\u0C4D\u0C24\u0C3E\u0C2F\u0C3F</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            {/* Breaking News */}
            {breakingArticles.length > 0 && (
              <div className="sidebar-section">
                <h3 className="telugu" style={{ color: '#B91C1C' }}>
                  <Zap size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> \u0C2C\u0C4D\u0C30\u0C47\u0C15\u0C3F\u0C02\u0C17\u0C4D \u0C28\u0C4D\u0C2F\u0C42\u0C38\u0C4D
                </h3>
                {breakingArticles.slice(0, 5).map(a => (
                  <Link key={a.id} href={`/article/${a.id}`} style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <p className="telugu" style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.6 }}>{a.title_te}</p>
                  </Link>
                ))}
              </div>
            )}

            {/* Trending */}
            <div className="sidebar-section">
              <h3>
                <TrendingUp size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Trending
              </h3>
              {articles.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((a, i) => (
                <Link key={a.id} href={`/article/${a.id}`} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--saffron)', opacity: 0.3, width: '32px' }}>{i + 1}</span>
                  <p className="telugu" style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.5 }}>{a.title_te}</p>
                </Link>
              ))}
            </div>

            {/* Ad Placeholder */}
            <div className="sidebar-section" style={{ background: 'var(--saffron-bg)', textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Advertisement</p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
