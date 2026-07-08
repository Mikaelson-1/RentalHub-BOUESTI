import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Safety & Trust' };

const APP = 'https://app.rentalhub.ng';

// ─── Data ─────────────────────────────────────────────────────────────────────

const pillars = [
  {
    layer: 'Layer 01',
    title: 'Every listing is reviewed by our team',
    bullets: [
      'Admins review the property photos for accuracy and quality',
      'Listings are checked against known pricing in the area',
      'Duplicate or suspicious listings are removed before going live',
      'Any listing that fails review is sent back to the landlord with notes',
    ],
  },
  {
    layer: 'Layer 02',
    title: 'Landlords are identity-verified',
    bullets: [
      'Government-issued ID uploaded and reviewed by our team',
      'A live selfie matched against the ID to prevent impersonation',
      'Proof of property ownership or landlord’s agreement required',
      'Unverified landlords cannot publish listings — only drafts',
    ],
  },
  {
    layer: 'Layer 03',
    title: 'Campus inspectors visit properties in person',
    bullets: [
      'Inspectors are registered students at the same campus',
      'They carry a verified RentalHub inspector badge and matric card',
      'Their report includes photos, condition notes, and a live video walkthrough',
      'Reports are reviewed before being shared with requesting students',
    ],
  },
  {
    layer: 'Layer 04',
    title: 'Your rent is held in escrow until move-in',
    bullets: [
      'All payments processed through Paystack — a CBN-licensed PSP',
      'Funds held in escrow until you manually confirm move-in',
      'If the property doesn’t match the listing, you can raise a dispute before confirming',
      'Landlords are paid within 24 hours of your move-in confirmation',
    ],
  },
];

const warnings = [
  {
    title: 'Never pay outside the platform',
    body: 'Landlords or anyone claiming to represent RentalHub should never ask you to send money via bank transfer, POS, or any channel other than the in-app payment flow. If someone asks you to pay outside the platform, it is a scam — report it immediately.',
  },
  {
    title: 'We will never call you to request payment',
    body: 'RentalHub will never call you to ask for a payment, a transfer, or your bank details. All payment instructions come from the app only.',
  },
  {
    title: 'Your booking is only confirmed in-app',
    body: 'A WhatsApp message, a phone call, or a receipt from a landlord’s personal account does not constitute a confirmed booking. Your booking is only confirmed when you see a confirmation inside your RentalHub account.',
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#1A7A4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C75B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m10.29 3.86-8.16 14.11A1 1 0 0 0 3 19.61h17.14a1 1 0 0 0 .87-1.64L12.7 3.86a1 1 0 0 0-1.73 0h.02v-.02l-.7.02Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      aria-labelledby="safety-h1"
      style={{ background: '#211D18' }}
      className="pt-32 pb-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ color: 'rgba(244,238,228,.38)', letterSpacing: '0.14em' }}
        >
          Safety &amp; Trust
        </p>
        <h1
          id="safety-h1"
          className="text-balance mb-6"
          style={{
            color: '#F4EEE4',
            fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
          }}
        >
          Your safety is the whole point.
        </h1>
        <p
          className="leading-relaxed max-w-2xl"
          style={{
            color: 'rgba(244,238,228,.55)',
            fontSize: 'clamp(1rem, 1.8vw, 1.175rem)',
            lineHeight: 1.75,
          }}
        >
          Everything on RentalHub exists to prevent scams. Before a listing ever
          reaches you, it has passed through multiple layers of review — human
          and automated. We verify landlords, inspect properties in person, and
          hold your money in escrow until you confirm the place is what we said
          it was. This page explains exactly how.
        </p>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section aria-labelledby="pillars-h2" className="py-20 lg:py-28 bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-3">
            How we protect you
          </p>
          <h2
            id="pillars-h2"
            className="text-ink"
            style={{
              fontSize: 'clamp(1.7rem, 3vw, 2.4rem)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            Four layers between you and a scam.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {pillars.map(({ layer, title, bullets }) => (
            <article
              key={layer}
              className="p-7 lg:p-8 rounded-card bg-card flex flex-col gap-5"
              style={{ border: '1px solid rgba(33,29,24,.08)' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-input flex items-center justify-center flex-shrink-0 text-clay"
                  style={{ background: '#F4E2D6' }}
                >
                  <ShieldIcon />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold tracking-widest text-clay uppercase mb-1"
                    style={{ letterSpacing: '0.12em' }}
                  >
                    {layer}
                  </p>
                  <h3
                    className="text-ink font-semibold"
                    style={{ fontSize: '1.0625rem', lineHeight: 1.35 }}
                  >
                    {title}
                  </h3>
                </div>
              </div>

              <ul className="flex flex-col gap-2.5" role="list">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(26,122,74,.1)' }}
                    >
                      <CheckIcon />
                    </span>
                    <span
                      className="text-ink2 leading-relaxed"
                      style={{ fontSize: '0.9375rem' }}
                    >
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WatchOut() {
  return (
    <section aria-labelledby="warnings-h2" className="py-20 lg:py-28 bg-paper2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-3">
            Scam awareness
          </p>
          <h2
            id="warnings-h2"
            className="text-ink"
            style={{
              fontSize: 'clamp(1.7rem, 3vw, 2.4rem)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            What to watch out for.
          </h2>
          <p
            className="text-ink2 mt-3 max-w-xl leading-relaxed"
            style={{ fontSize: '0.9375rem' }}
          >
            Even with all our safeguards, it pays to know the common tactics
            bad actors use. Bookmark this page and share it with a classmate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {warnings.map(({ title, body }) => (
            <article
              key={title}
              className="p-6 rounded-card bg-card flex flex-col gap-4"
              style={{ border: '1px solid rgba(33,29,24,.08)' }}
            >
              <div
                className="w-9 h-9 rounded-input flex items-center justify-center flex-shrink-0"
                style={{ background: '#F4E2D6' }}
              >
                <WarningIcon />
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

function ReportCTA() {
  return (
    <section
      aria-labelledby="report-h2"
      className="py-20 lg:py-28"
      style={{ background: '#211D18' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ color: 'rgba(244,238,228,.38)', letterSpacing: '0.14em' }}
        >
          Report a problem
        </p>
        <h2
          id="report-h2"
          className="text-balance mb-5"
          style={{
            color: '#F4EEE4',
            fontSize: 'clamp(1.7rem, 3.2vw, 2.8rem)',
            fontWeight: 400,
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
          }}
        >
          Seen something suspicious?{' '}
          <em style={{ fontStyle: 'italic', color: '#C75B2A' }}>
            Tell us immediately.
          </em>
        </h2>
        <p
          className="mb-10 max-w-lg leading-relaxed"
          style={{ color: 'rgba(244,238,228,.5)', fontSize: '1.05rem' }}
        >
          If you encounter a suspicious listing, a landlord asking for payment
          outside the platform, or anything that feels off, contact our team
          directly. We investigate every report.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:hello@mikaelsoninitiative.org?subject=Safety%20Report%20%E2%80%94%20RentalHub"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-pill bg-clay text-white font-semibold text-sm hover:bg-clay-deep transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-soft focus-visible:ring-offset-2"
            style={{ minHeight: 48 }}
          >
            Email our safety team
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </a>
          <a
            href={APP}
            className="inline-flex items-center justify-center px-8 py-4 rounded-pill font-semibold text-sm transition-colors duration-150 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2"
            style={{
              border: '1px solid rgba(244,238,228,.18)',
              color: 'rgba(244,238,228,.7)',
              minHeight: 48,
            }}
          >
            Go to the app
          </a>
        </div>
        <p
          className="mt-6 text-xs"
          style={{ color: 'rgba(244,238,228,.3)' }}
        >
          hello@mikaelsoninitiative.org &mdash; we respond within one business day.
        </p>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SafetyPage() {
  return (
    <div className="bg-paper min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-clay focus:text-white focus:rounded-pill focus:font-semibold"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Pillars />
        <WatchOut />
        <ReportCTA />
      </main>
      <Footer />
    </div>
  );
}
