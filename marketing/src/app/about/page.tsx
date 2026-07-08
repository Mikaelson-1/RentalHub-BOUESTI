import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About RentalHub',
  description:
    'RentalHub is a product of Mikaelson Initiative — built to make student housing in Nigeria honest, transparent, and free of exploitative agents.',
  alternates: { canonical: 'https://rentalhub.ng/about' },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://rentalhub.ng/about',
    siteName: 'RentalHub',
    title: 'About RentalHub',
    description:
      'We built RentalHub because 1 in 3 Nigerian students pays for housing that was never what it seemed. That ends here.',
  },
};

const APP = 'https://app.rentalhub.ng';

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  {
    figure: '1 in 3',
    label: 'Nigerian students reports paying for housing that wasn’t advertised',
  },
  {
    figure: '₦20k–₦80k',
    label: 'typical agent commission charged to students per placement',
  },
  {
    figure: '48 hrs',
    label: 'our team takes to review and approve every new listing',
  },
  {
    figure: 'Zero',
    label: 'agent fees on RentalHub — ever',
  },
];

const sides = [
  {
    audience: 'Students',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#C75B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    heading: 'For students',
    body: 'Find a verified room near your campus before resumption. See the real total cost — rent, service charge, generator levy — all listed upfront. Contact the landlord directly. No agent, no commission, no drama.',
    cta: 'Browse apartments',
    href: APP,
  },
  {
    audience: 'Landlords',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#C75B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    heading: 'For landlords',
    body: 'List your property in under ten minutes and reach thousands of students searching near your area. No listing fee to start. A field inspector visits once, and your property stays verified for the entire listing period.',
    cta: 'List your property',
    href: `${APP}/list-your-property`,
  },
  {
    audience: 'Campus inspectors',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#C75B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 8v6M8 11h6" />
      </svg>
    ),
    heading: 'For campus inspectors',
    body: 'Local inspectors are the backbone of RentalHub. You visit, photograph, and verify properties in your campus area. You earn per verified listing, build a trusted reputation, and help your fellow students stay safe.',
    cta: 'Become an inspector',
    href: `${APP}/inspectors`,
  },
];

const values = [
  {
    title: 'Trust above everything',
    body: 'Every decision — product, policy, pricing — starts with one question: does this make the platform more trustworthy? If not, we don’t ship it.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#C75B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'No hidden anything',
    body: 'Hidden fees are the original sin of student housing. We require landlords to list every charge. If we discover charges were hidden, the listing comes down.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#C75B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
    ),
  },
  {
    title: 'Community-powered verification',
    body: 'Our inspectors are students and recent graduates from the campuses they cover. Local knowledge is the only kind that matters when we’re checking if a description is honest.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#C75B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.5 20c0-3.4 3-5 6.5-5s6.5 1.6 6.5 5" />
        <circle cx="16.5" cy="8" r="3.2" />
        <path d="M21.5 20c0-3.4-3-5-6.5-5" />
      </svg>
    ),
  },
  {
    title: 'Your money until you move in',
    body: 'We are building escrow-backed payments so your rent deposit sits safely until you physically collect your keys. Your money does not move to the landlord until you do.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#C75B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 7a2 2 0 0 1 2-2h12v4M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5" />
        <circle cx="17" cy="13" r="1.3" />
      </svg>
    ),
  },
];

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="bg-paper pt-16"
      aria-labelledby="about-hero-h1"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-6">
          Our story
        </p>
        <h1
          id="about-hero-h1"
          className="text-ink text-balance mb-6"
          style={{
            fontSize: 'clamp(2.4rem, 4.5vw, 4.5rem)',
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            maxWidth: '22ch',
          }}
        >
          Making student housing honest.
        </h1>
        <div
          className="text-ink2 leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', maxWidth: '62ch' }}
        >
          <p className="mb-4">
            RentalHub is a product of{' '}
            <strong className="font-semibold text-ink">Mikaelson Initiative</strong> — a technology
            company building infrastructure for emerging markets. We started RentalHub after hearing
            the same story too many times: a student pays an agent, travels to campus, and finds the
            room does not exist, costs twice what was advertised, or belongs to someone else entirely.
          </p>
          <p className="mb-4">
            The problem is not that bad landlords exist. The problem is that the system — layers of
            unregulated agents, zero photo standards, no cost transparency — makes it almost
            impossible for a student to know what they are paying for before handing over money.
          </p>
          <p>
            We decided to fix the system. Every listing on RentalHub is inspected in person,
            photographed to a standard, and priced with every charge made visible. No agents in
            the middle. No commissions extracted from students. Just the landlord and a student
            who knows exactly what they are getting.
          </p>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="bg-paper2 py-16 lg:py-20" aria-label="Platform statistics">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(33,29,24,.10)', borderRadius: 18, overflow: 'hidden' }}>
          {stats.map(({ figure, label }) => (
            <div
              key={label}
              className="bg-paper2 p-7 flex flex-col gap-2"
            >
              <dt
                className="text-clay font-semibold leading-none"
                style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.4rem)', letterSpacing: '-0.03em' }}
              >
                {figure}
              </dt>
              <dd
                className="text-ink2 leading-snug"
                style={{ fontSize: '0.9rem' }}
              >
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ThreeSides() {
  return (
    <section className="bg-paper py-20 lg:py-28" aria-labelledby="three-sides-h2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-3">
            Who we serve
          </p>
          <h2
            id="three-sides-h2"
            className="text-ink"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              maxWidth: '30rem',
            }}
          >
            Three sides of every housing search.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sides.map(({ audience, icon, heading, body, cta, href }) => (
            <article
              key={audience}
              className="flex flex-col p-7 rounded-card bg-card"
              style={{ border: '1px solid rgba(33,29,24,.08)' }}
            >
              <div
                className="w-12 h-12 rounded-input flex items-center justify-center mb-5 flex-shrink-0"
                style={{ background: '#F4E2D6' }}
              >
                {icon}
              </div>
              <h3
                className="text-ink font-semibold mb-3"
                style={{ fontSize: '1.0625rem', lineHeight: 1.3 }}
              >
                {heading}
              </h3>
              <p
                className="text-ink2 leading-relaxed mb-6 flex-1"
                style={{ fontSize: '0.9375rem' }}
              >
                {body}
              </p>
              <a
                href={href}
                className="inline-flex items-center gap-1.5 text-clay font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 rounded"
              >
                {cta}
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Values() {
  return (
    <section className="bg-paper2 py-20 lg:py-28" aria-labelledby="values-h2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-3">
            What we stand for
          </p>
          <h2
            id="values-h2"
            className="text-ink"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              maxWidth: '28rem',
            }}
          >
            The principles we will not trade away.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map(({ title, body, icon }) => (
            <article
              key={title}
              className="flex gap-5 p-7 rounded-card bg-card"
              style={{ border: '1px solid rgba(33,29,24,.08)' }}
            >
              <div
                className="w-10 h-10 rounded-input flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#F4E2D6' }}
              >
                {icon}
              </div>
              <div>
                <h3
                  className="text-ink font-semibold mb-2"
                  style={{ fontSize: '1rem', lineHeight: 1.35 }}
                >
                  {title}
                </h3>
                <p
                  className="text-ink2 leading-relaxed"
                  style={{ fontSize: '0.9375rem' }}
                >
                  {body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Company() {
  return (
    <section
      className="py-20 lg:py-28"
      style={{ background: '#211D18' }}
      aria-labelledby="company-h2"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ color: 'rgba(244,238,228,.4)' }}
        >
          The company
        </p>
        <h2
          id="company-h2"
          className="text-balance mb-5"
          style={{
            color: '#F4EEE4',
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
            fontWeight: 400,
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
            maxWidth: '36rem',
          }}
        >
          Built by Mikaelson Initiative.{' '}
          <em style={{ fontStyle: 'italic', color: '#C75B2A' }}>
            For every Nigerian student.
          </em>
        </h2>
        <p
          className="mb-3 max-w-2xl leading-relaxed"
          style={{ color: 'rgba(244,238,228,.55)', fontSize: '1.05rem' }}
        >
          Mikaelson Initiative is a technology company building products that solve real, daily
          friction in emerging markets. RentalHub is our first product focused on housing — and
          we intend to keep expanding it until verified, affordable student accommodation is the
          default expectation across every Nigerian university town.
        </p>
        <p
          className="mb-10 max-w-2xl leading-relaxed"
          style={{ color: 'rgba(244,238,228,.55)', fontSize: '1.05rem' }}
        >
          We are based in Nigeria. Our team includes former students who were burned by this
          exact system. We are not building a marketplace to take a cut of housing. We are
          building infrastructure to make the housing market honest.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={APP}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-pill bg-clay text-white font-semibold text-sm hover:bg-clay-deep transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-soft focus-visible:ring-offset-2"
            style={{ minHeight: 48 }}
          >
            Browse apartments
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </a>
          <a
            href="mailto:hello@mikaelsoninitiative.org"
            className="inline-flex items-center justify-center px-8 py-4 rounded-pill font-semibold text-sm transition-colors duration-150 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2"
            style={{
              border: '1px solid rgba(244,238,228,.18)',
              color: 'rgba(244,238,228,.7)',
              minHeight: 48,
            }}
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
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
        <Stats />
        <ThreeSides />
        <Values />
        <Company />
      </main>
      <Footer />
    </>
  );
}
