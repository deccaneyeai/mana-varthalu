import Link from 'next/link';

const footerCategories = [
  { href: '/category/politics', label: '\u0C30\u0C3E\u0C1C\u0C15\u0C40\u0C2F\u0C3E\u0C32\u0C41' },
  { href: '/category/sports', label: '\u0C15\u0C4D\u0C30\u0C40\u0C21\u0C32\u0C41' },
  { href: '/category/entertainment', label: '\u0C35\u0C3F\u0C28\u0C4B\u0C26\u0C02' },
  { href: '/category/crime', label: '\u0C28\u0C47\u0C30\u0C02' },
  { href: '/category/business', label: '\u0C35\u0C4D\u0C2F\u0C3E\u0C2A\u0C3E\u0C30\u0C02' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h4 className="telugu">\u0C2E\u0C28 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41</h4>
          <p style={{ fontSize: '14px', lineHeight: 1.6 }} className="telugu">
            \u0C06\u0C02\u0C27\u0C4D\u0C30\u0C2A\u0C4D\u0C30\u0C26\u0C47\u0C36\u0C4D \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23 \u0C24\u0C3E\u0C1C\u0C3E \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41, \u0C30\u0C3E\u0C1C\u0C15\u0C40\u0C2F\u0C3E\u0C32\u0C41, \u0C15\u0C4D\u0C30\u0C40\u0C21\u0C32\u0C41, \u0C35\u0C3F\u0C28\u0C4B\u0C26\u0C02.
          </p>
        </div>
        <div>
          <h4 className="telugu">\u0C35\u0C30\u0C4D\u0C17\u0C3E\u0C32\u0C41</h4>
          {footerCategories.map(cat => (
            <Link key={cat.href} href={cat.href} className="telugu">{cat.label}</Link>
          ))}
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link href="/highlights">Highlights</Link>
          <Link href="/live">Live TV</Link>
          <Link href="/search">Search</Link>
        </div>
        <div>
          <h4>Connect</h4>
          <a href="#">YouTube</a>
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>\u00A9 {new Date().getFullYear()} \u0C2E\u0C28 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41. All rights reserved.</span>
        <span>Powered by Deccan Eye AI</span>
      </div>
    </footer>
  );
}
