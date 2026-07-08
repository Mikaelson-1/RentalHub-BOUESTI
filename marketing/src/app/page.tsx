import Navbar from '@/components/Navbar';
import {
  MotionProvider,
  FadeUp,
  Stagger,
  StaggerItem,
  HeroStagger,
  HeroItem,
} from '@/components/AnimateIn';

const APP = 'https://app.rentalhub.ng';

// ─── Campuses ─────────────────────────────────────────────────────────────────

const CAMPUSES = [
  { id: 'bouesti',  name: 'BOUESTI, Ikere-Ekiti',                        live: true  },
  { id: 'unilag',   name: 'University of Lagos',                          live: true  },
  { id: 'unilorin', name: 'University of Ilorin',                         live: true  },
  { id: 'fuoye',    name: 'Federal University Oye-Ekiti',                 live: true  },
  { id: 'eksu',     name: 'Ekiti State University, Ado-Ekiti',            live: true  },
  { id: 'abuad',    name: 'Afe Babalola University, Ado-Ekiti',           live: true  },
  { id: 'lasu',     name: 'Lagos State University',                       live: true  },
  { id: 'funaab',   name: 'Federal University of Agriculture, Abeokuta', live: true  },
  { id: 'oou',      name: 'Olabisi Onabanjo University',                  live: true  },
  { id: 'covenant', name: 'Covenant University, Ota',                     live: true  },
  { id: 'babcock',  name: 'Babcock University, Ilishan-Remo',             live: true  },
  { id: 'ui',       name: 'University of Ibadan',                         live: true  },
  { id: 'lautech',  name: 'Ladoke Akintola University of Technology',     live: true  },
  { id: 'oau',      name: 'Obafemi Awolowo University',                   live: true  },
  { id: 'uniosun',  name: 'Osun State University',                        live: true  },
  { id: 'futa',     name: 'Federal University of Technology, Akure',      live: true  },
  { id: 'aaua',     name: 'Adekunle Ajasin University, Akungba-Akoko',    live: true  },
  { id: 'unn',      name: 'University of Nigeria, Nsukka',                live: false },
  { id: 'abu',      name: 'Ahmadu Bello University, Zaria',               live: false },
  { id: 'uniben',   name: 'University of Benin',                          live: false },
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const reasons = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C75B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: 'Every listing is verified',
    body: 'A field agent visits and photographs every property before it goes live. What you see is what you get.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C75B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.4 3-5 6.5-5s6.5 1.6 6.5 5" />
        <circle cx="16.5" cy="8" r="3.2" /><path d="M21.5 20c0-3.4-3-5-6.5-5" />
      </svg>
    ),
    title: 'Direct to the landlord',
    body: 'No agent in the middle. Contact the landlord directly by chat or WhatsApp — you keep every kobo.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C75B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 7a2 2 0 0 1 2-2h12v4M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5" /><circle cx="17" cy="13" r="1.3" />
      </svg>
    ),
    title: 'True cost, upfront',
    body: 'Rent, service charge, water, generator levy — all itemised. No surprise bills after you move in.',
  },
];

const steps = [
  {
    n: '1',
    title: 'Search near your campus',
    body: 'Enter your university. See only verified rooms within walking or cycling distance of your gate.',
  },
  {
    n: '2',
    title: 'Compare the real total',
    body: 'Every listing shows the full first-year cost broken down. Pick what genuinely fits your budget.',
  },
  {
    n: '3',
    title: 'Contact and move in',
    body: 'Message the landlord directly. Agree terms. Move in. No middleman, no commission, no drama.',
  },
];

const testimonials = [
  {
    name: 'Chiamaka O.',
    tag: '200L · UNILAG',
    quote: "Found my lodge in 2 days. The cost breakdown showed me exactly what I'd pay — no surprises on move-in day.",
    initial: 'C',
  },
  {
    name: 'Emeka N.',
    tag: 'Final year · UNN',
    quote: "Searched from home before resumption. Photos matched reality, distance was accurate. Moved in the same week school started.",
    initial: 'E',
  },
  {
    name: 'Aisha M.',
    tag: '300L · ABU Zaria',
    quote: "I'd been burned by an agent before. RentalHub had me talking to the landlord directly within an hour.",
    initial: 'A',
  },
];

// ─── Video card placeholder (user replaces src with their files) ──────────────

const videoGradients: [string, string][] = [
  ['#c9b49a', '#7e5e42'],
  ['#bfaa90', '#6e5440'],
  ['#d1bc9c', '#917054'],
];

function VideoCard({
  index,
  label,
  className,
}: {
  index: number;
  label: string;
  className?: string;
}) {
  const [from, to] = videoGradients[index % videoGradients.length];
  return (
    <div
      className={`relative overflow-hidden rounded-card ${className ?? ''}`}
      style={{ background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)` }}
      role="img"
      aria-label={label}
    >
      {/*
        Drop your 3D apartment video here.
        Example: <source src="/videos/apartment-1.mp4" type="video/mp4" />
      */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Bottom shadow for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.32) 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="relative bg-paper pt-16 overflow-hidden"
      aria-labelledby="hero-h1"
      style={{ minHeight: '100dvh' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div
          className="flex flex-col lg:grid lg:items-center gap-10 lg:gap-14 py-16 lg:py-0"
          style={{
            minHeight: 'calc(100dvh - 4rem)',
            gridTemplateColumns: '5fr 7fr',
          }}
        >
          {/* ── Left: text ─────────────────────────────────── */}
          <HeroStagger className="flex flex-col justify-center">

            <HeroItem>
              <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-7">
                Student housing · Nigeria
              </p>
            </HeroItem>

            <HeroItem>
              <h1
                id="hero-h1"
                className="text-ink text-balance mb-4"
                style={{
                  fontSize: 'clamp(2.6rem, 4.5vw, 5rem)',
                  fontWeight: 400,
                  lineHeight: 1.07,
                  letterSpacing: '-0.03em',
                }}
              >
                Tour rooms.<br />Pick one.<br />Move in.
              </h1>
            </HeroItem>

            <HeroItem>
              <p
                className="mb-2"
                style={{
                  fontSize: 'clamp(1.3rem, 2.2vw, 2rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  color: '#C75B2A',
                  lineHeight: 1.2,
                }}
              >
                Zero agents. Zero surprises.
              </p>
            </HeroItem>

            <HeroItem>
              <p
                className="text-ink2 mb-10"
                style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '34ch' }}
              >
                Verified 3D apartment walkthroughs across
                Nigeria&apos;s top universities — with the real
                total cost shown upfront.
              </p>
            </HeroItem>

            <HeroItem>
              <form
                method="GET"
                action={`${APP}/search`}
                className="flex flex-col sm:flex-row gap-3 w-full"
                style={{ maxWidth: '36rem' }}
              >
                <select
                  name="campus"
                  required
                  defaultValue=""
                  className="flex-1 rounded-pill px-5 text-ink bg-white focus:outline-none focus:ring-2 focus:ring-clay focus:ring-offset-2"
                  style={{
                    border: '1.5px solid rgba(33,29,24,.15)',
                    fontSize: '0.95rem',
                    height: 52,
                    fontFamily: 'inherit',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B6153' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    paddingRight: 44,
                  }}
                >
                  <option value="" disabled>Select your university…</option>
                  {CAMPUSES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.live ? '' : ' (coming soon)'}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-8 rounded-pill bg-clay text-white font-semibold hover:bg-clay-deep active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 flex-shrink-0"
                  style={{ fontSize: '1rem', height: 52 }}
                >
                  Find rooms
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </form>
            </HeroItem>

          </HeroStagger>

          {/* ── Right: video mosaic ──────────────────────────── */}
          <HeroStagger
            className="flex flex-col gap-3"
            style={{ height: 'clamp(420px, 70vh, 680px)' } as React.CSSProperties}
          >
            {/* Main large video */}
            <HeroItem className="flex-1 min-h-0">
              <VideoCard
                index={0}
                label="3D walkthrough — apartment 1"
                className="w-full h-full"
              />
            </HeroItem>

            {/* Two smaller videos side by side */}
            <HeroItem className="flex gap-3" style={{ height: '36%', flexShrink: 0 }}>
              <VideoCard
                index={1}
                label="3D walkthrough — apartment 2"
                className="flex-1"
              />
              <VideoCard
                index={2}
                label="3D walkthrough — apartment 3"
                className="flex-1"
              />
            </HeroItem>
          </HeroStagger>

        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="py-20 lg:py-28 bg-paper2" aria-labelledby="why-h2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <FadeUp className="mb-12">
          <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-3">
            Why RentalHub
          </p>
          <h2
            id="why-h2"
            className="text-ink"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              maxWidth: '28rem',
            }}
          >
            Housing the way it should be.
          </h2>
        </FadeUp>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reasons.map(({ icon, title, body }) => (
            <StaggerItem key={title}>
              <article
                className="p-7 rounded-card bg-card h-full"
                style={{ border: '1px solid rgba(33,29,24,.08)' }}
              >
                <div
                  className="w-11 h-11 rounded-input flex items-center justify-center mb-5"
                  style={{ background: '#F4E2D6' }}
                >
                  {icon}
                </div>
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
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-paper" aria-labelledby="hiw-h2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <FadeUp className="mb-14">
          <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-3">
            How it works
          </p>
          <h2
            id="hiw-h2"
            className="text-ink"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            From search to keys.
          </h2>
        </FadeUp>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map(({ n, title, body }) => (
            <StaggerItem key={n}>
              <div className="flex flex-col">
                <span
                  className="text-ink3 font-semibold mb-4 tabular-nums select-none"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}
                  aria-hidden="true"
                >
                  {n} / 3
                </span>
                <h3
                  className="text-ink font-semibold mb-2"
                  style={{ fontSize: '1.0625rem', lineHeight: 1.35 }}
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
            </StaggerItem>
          ))}
        </Stagger>

        <FadeUp delay={0.15} className="mt-14">
          <a
            href={`${APP}/search`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill bg-clay text-white font-semibold text-sm hover:bg-clay-deep transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
            style={{ minHeight: 48 }}
          >
            Start searching
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-paper2" aria-labelledby="testimonials-h2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <FadeUp className="mb-12">
          <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-3">
            Student voices
          </p>
          <h2
            id="testimonials-h2"
            className="text-ink"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            It actually works.
          </h2>
        </FadeUp>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(({ name, tag, quote, initial }) => (
            <StaggerItem key={name}>
              <figure
                className="flex flex-col p-6 rounded-card bg-card h-full"
                style={{ border: '1px solid rgba(33,29,24,.08)' }}
              >
                <blockquote className="flex-1 mb-5">
                  <p
                    className="text-ink2 leading-relaxed"
                    style={{ fontSize: '0.9375rem' }}
                  >
                    &ldquo;{quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-pill flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 select-none"
                    style={{ background: '#C75B2A' }}
                    aria-hidden="true"
                  >
                    {initial}
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{name}</p>
                    <p className="text-xs text-ink3">{tag}</p>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function LandlordCTA() {
  return (
    <section
      className="py-20 lg:py-28"
      style={{ background: '#211D18' }}
      aria-labelledby="landlord-h2"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ color: 'rgba(244,238,228,.4)' }}
          >
            For landlords
          </p>
          <h2
            id="landlord-h2"
            className="text-balance mb-5"
            style={{
              color: '#F4EEE4',
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.12,
              maxWidth: '34rem',
            }}
          >
            Own student housing?{' '}
            <em style={{ fontStyle: 'italic', color: '#C75B2A' }}>
              Meet your next tenants directly.
            </em>
          </h2>
          <p
            className="mb-10 max-w-lg leading-relaxed"
            style={{ color: 'rgba(244,238,228,.5)', fontSize: '1.05rem' }}
          >
            List your property in under 10 minutes. Reach thousands of students
            searching near your area. No agent cut, no listing fee to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`${APP}/list-your-property`}
              className="inline-flex items-center justify-center px-8 py-4 rounded-pill bg-clay text-white font-semibold text-sm hover:bg-clay-deep transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-soft focus-visible:ring-offset-2"
              style={{ minHeight: 48 }}
            >
              List your property — free
            </a>
            <a
              href={`${APP}/how-it-works#landlords`}
              className="inline-flex items-center justify-center px-8 py-4 rounded-pill font-semibold text-sm transition-colors duration-150 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2"
              style={{
                border: '1px solid rgba(244,238,228,.18)',
                color: 'rgba(244,238,228,.7)',
                minHeight: 48,
              }}
            >
              Learn more
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function Footer() {
  const links = [
    { label: 'Find housing',  href: `${APP}/search`             },
    { label: 'How it works',  href: '/#how-it-works'            },
    { label: 'List property', href: `${APP}/list-your-property` },
    { label: 'About',         href: '/about'                    },
    { label: 'Safety',        href: '/safety'                   },
    { label: 'Help',          href: '/help'                     },
    { label: 'Privacy',       href: '/privacy'                  },
    { label: 'Terms',         href: '/terms'                    },
  ];

  return (
    <footer style={{ background: '#211D18' }} role="contentinfo">
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <a
            href="https://rentalhub.ng"
            className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 rounded"
            aria-label="RentalHub — go to homepage"
          >
            <img src="/logo-reversed.svg" alt="RentalHub" height={28} style={{ height: 28, width: 'auto' }} />
          </a>

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <MotionProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-clay focus:text-white focus:rounded-pill focus:font-semibold"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <WhyUs />
        <HowItWorks />
        <Testimonials />
        <LandlordCTA />
        <Footer />
      </main>
    </MotionProvider>
  );
}
