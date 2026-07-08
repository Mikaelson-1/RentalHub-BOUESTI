import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Find Student Housing',
  description:
    'Browse verified student housing near your campus in Benin City and surrounding areas. Search by area, compare prices, and contact landlords directly — no agents.',
  alternates: { canonical: 'https://rentalhub.ng/properties' },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://rentalhub.ng/properties',
    siteName: 'RentalHub',
    title: 'Find Student Housing — RentalHub',
    description:
      'Verified student housing near your campus. Search by campus or area and find your next home.',
  },
};

const APP = 'https://app.rentalhub.ng';

// ─── Data ─────────────────────────────────────────────────────────────────────

const areas = [
  { label: 'Ugbowo',     value: 'Ugbowo'     },
  { label: 'Ekenwan',    value: 'Ekenwan'    },
  { label: 'Oluku',      value: 'Oluku'      },
  { label: 'Benin City', value: 'Benin City' },
  { label: 'New Benin',  value: 'New Benin'  },
  { label: 'Oka',        value: 'Oka'        },
];

const listings = [
  { title: '3-Bedroom Self-Contain',   area: 'Ugbowo',    price: '₦480,000', from: '#c9b49a', to: '#7e5e42' },
  { title: 'Studio with Generator',    area: 'Ekenwan',   price: '₦280,000', from: '#bfaa90', to: '#6e5440' },
  { title: '2-Room Flat, Ensuite',     area: 'Oluku',     price: '₦350,000', from: '#d1bc9c', to: '#917054' },
  { title: '4-Bedroom Flat',           area: 'New Benin', price: '₦700,000', from: '#c8bca6', to: '#7d7158' },
  { title: 'Single Room, Self-Contain', area: 'Ugbowo',   price: '₦180,000', from: '#cdb89c', to: '#8a7150' },
  { title: '2-Bedroom Duplex',         area: 'Benin City', price: '₦550,000', from: '#bcae9a', to: '#6f6450' },
];

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="bg-paper pt-16"
      aria-labelledby="properties-h1"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">

        {/* Eyebrow */}
        <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-5">
          Browse verified student housing
        </p>

        {/* Headline */}
        <h1
          id="properties-h1"
          className="text-ink text-balance mx-auto mb-4"
          style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: '18ch',
          }}
        >
          Find your campus home.
        </h1>

        <p
          className="text-ink2 mx-auto mb-10"
          style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '44ch' }}
        >
          Every listing is visited, photographed, and verified by a local
          inspector — before it goes live. Search by campus or area to get
          started.
        </p>

        {/* Search form */}
        <form
          method="GET"
          action={`${APP}/search`}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl mx-auto mb-8"
          role="search"
          aria-label="Search student housing"
        >
          <label htmlFor="area-input" className="sr-only">
            Search by campus or area
          </label>
          <input
            id="area-input"
            type="text"
            name="area"
            placeholder="Search by campus or area…"
            autoComplete="off"
            className="flex-1 bg-card text-ink placeholder:text-ink3 px-5 py-3.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
            style={{
              borderRadius: 'var(--radius-input, 11px)',
              border: '1px solid rgba(33,29,24,.14)',
              minHeight: 52,
            }}
          />
          <button
            type="submit"
            className="px-7 py-3.5 rounded-pill bg-clay text-white font-semibold text-sm hover:bg-clay-deep active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 flex-shrink-0 flex items-center justify-center gap-2"
            style={{ minHeight: 52 }}
          >
            Search homes
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>

        {/* Area chips */}
        <nav aria-label="Browse by area">
          <ul
            className="flex flex-wrap justify-center gap-2"
            role="list"
          >
            {areas.map(({ label, value }) => (
              <li key={value}>
                <a
                  href={`${APP}/search?area=${encodeURIComponent(value)}`}
                  className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-ink2 hover:text-ink bg-card hover:bg-paper3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
                  style={{
                    borderRadius: 'var(--radius-pill, 999px)',
                    border: '1px solid rgba(33,29,24,.12)',
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </section>
  );
}

function PopularListings() {
  return (
    <section
      className="bg-paper2 py-16 lg:py-24"
      aria-labelledby="listings-h2"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-3">
            Sample listings
          </p>
          <h2
            id="listings-h2"
            className="text-ink"
            style={{
              fontSize: 'clamp(1.7rem, 3vw, 2.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              maxWidth: '28rem',
            }}
          >
            Popular listings.
          </h2>
          <p
            className="text-ink2 mt-2"
            style={{ fontSize: '0.9375rem', maxWidth: '48ch' }}
          >
            A sample of what&apos;s available on the platform. The full catalogue
            lives on the app.
          </p>
        </div>

        {/* Cards grid */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          role="list"
        >
          {listings.map(({ title, area, price, from, to }) => (
            <li key={`${title}-${area}`}>
              <article
                className="rounded-card overflow-hidden flex flex-col h-full bg-card"
                style={{ border: '1px solid rgba(33,29,24,.08)' }}
              >
                {/* Gradient image placeholder */}
                <div
                  className="w-full"
                  style={{
                    height: 180,
                    background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)`,
                    flexShrink: 0,
                  }}
                  role="img"
                  aria-label={`Property image — ${title}, ${area}`}
                />

                {/* Card body */}
                <div className="flex flex-col flex-1 p-5 gap-3">

                  {/* Verified badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-pill"
                      style={{
                        color: '#1A7A4A',
                        background: 'rgba(26,122,74,.10)',
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="11"
                        height="11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <polyline points="9 12 11 14 15 10" />
                      </svg>
                      Verified
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-ink font-semibold leading-snug"
                    style={{ fontSize: '1rem' }}
                  >
                    {title}
                  </h3>

                  {/* Area */}
                  <p
                    className="text-ink3 flex items-center gap-1.5"
                    style={{ fontSize: '0.875rem' }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="13"
                      height="13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {area}
                  </p>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Price + CTA row */}
                  <div className="flex items-end justify-between pt-2" style={{ borderTop: '1px solid rgba(33,29,24,.08)' }}>
                    <div>
                      <p
                        className="text-ink font-semibold leading-none"
                        style={{ fontSize: '1.0625rem', letterSpacing: '-0.02em' }}
                      >
                        {price}
                        <span
                          className="text-ink3 font-normal ml-1"
                          style={{ fontSize: '0.8125rem' }}
                        >
                          /yr
                        </span>
                      </p>
                    </div>
                    <a
                      href={APP}
                      className="inline-flex items-center gap-1 text-clay font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 rounded"
                      aria-label={`View ${title} on app`}
                    >
                      View on app
                      <svg
                        viewBox="0 0 24 24"
                        width="13"
                        height="13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m9 6 6 6-6 6" />
                      </svg>
                    </a>
                  </div>

                </div>
              </article>
            </li>
          ))}
        </ul>

        {/* CTA band */}
        <div
          className="mt-12 rounded-card px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ background: '#211D18' }}
        >
          <div>
            <p
              className="font-semibold mb-1 text-balance"
              style={{
                color: '#F4EEE4',
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
              }}
            >
              See all verified homes on{' '}
              <span style={{ color: '#C75B2A' }}>app.rentalhub.ng</span>
            </p>
            <p
              style={{ color: 'rgba(244,238,228,.45)', fontSize: '0.9375rem' }}
            >
              Hundreds of listings across Benin City and surrounding campuses.
            </p>
          </div>
          <a
            href={APP}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-pill bg-clay text-white font-semibold text-sm hover:bg-clay-deep active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-soft focus-visible:ring-offset-2 flex-shrink-0"
            style={{ minHeight: 48 }}
          >
            Browse all listings
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PropertiesPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-clay focus:text-white focus:rounded-pill focus:font-semibold"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <PopularListings />
      </main>
      <Footer />
    </>
  );
}
