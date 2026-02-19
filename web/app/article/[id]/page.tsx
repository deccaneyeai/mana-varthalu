'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@lib/firebase';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Link from 'next/link';
import { Eye, Clock, Share2, Bookmark, ArrowLeft, Volume2 } from 'lucide-react';

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const snap = await getDoc(doc(db, 'articles', params.id));
      if (snap.exists()) {
        setArticle({ id: snap.id, ...snap.data() });
        // Increment view count
        await updateDoc(doc(db, 'articles', params.id), { views: increment(1) });
      }
      setLoading(false);
    }
    fetch();
  }, [params.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title_te, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  if (loading) return <><Header /><div className="spinner" /></>;
  if (!article) return (
    <>
      <Header />
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 className="telugu">\u0C35\u0C3E\u0C30\u0C4D\u0C24 \u0C15\u0C28\u0C41\u0C17\u0C4A\u0C28\u0C32\u0C47\u0C26\u0C41</h2>
        <Link href="/" className="btn" style={{ marginTop: '16px', display: 'inline-block', padding: '10px 24px', background: 'var(--saffron)', color: 'white', borderRadius: '8px' }}>\u0C39\u0C4B\u0C2E\u0C4D \u0C15\u0C3F \u0C35\u0C46\u0C33\u0C4D\u0C33\u0C02\u0C21\u0C3F</Link>
      </div>
      <Footer />
    </>
  );

  const date = article.publishedAt?.toDate?.()?.toLocaleDateString?.('te-IN', { year: 'numeric', month: 'long', day: 'numeric' }) || '';

  return (
    <>
      <Header />
      <article className="article-detail">
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--saffron)', marginBottom: '16px' }}>
          <ArrowLeft size={16} /> \u0C35\u0C46\u0C28\u0C15\u0C4D\u0C15\u0C3F
        </Link>

        <span className="article-card-category telugu">{article.category}</span>

        <h1 className="article-detail-title">{article.title_te}</h1>

        <div className="article-detail-meta">
          <span>{article.authorName}</span>
          <span><Clock size={14} /> {date}</span>
          <span><Eye size={14} /> {(article.views || 0) + 1} views</span>
        </div>

        {/* Share Bar */}
        <div className="share-bar">
          <button className="share-btn" onClick={handleShare}><Share2 size={16} /> Share</button>
          <button className="share-btn"><Bookmark size={16} /> Save</button>
          {article.audioUrl && (
            <button className="share-btn" onClick={() => {
              const audio = new Audio(article.audioUrl);
              audio.play();
            }}><Volume2 size={16} /> \u0C35\u0C3F\u0C28\u0C02\u0C21\u0C3F</button>
          )}
        </div>

        {article.imageUrl && (
          <img src={article.imageUrl} alt="" className="article-detail-image" />
        )}

        {/* Bullet Summary */}
        {article.summary_bullets_te?.length > 0 && (
          <div style={{ background: 'var(--saffron-bg)', padding: '20px', borderRadius: '12px', marginBottom: '24px', borderLeft: '4px solid var(--saffron)' }}>
            <h3 className="telugu" style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--saffron)' }}>\u0C38\u0C3E\u0C30\u0C3E\u0C02\u0C36\u0C02</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {article.summary_bullets_te.map((b: string, i: number) => (
                <li key={i} className="telugu" style={{ padding: '4px 0', fontSize: '15px', lineHeight: 1.8 }}>\u2022 {b}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="article-detail-body" dangerouslySetInnerHTML={{ __html: article.body_te?.replace(/\n/g, '<br/>') || '' }} />

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {article.tags.map((tag: string) => (
              <span key={tag} style={{ background: 'var(--bg)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>#{tag}</span>
            ))}
          </div>
        )}
      </article>
      <Footer />
    </>
  );
}
