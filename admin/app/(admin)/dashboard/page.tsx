'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { FileText, Clock, Users, Eye, TrendingUp, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    pendingApprovals: 0,
    totalUsers: 0,
    todayViews: 0,
    publishedToday: 0,
    breakingActive: 0,
  });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch pending articles count
        const pendingSnap = await getDocs(
          query(collection(db, 'articles'), where('status', '==', 'pending'))
        );

        // Fetch published articles count
        const publishedSnap = await getDocs(
          query(collection(db, 'articles'), where('status', '==', 'published'))
        );

        // Fetch breaking articles
        const breakingSnap = await getDocs(
          query(collection(db, 'articles'), where('isBreaking', '==', true), where('status', '==', 'published'))
        );

        // Fetch users count
        const usersSnap = await getDocs(collection(db, 'users'));

        // Fetch recent articles
        const recentSnap = await getDocs(
          query(collection(db, 'articles'), orderBy('createdAt', 'desc'), limit(10))
        );

        setStats({
          totalArticles: publishedSnap.size,
          pendingApprovals: pendingSnap.size,
          totalUsers: usersSnap.size,
          todayViews: 0,
          publishedToday: publishedSnap.size,
          breakingActive: breakingSnap.size,
        });

        setRecentArticles(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner" /><p className="telugu">\u0C32\u0C4B\u0C21\u0C4D \u0C05\u0C35\u0C41\u0C24\u0C4B\u0C02\u0C26\u0C3F...</p></div>;
  }

  const statCards = [
    { label: '\u0C2A\u0C4D\u0C30\u0C1A\u0C41\u0C30\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41', value: stats.totalArticles, icon: FileText, color: '#FF6B00' },
    { label: '\u0C06\u0C2E\u0C4B\u0C26\u0C02 \u0C15\u0C4B\u0C38\u0C02', value: stats.pendingApprovals, icon: Clock, color: '#F59E0B' },
    { label: '\u0C2F\u0C42\u0C1C\u0C30\u0C4D\u0C32\u0C41', value: stats.totalUsers, icon: Users, color: '#22C55E' },
    { label: '\u0C2C\u0C4D\u0C30\u0C47\u0C15\u0C3F\u0C02\u0C17\u0C4D \u0C28\u0C4D\u0C2F\u0C42\u0C38\u0C4D', value: stats.breakingActive, icon: AlertTriangle, color: '#EF4444' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }} className="telugu">
        \u0C21\u0C3E\u0C37\u0C4D\u0C2C\u0C4B\u0C30\u0C4D\u0C21\u0C4D
      </h1>

      <div className="stats-grid">
        {statCards.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label telugu">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px', fontWeight: 600 }} className="telugu">\u0C07\u0C1F\u0C40\u0C35\u0C32 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th className="telugu">\u0C36\u0C40\u0C30\u0C4D\u0C37\u0C3F\u0C15</th>
                <th className="telugu">\u0C35\u0C30\u0C4D\u0C17\u0C02</th>
                <th className="telugu">\u0C38\u0C4D\u0C25\u0C3F\u0C24\u0C3F</th>
                <th className="telugu">\u0C30\u0C3E\u0C38\u0C3F\u0C28\u0C35\u0C3E\u0C30\u0C41</th>
              </tr>
            </thead>
            <tbody>
              {recentArticles.map((article) => (
                <tr key={article.id}>
                  <td className="telugu" style={{ maxWidth: '300px' }}>
                    {article.title_te || article.title_en || 'Untitled'}
                  </td>
                  <td className="telugu">{article.category}</td>
                  <td>
                    <span className={`badge badge-${article.status}`}>
                      {article.status}
                    </span>
                  </td>
                  <td>{article.authorName || '-'}</td>
                </tr>
              ))}
              {recentArticles.length === 0 && (
                <tr>
                  <td colSpan={4} className="telugu" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    \u0C07\u0C02\u0C15\u0C3E \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41 \u0C32\u0C47\u0C35\u0C41
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
