import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sections: [string, string[]][] = [
  ['Acceptance of terms', ['By creating an account or using RentalHub, you agree to these terms. If you do not agree, please do not use the platform. RentalHub is operated by Mikaelson Initiative.']],
  ['Eligibility', ['You must be at least 18 years old and able to enter a binding agreement. Students should use a valid school email where possible; landlords must complete identity and ownership verification before listing.']],
  ['Listings & verification', ['Every listing is reviewed by our admin team before it goes live. Landlords are responsible for the accuracy of their listings; misleading or fraudulent listings are removed and may result in account suspension.']],
  ['Bookings & payments', ['When you book, you make an offer that the landlord may accept. On acceptance, you sign the tenancy agreement and pay through RentalHub. We hold funds securely and release them to the landlord only after you confirm move-in.']],
  ['Fees & refunds', ['The rent shown is what you pay — we do not charge students hidden agency fees. Caution fees, where applicable, are refundable after a satisfactory end-of-tenancy inspection, subject to the agreement.']],
  ['Conduct', ['Treat landlords, tenants and staff with respect. Do not attempt to take transactions off-platform to avoid protections — doing so removes our ability to safeguard your money.']],
  ['Limitation of liability', ['RentalHub facilitates connections and payments between students and landlords. While we verify listings and identities, you remain responsible for inspecting a property and satisfying yourself before confirming move-in.']],
  ['Changes to these terms', ['We may update these terms from time to time. We will notify you of material changes, and continued use of the platform means you accept the updated terms.']],
];

export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className="bg-paper min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-5">Legal</p>
        <h1 className="text-ink mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
          Terms of Service
        </h1>
        <p className="text-ink3 text-sm mb-12">Last updated June 2026</p>
        <div className="flex flex-col gap-10">
          {sections.map(([title, paras]) => (
            <section key={title}>
              <h2 className="text-ink font-semibold mb-3" style={{ fontSize: '1.0625rem' }}>{title}</h2>
              <div className="flex flex-col gap-3">
                {paras.map((p, i) => (
                  <p key={i} className="text-ink2 leading-relaxed" style={{ fontSize: '0.9375rem' }}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
