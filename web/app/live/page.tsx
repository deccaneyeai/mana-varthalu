'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@lib/firebase';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { Youtube, Radio } from 'lucide-react';

export default function LivePage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const snap = await getDoc(doc(db, 'youtube', 'config'));
      if (snap.exists()) setConfig(snap.data());
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px' }}>
          <Radio size={24} style={{ display: 'inline', verticalAlign: 'middle', color: config?.isLive ? '#EF4444' : 'var(--text-muted)' }} />{' '}
          <span className="telugu">{config?.isLive ? '\uD83D\uDD34 \u0C32\u0C48\u0C35\u0C4D \u0C1F\u0C40\u0C35\u0C40' : '\u0C35\u0C40\u0C21\u0C3F\u0C2F\u0C4B\u0C32\u0C41'}</span>
        </h1>

        {loading ? <div className="spinner" /> : (
          <>
            {/* Live Player */}
            {config?.isLive && config?.liveStreamId && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${config.liveStreamId}?autoplay=1`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontWeight: 600, color: '#EF4444' }}>LIVE NOW</span>
                  <span style={{ color: 'var(--text-muted)' }}>{config.channelName}</span>
                </div>
              </div>
            )}

            {/* Latest Videos */}
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }} className="telugu">\u0C24\u0C3E\u0C1C\u0C3E \u0C35\u0C40\u0C21\u0C3F\u0C2F\u0C4B\u0C32\u0C41</h2>
            {config?.latestVideos?.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {config.latestVideos.map((v: any) => (
                  <a key={v.videoId} href={`https://youtube.com/watch?v=${v.videoId}`} target="_blank" rel="noopener noreferrer" className="article-card">
                    <img src={v.thumbnail} alt="" className="article-card-img" />
                    <div className="article-card-body">
                      <h3 style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.5 }}>{v.title}</h3>
                      <div className="article-card-meta"><span>{v.publishedAt}</span></div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <Youtube size={48} style={{ margin: '0 auto 16px', display: 'block' }} />
                <p className="telugu">\u0C35\u0C40\u0C21\u0C3F\u0C2F\u0C4B\u0C32\u0C41 \u0C32\u0C47\u0C35\u0C41</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
