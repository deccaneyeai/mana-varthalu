'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: '\u0C39\u0C4B\u0C2E\u0C4D' },
  { href: '/category/politics', label: '\u0C30\u0C3E\u0C1C\u0C15\u0C40\u0C2F\u0C3E\u0C32\u0C41' },
  { href: '/category/sports', label: '\u0C15\u0C4D\u0C30\u0C40\u0C21\u0C32\u0C41' },
  { href: '/category/entertainment', label: '\u0C35\u0C3F\u0C28\u0C4B\u0C26\u0C02' },
  { href: '/highlights', label: '\u0C39\u0C48\u0C32\u0C48\u0C1F\u0C4D\u0C38\u0C4D' },
  { href: '/live', label: '\u0C32\u0C48\u0C35\u0C4D' },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-logo">\u0C2E\u0C28 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41</Link>
        <nav className="header-nav">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'active telugu' : 'telugu'}
            >{link.label}</Link>
          ))}
          <Link href="/search"><Search size={20} /></Link>
        </nav>
      </div>
    </header>
  );
}
