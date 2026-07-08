'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const APP = 'https://app.rentalhub.ng';

// ─── Data ─────────────────────────────────────────────────────────────────────

type FAQ = { q: string; a: string };
type Section = { id: string; label: string; faqs: FAQ[] };

const sections: Section[] = [
  {
    id: 'getting-started',
    label: 'Getting started',
    faqs: [
      {
        q: 'What is RentalHub?',
        a: 'RentalHub is a verified student-housing platform that connects Nigerian university students with landlords who have been identity-checked and approved by our team. Every listing is manually reviewed before it goes live. We also run an escrow payment system so your rent is only released to the landlord after you confirm move-in.',
      },
      {
        q: 'Which campuses does RentalHub cover?',
        a: 'We currently cover properties near Benson Idahosa University (BOUESTI) and are expanding to additional campuses. The campus selector in the app lets you switch between available areas. New campuses are added based on demand — if you\'d like to see your campus, email us at hello@mikaelsoninitiative.org.',
      },
      {
        q: 'Is RentalHub free to use?',
        a: 'Browsing and booking is completely free for students. Landlords pay a small service fee when a booking is confirmed. There are no hidden agent fees charged to students — ever.',
      },
      {
        q: 'Do I need to create an account to browse?',
        a: 'You can browse listings without an account. To save homes, book a property, or request an inspection, you\'ll need to register a free student account.',
      },
    ],
  },
  {
    id: 'for-students',
    label: 'For students',
    faqs: [
      {
        q: 'How do I book a property?',
        a: 'Find a listing you like and tap "Book this property". You\'ll be asked to choose your move-in date and pay a booking deposit through our secure payment gateway. Your deposit goes into escrow — it is not released to the landlord until you confirm move-in.',
      },
      {
        q: 'What happens after I pay?',
        a: 'Once payment is confirmed you will receive a booking receipt by email. The landlord is notified immediately and will contact you to arrange key collection or move-in. Your rent stays in escrow until you mark yourself as moved in.',
      },
      {
        q: 'Can I request an inspection?',
        a: 'Yes. On any listing page tap "Request inspection". One of our trained field inspectors will visit the property and send you a verified report — including photos and a condition checklist — before you commit.',
      },
      {
        q: 'The property doesn\'t match the listing. What do I do?',
        a: 'Contact our support team from the booking page within 48 hours of move-in. We will open a dispute, investigate, and if the discrepancy is confirmed your payment will be refunded in full. Do not pay outside the platform.',
      },
      {
        q: 'Can I save properties?',
        a: 'Yes. Tap the bookmark icon on any listing to add it to your saved homes. You need a free account to use this feature.',
      },
    ],
  },
  {
    id: 'for-landlords',
    label: 'For landlords',
    faqs: [
      {
        q: 'How do I list my property?',
        a: 'Sign in to the landlord portal at app.rentalhub.ng, tap "List a property", and complete the form — property details, photos, costs, and your identity documents. Our team manually reviews every submission before it goes live, typically within 24–48 hours.',
      },
      {
        q: 'How and when do I get paid?',
        a: 'Once a student confirms move-in, the escrowed rent is released to your registered bank account within one business day. You will receive a payment notification and a receipt by email.',
      },
      {
        q: 'Can I reject a booking?',
        a: 'Yes. You can decline a booking request within 24 hours if the property is no longer available. Declining too frequently may affect your listing\'s visibility.',
      },
      {
        q: 'What if a student raises a dispute?',
        a: 'Our team reviews the evidence from both sides — listing details, inspection report, and move-in photos. If the dispute is upheld in the student\'s favour, the escrowed amount is returned to them. We will notify you throughout the process.',
      },
      {
        q: 'What does the service fee cover?',
        a: 'The service fee covers payment processing, escrow management, listing promotion, and access to our verified inspector network. The exact fee percentage is shown during checkout before any payment is taken.',
      },
    ],
  },
  {
    id: 'for-inspectors',
    label: 'For inspectors',
    faqs: [
      {
        q: 'How do I become a RentalHub inspector?',
        a: 'Apply through the inspector portal at app.rentalhub.ng/inspectors. You will need to pass a short identity check and complete our online training module before you can accept jobs.',
      },
      {
        q: 'How do jobs work?',
        a: 'When a student requests an inspection, the job appears in your app. Accept it, visit the property at the agreed time, complete the checklist and upload photos, then submit your report. The student is notified as soon as the report is ready.',
      },
      {
        q: 'How do I get paid as an inspector?',
        a: 'Inspector fees are released to your bank account after each accepted report is verified by our team. Payment is typically processed within one business day of report approval.',
      },
      {
        q: 'What goes into an inspection report?',
        a: 'A standard report includes exterior and interior photos, a room-by-room condition checklist, a distance measurement from the campus gate, utility availability, and any notable discrepancies with the online listing.',
      },
    ],
  },
  {
    id: 'payments-refunds',
    label: 'Payments & refunds',
    faqs: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept debit cards and bank transfers via our payment partner. All major Nigerian banks are supported. International cards are not currently accepted.',
      },
      {
        q: 'Is payment secure?',
        a: 'Yes. All payments are processed through a PCI-compliant payment gateway. Funds are held in escrow and are never in direct contact with the landlord until move-in is confirmed. We do not store your card details.',
      },
      {
        q: 'Can I get a refund?',
        a: 'If you cancel before the landlord accepts your booking you receive a full refund. After acceptance, refunds are subject to our cancellation policy — typically a full refund within 48 hours of move-in if you raise a valid dispute. Service fees are non-refundable.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Approved refunds are processed within 3–5 business days back to your original payment method.',
      },
    ],
  },
  {
    id: 'account-security',
    label: 'Account & security',
    faqs: [
      {
        q: 'How do I reset my password?',
        a: 'On the sign-in page tap "Forgot password". Enter your email address and we will send a one-time reset link. The link expires after 30 minutes.',
      },
      {
        q: 'Can I change my email address?',
        a: 'Yes. Go to Settings → Account in the app. For security, you will need to verify both your old and new email addresses before the change takes effect.',
      },
      {
        q: 'Why has my account been frozen?',
        a: 'Accounts are frozen when unusual activity is detected or if a policy violation is under review. You will receive an email with details. Contact hello@mikaelsoninitiative.org to appeal or get more information.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to Settings → Account → Delete account. This action is permanent and removes all your data within 30 days. Active bookings must be resolved before you can delete your account.',
      },
    ],
  },
];

// ─── Accordion item ────────────────────────────────────────────────────────────

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{ borderBottom: '1px solid rgba(33,29,24,.1)' }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 rounded"
      >
        <span
          className="text-ink font-medium"
          style={{ fontSize: '0.9375rem', lineHeight: 1.45 }}
        >
          {faq.q}
        </span>
        <span
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-ink3 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', marginTop: 2 }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="pb-5 pr-8">
          <p
            className="text-ink2 leading-relaxed"
            style={{ fontSize: '0.9375rem' }}
          >
            {faq.a}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HelpPage() {
  const [activeSectionId, setActiveSectionId] = useState(sections[0].id);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0];

  function toggleItem(key: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function handleSectionChange(id: string) {
    setActiveSectionId(id);
    setOpenItems(new Set());
  }

  return (
    <div className="bg-paper min-h-screen">
      <Navbar />

      {/* ── Skip link ──────────────────────────────────────────────────────────── */}
      <a
        href="#help-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-clay focus:text-white focus:rounded-pill focus:font-semibold focus:text-sm"
      >
        Skip to content
      </a>

      {/* ── Hero ───────────────────────────────────────────────────────────────── */}
      <section
        className="bg-paper2 pt-28 pb-14"
        style={{ borderBottom: '1px solid rgba(33,29,24,.08)' }}
        aria-labelledby="help-h1"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-5">
            Support
          </p>
          <h1
            id="help-h1"
            className="text-ink mb-4"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
            }}
          >
            Help centre.
          </h1>
          <p
            className="text-ink2"
            style={{ fontSize: '1.0625rem', lineHeight: 1.65, maxWidth: '44ch' }}
          >
            Answers to the most common questions about finding housing, listing a
            property, inspections, payments, and your account.
          </p>
        </div>
      </section>

      {/* ── Mobile pill tabs ───────────────────────────────────────────────────── */}
      <div
        className="lg:hidden sticky top-16 z-10 bg-paper"
        style={{ borderBottom: '1px solid rgba(33,29,24,.08)' }}
      >
        <div
          className="max-w-6xl mx-auto px-4 sm:px-6"
          style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
        >
          <div className="flex gap-2 py-3" role="tablist" aria-label="Help sections">
            {sections.map((s) => {
              const active = s.id === activeSectionId;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSectionChange(s.id)}
                  className="flex-shrink-0 px-4 py-2 rounded-pill text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
                  style={{
                    background: active ? '#C75B2A' : '#EBE2D3',
                    color: active ? '#FFFFFF' : '#6B6153',
                    minHeight: 36,
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + content ────────────────────────────────────────────── */}
      <div
        id="help-content"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
      >
        <div className="flex gap-12 lg:gap-16 items-start">

          {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
          <aside
            className="hidden lg:block flex-shrink-0"
            style={{ width: 220, position: 'sticky', top: 96 }}
            aria-label="Help sections"
          >
            <nav>
              <ul className="flex flex-col gap-1" role="list">
                {sections.map((s) => {
                  const active = s.id === activeSectionId;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => handleSectionChange(s.id)}
                        className="w-full text-left px-3 py-2.5 rounded-input text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
                        style={{
                          background: active ? '#F4E2D6' : 'transparent',
                          color: active ? '#C75B2A' : '#6B6153',
                        }}
                        aria-current={active ? 'true' : undefined}
                      >
                        {s.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* ── FAQ content ──────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <h2
              className="text-ink mb-1"
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {activeSection.label}
            </h2>
            <p className="text-ink3 text-sm mb-8">
              {activeSection.faqs.length} question{activeSection.faqs.length !== 1 ? 's' : ''}
            </p>

            <div
              role="list"
              style={{ borderTop: '1px solid rgba(33,29,24,.1)' }}
            >
              {activeSection.faqs.map((faq, i) => {
                const key = `${activeSection.id}-${i}`;
                return (
                  <div key={key} role="listitem">
                    <AccordionItem
                      faq={faq}
                      isOpen={openItems.has(key)}
                      onToggle={() => toggleItem(key)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── Contact section ────────────────────────────────────────────────────── */}
      <section
        className="bg-paper2"
        style={{ borderTop: '1px solid rgba(33,29,24,.08)' }}
        aria-labelledby="contact-h2"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div
            className="rounded-card p-8 lg:p-10 bg-card flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
            style={{ border: '1px solid rgba(33,29,24,.08)' }}
          >
            <div>
              <h2
                id="contact-h2"
                className="text-ink mb-2"
                style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em' }}
              >
                Still have a question?
              </h2>
              <p className="text-ink2" style={{ fontSize: '0.9375rem', lineHeight: 1.65 }}>
                Our team is available Monday – Friday, 9 am – 6 pm WAT.{' '}
                We typically respond within a few hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
              <a
                href="mailto:hello@mikaelsoninitiative.org"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-pill bg-clay text-white font-semibold text-sm hover:bg-clay-deep transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
                style={{ minHeight: 44 }}
              >
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
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 7 10 7 10-7" />
                </svg>
                Email support
              </a>

              <div className="flex flex-row gap-3">
                <a
                  href="/safety"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-pill text-sm font-medium text-ink2 hover:text-ink transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
                  style={{
                    background: '#EBE2D3',
                    minHeight: 44,
                  }}
                >
                  Safety guide
                </a>
                <a
                  href="/privacy"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-pill text-sm font-medium text-ink2 hover:text-ink transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
                  style={{
                    background: '#EBE2D3',
                    minHeight: 44,
                  }}
                >
                  Privacy policy
                </a>
              </div>
            </div>
          </div>

          {/* Quick links row */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: 'Browse properties', href: `${APP}/search` },
              { label: 'List your property', href: `${APP}/list-your-property` },
              { label: 'Apply as inspector', href: `${APP}/inspectors` },
              { label: 'Terms of service', href: '/terms' },
              { label: 'About RentalHub', href: '/about' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-ink3 hover:text-clay transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-clay rounded"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
