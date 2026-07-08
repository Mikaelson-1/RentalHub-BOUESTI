'use client';

import { useState, useEffect } from 'react';

const APP = 'https://app.rentalhub.ng';

const navLinks = [
  { label: 'Find Housing',  href: `${APP}/search` },
  { label: 'Universities',  href: '#campus' },
  { label: 'How it Works',  href: '#how-it-works' },
  { label: 'Safety',        href: `${APP}/safety` },
];

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M9 24 L24 11 L39 24" stroke="#C75B2A" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 22 V38 H34 V22" stroke="#211D18" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="29" r="3.4" stroke="#C75B2A" strokeWidth="3" />
      <path d="M24 32 V40" stroke="#C75B2A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      role="banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        transition: 'background 200ms, box-shadow 200ms',
        background: scrolled ? 'rgba(244,238,228,.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : undefined,
        WebkitBackdropFilter: scrolled ? 'blur(10px)' : undefined,
        boxShadow: scrolled ? '0 1px 0 rgba(33,29,24,.08)' : undefined,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="https://rentalhub.ng"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 rounded"
            aria-label="RentalHub — go to homepage"
          >
            <Mark />
            <span
              className="text-ink font-semibold"
              style={{ fontSize: 20, letterSpacing: '-0.02em' }}
            >
              RentalHub
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-ink2 hover:text-ink transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <a
              href="https://app.rentalhub.ng"
              className="px-5 py-2.5 rounded-pill bg-clay text-white text-sm font-semibold hover:bg-clay-deep transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
              style={{ minHeight: 44 }}
            >
              Browse apartments
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-input text-ink hover:bg-paper2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menuOpen
                ? <><path d="M6 6l12 12M18 6 6 18" /></>
                : <><path d="M3 6h18M3 12h18M3 18h18" /></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden bg-paper border-t shadow-sm"
          style={{ borderColor: 'rgba(33,29,24,.1)' }}
        >
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1" aria-label="Mobile navigation">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="block px-3 py-2.5 rounded-input text-sm font-medium text-ink2 hover:bg-paper2 hover:text-ink transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <div className="pt-3 mt-2" style={{ borderTop: '1px solid rgba(33,29,24,.1)' }}>
              <a
                href="https://app.rentalhub.ng"
                className="block px-3 py-2.5 rounded-pill bg-clay text-white text-sm font-semibold text-center hover:bg-clay-deep transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Browse apartments
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
