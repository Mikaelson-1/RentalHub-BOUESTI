import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sections: [string, string[]][] = [
  ['Who we are', ['RentalHub is a verified student-housing platform operated by Mikaelson Initiative. This policy explains what personal information we collect, how we use it, and the choices you have.']],
  ['Information we collect', ['Account details you provide — name, email, phone number, and school. For landlords, we also collect identity and property-ownership documents needed for verification.', 'Usage information such as the listings you view, searches you run, and bookings you make, so we can improve the service and keep it safe.']],
  ['How we use your information', ['To create and manage your account, verify landlords, process bookings and payments, and keep the platform free of fraud and scams.', 'To send you essential service messages — booking updates, payment receipts, and security notices. We do not sell your personal data.']],
  ['Payments', ['Payments are processed by our payment partner. We hold rent securely in escrow and release it to the landlord only after you confirm move-in. We store payment references, not full card details.']],
  ['Document verification', ['Landlord identity and ownership documents are reviewed by our admin team and automated checks solely to confirm authenticity. They are stored securely and are never shown to students.']],
  ['Your rights', ['You can access, correct, or delete your personal information at any time from your profile, or by contacting us. You may also request a copy of the data we hold about you.']],
  ['Contact', ['For any privacy request, email hello@mikaelsoninitiative.org and we will respond within 30 days.']],
];

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="bg-paper min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <p className="text-xs font-semibold tracking-widest text-clay uppercase mb-5">Legal</p>
        <h1 className="text-ink mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
          Privacy Policy
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
