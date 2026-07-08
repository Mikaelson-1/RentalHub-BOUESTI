import Link from 'next/link';

const APP = 'https://app.rentalhub.ng';

const links = [
  { label: 'Find housing',  href: APP + '/search' },
  { label: 'How it works',  href: '/#how-it-works' },
  { label: 'List property', href: APP + '/list-your-property' },
  { label: 'Safety',        href: '/safety' },
  { label: 'About',         href: '/about' },
  { label: 'Help',          href: '/help' },
  { label: 'Privacy',       href: '/privacy' },
  { label: 'Terms',         href: '/terms' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#211D18' }} role="contentinfo">
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 rounded"
            aria-label="RentalHub — go to homepage"
          >
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path d="M9 24 L24 11 L39 24" stroke="#C75B2A" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 22 V38 H34 V22" stroke="#F4EEE4" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="24" cy="29" r="3.4" stroke="#C75B2A" strokeWidth="3" />
              <path d="M24 32 V40" stroke="#C75B2A" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span
              className="font-semibold"
              style={{ color: '#F4EEE4', fontSize: '1.05rem', letterSpacing: '-0.02em' }}
            >
              RentalHub
            </span>
          </Link>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-2" role="list">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm transition-colors duration-150 hover:text-paper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-clay rounded"
                    style={{ color: 'rgba(244,238,228,.4)' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-6 text-xs" style={{ color: 'rgba(244,238,228,.22)' }}>
          © 2026 Mikaelson Initiative Ltd. RentalHub is a registered trademark.
        </p>
      </div>
    </footer>
  );
}
