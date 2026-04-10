export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[#192F59]">Terms of Service</h1>
        <p className="text-gray-600 mt-4">
          By using RentalHub, you agree to the terms below. These terms govern platform use by students, landlords,
          and administrators. Please read them carefully before booking or listing a property.
        </p>

        <div className="mt-6 space-y-5 text-sm text-gray-700">
          <section>
            <h2 className="font-semibold text-[#192F59] mb-1">1. Account Responsibilities</h2>
            <p>Users must provide accurate information, keep credentials secure, and avoid sharing accounts. Any activity under your account is your responsibility.</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#192F59] mb-1">2. Listing Standards</h2>
            <p>
              Landlords must submit truthful listings with accurate prices, amenities, and media evidence. Misleading,
              duplicate, or fraudulent listings may be rejected or removed without notice.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[#192F59] mb-2">3. Payment & Fund Release Process</h2>
            <p className="mb-2">
              RentalHub acts as an intermediary between students and landlords to ensure a fair and secure transaction for both parties. The payment process works as follows:
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>
                <span className="font-medium">Student pays via the platform.</span> Once a booking is confirmed, the student completes payment through RentalHub using our secure payment processor.
              </li>
              <li>
                <span className="font-medium">Funds are held by RentalHub.</span> The rent payment is received and held by RentalHub until the student confirms they have physically moved in to the property.
              </li>
              <li>
                <span className="font-medium">Student confirms move-in.</span> After collecting the keys and moving in, the student must click <em>&ldquo;I&apos;ve Moved In&rdquo;</em> on their dashboard. This is what triggers the payment release process.
              </li>
              <li>
                <span className="font-medium">RentalHub releases payment to landlord.</span> Upon the student&apos;s move-in confirmation, RentalHub manually verifies and transfers the rent payment to the landlord&apos;s registered bank account. Both parties are notified by email.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-semibold text-[#192F59] mb-2">4. Student Obligations</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Students must read and sign the tenancy agreement before making any payment.</li>
              <li>
                Students <strong>must confirm their move-in</strong> on the dashboard after collecting keys. Failure to confirm move-in within a reasonable period may delay or withhold the landlord&apos;s payment and could result in further action.
              </li>
              <li>Students must indicate their intended move-in date when confirming occupancy.</li>
              <li>Students must abide by the rules set out in the tenancy agreement they signed at the time of booking.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-[#192F59] mb-2">5. Landlord Obligations</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Landlords must provide accurate property listings including real photos, correct prices, and genuine amenities.</li>
              <li>
                Landlords <strong>must understand that payment is not released immediately</strong> upon a student booking or paying. Payment is only released after the student physically moves in and confirms this on the platform.
              </li>
              <li>Landlords must set up their bank account details on their profile so that RentalHub can transfer rent payments promptly after move-in confirmation.</li>
              <li>Landlords must hand over keys and give access to the property once a booking is fully paid.</li>
              <li>Landlords must not request payment outside of the RentalHub platform. Payments made outside the platform are not protected and are done at the student&apos;s own risk.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-[#192F59] mb-1">6. Moderation and Enforcement</h2>
            <p>
              RentalHub may approve, reject, suspend, or remove listings and accounts that violate platform rules,
              applicable law, or safety standards. Decisions made by RentalHub administrators are final.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[#192F59] mb-1">7. Bookings and Communication</h2>
            <p>
              Booking requests and confirmations are tracked on-platform. Users must communicate respectfully and avoid
              abusive behaviour. Harassment or fraud will result in immediate account suspension.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[#192F59] mb-1">8. Liability Notice</h2>
            <p>
              RentalHub facilitates listing discovery, booking workflows, and payment processing but is not a direct party to tenancy agreements.
              Users are responsible for due diligence, contractual decisions, and their own safety. RentalHub is not liable for disputes arising from the physical condition of a property or the conduct of landlords or tenants.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[#192F59] mb-1">9. Contact</h2>
            <p>
              For policy questions or disputes, contact{" "}
              <a className="text-[#E67E22] hover:underline" href="mailto:support@rentalhub.ng">
                support@rentalhub.ng
              </a>
              .
            </p>
          </section>
        </div>

        <p className="mt-8 text-xs text-gray-400">Last updated: April 2026</p>
      </div>
    </div>
  );
}
