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
            className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 rounded"
            aria-label="RentalHub — go to homepage"
          >
            <img src="/logo-reversed.svg" alt="RentalHub" height={28} style={{ height: 28, width: 'auto' }} />
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
