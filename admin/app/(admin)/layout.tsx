'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@lib/firebase';
import {
  LayoutDashboard, FileText, Clock, Grid3X3, Megaphone,
  Users, Bell, Sparkles, Youtube, Settings, BarChart3, LogOut, Image as ImageIcon
} from 'lucide-react';

const NAV_ITEMS = [
  { section: '\u0C2E\u0C41\u0C16\u0C4D\u0C2F\u0C02', items: [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  ]},
  { section: '\u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41', items: [
    { label: '\u0C06\u0C30\u0C4D\u0C1F\u0C3F\u0C15\u0C32\u0C4D\u0C38\u0C4D', icon: FileText, href: '/articles/list' },
    { label: '\u0C2A\u0C46\u0C02\u0C21\u0C3F\u0C02\u0C17\u0C4D', icon: Clock, href: '/articles/pending' },
  ]},
  { section: '\u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C39\u0C23', items: [
    { label: '\u0C35\u0C30\u0C4D\u0C17\u0C3E\u0C32\u0C41', icon: Grid3X3, href: '/categories' },
    { label: '\u0C2F\u0C42\u0C1C\u0C30\u0C4D\u0C32\u0C41', icon: Users, href: '/users' },
    { label: '\u0C2A\u0C4D\u0C30\u0C15\u0C1F\u0C28\u0C32\u0C41', icon: Megaphone, href: '/ads' },
  ]},
  { section: '\u0C07\u0C24\u0C30\u0C02', items: [
    { label: '\u0C28\u0C4B\u0C1F\u0C3F\u0C2B\u0C3F\u0C15\u0C47\u0C37\u0C28\u0C4D\u0C38\u0C4D', icon: Bell, href: '/notifications' },
    { label: '\u0C39\u0C48\u0C32\u0C48\u0C1F\u0C4D\u0C38\u0C4D', icon: Sparkles, href: '/highlights' },
    { label: 'YouTube', icon: Youtube, href: '/youtube' },
    { label: '\u0C38\u0C46\u0C1F\u0C4D\u0C1F\u0C3F\u0C02\u0C17\u0C4D\u0C38\u0C4D', icon: Settings, href: '/config' },
  ]},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role || 'user';
          if (['superadmin', 'editor', 'reporter', 'admanager'].includes(userRole)) {
            setUser({ ...firebaseUser, ...userData });
            setRole(userRole);
          } else {
            await signOut(auth);
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ height: '100vh' }}>
        <div className="loading-spinner" />
        <p>\u0C32\u0C4B\u0C21\u0C4D \u0C05\u0C35\u0C41\u0C24\u0C4B\u0C02\u0C26\u0C3F...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div>
            <h1>\u0C2E\u0C28 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41</h1>
            <div className="tagline">Admin Panel</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((section) => (
            <div key={section.section} className="nav-section">
              <div className="nav-section-title">{section.section}</div>
              {section.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                >
                  <item.icon size={20} />
                  <span className="telugu">{item.label}</span>
                </a>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-light)' }}>
          <button className="nav-item" onClick={handleLogout} style={{ width: '100%' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <h2 className="header-title"></h2>
          <div className="header-actions">
            <span className="role-badge">{role.toUpperCase()}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{user.name || user.email}</span>
            </div>
          </div>
        </header>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
