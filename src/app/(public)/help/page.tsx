"use client";

import { useState } from "react";
import { T, I } from "@/lib/rh/theme";
import { useApp, useViewport } from "@/components/rh/app";
import { Button, Card, PublicNav, Footer, SectionHead } from "@/components/rh/ui";

interface FAQ { q: string; a: string }

function AccordionItem({ q, a }: FAQ) {
  const [open, setOpen] = useState(false);
  const { mobile } = useViewport();
  return (
    <div style={{ borderBottom: "1px solid " + T.line2 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", background: "none", border: "none", padding: mobile ? "16px 0" : "18px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, cursor: "pointer", textAlign: "left" }}
      >
        <span style={{ fontFamily: T.sans, fontSize: mobile ? 15 : 16, fontWeight: 600, color: T.ink, flex: 1 }}>{q}</span>
        <span style={{ flex: "0 0 auto", color: T.clay, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>
          {I.chevDown({ width: 20, height: 20 })}
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: 18 }}>
          <p style={{ fontFamily: T.sans, fontSize: 14.5, color: T.ink2, lineHeight: 1.7, margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

const SECTIONS: { title: string; icon: ReturnType<typeof I.home>; faqs: FAQ[] }[] = [
  {
    title: "Getting started",
    icon: I.home(),
    faqs: [
      { q: "What is RentalHub?", a: "RentalHub is a verified student-housing platform that connects Nigerian university students with landlords who have been identity-checked and approved by our team. Every listing is manually reviewed before it goes live. We also run an escrow payment system so your rent is only released to the landlord after you confirm move-in." },
      { q: "Which campuses does RentalHub cover?", a: "We currently cover properties near Benson Idahosa University (BOUESTI) and are expanding to additional campuses. The campus selector in the app lets you switch between available areas. New campuses are added based on demand — if you'd like to see your campus, email us at hello@mikaelsoninitiative.org." },
      { q: "Is RentalHub free to use?", a: "Browsing and booking is completely free for students. Landlords pay a small service fee when a booking is confirmed. There are no hidden agent fees charged to students — ever." },
      { q: "Do I need to create an account to browse?", a: "You can browse listings without an account. To save homes, book a property, or request an inspection, you'll need to register a free student account." },
    ],
  },
  {
    title: "For students",
    icon: I.user(),
    faqs: [
      { q: "How do I book a property?", a: "Find a property you like, click 'Book now', and submit a bid (which must be within the allowed range of the listed price). The landlord reviews your request and either accepts or declines. If accepted, you'll be prompted to complete payment through our secure Paystack checkout. Your rent is held in escrow until you confirm move-in." },
      { q: "What happens after I pay?", a: "Once your payment is confirmed, you receive a booking reference and the landlord's contact details. You'll arrange move-in directly with the landlord. When you move in, open the app and tap 'Confirm move-in' — this releases the rent to the landlord. If anything doesn't match the listing, raise a dispute before confirming." },
      { q: "Can I request a physical inspection before booking?", a: "Yes. On any property page, tap 'Request inspection'. You can either let us assign an available campus inspector, or pick a specific inspector you trust. The inspector visits the property and submits a photo report and condition assessment, which you'll receive in your account before you pay anything." },
      { q: "What if the property doesn't match the listing?", a: "Don't confirm move-in in the app. Contact our support team at hello@mikaelsoninitiative.org immediately with your booking reference and photos. We'll investigate and initiate a refund if the property materially differs from what was listed. Never confirm move-in if you're not happy with the property." },
      { q: "Can I save properties to look at later?", a: "Yes. Tap the heart icon on any listing to save it. Your saved properties are accessible from the search page. Saved homes are stored locally — you don't need to be logged in." },
    ],
  },
  {
    title: "For landlords",
    icon: I.building(),
    faqs: [
      { q: "How do I list a property?", a: "Create a landlord account, complete your identity verification (government ID, selfie, and proof of ownership), and then go to your dashboard to add a property. Upload clear photos, set your price and details, and submit for review. Our admin team will review within 48 hours and either approve your listing or request changes." },
      { q: "How and when do I get paid?", a: "When a student confirms move-in, the rent is released from escrow to your registered bank account within 24 hours. You can track all payments and their status from your landlord dashboard." },
      { q: "Can I reject a booking request?", a: "Yes. When a student submits a booking request, you'll receive a notification and can review their profile before accepting or declining. You don't have to accept every request." },
      { q: "What if a student raises a dispute?", a: "Our team will contact you and the student, review the evidence, and mediate. If the listing accurately represented the property, the booking proceeds as normal. If there was a material misrepresentation, a refund may be issued. We encourage landlords to keep listings accurate and up-to-date." },
      { q: "What does the service fee cover?", a: "The landlord service fee covers payment processing, escrow management, admin review of your listing, and platform operations. There are no monthly subscription fees — you only pay when a booking is confirmed." },
    ],
  },
  {
    title: "For inspectors",
    icon: I.eye(),
    faqs: [
      { q: "How do I become a campus inspector?", a: "Apply through the 'Become an inspector' page. You'll need to be a registered student at an active campus, have a valid matric card, and be able to provide a student portal screenshot. Applications are reviewed by our team within 48 hours." },
      { q: "How do inspection jobs work?", a: "When a student requests an inspection, you'll receive a notification if the job is either undirected (open to any inspector in the area) or directed to you specifically. You have a window to accept the job, visit the property, and submit your report using the inspector dashboard. Directed jobs give you 48 hours to accept; open jobs give you 24 hours." },
      { q: "How do I get paid for inspections?", a: "Inspection earnings are tracked in your inspector dashboard. Payment terms and amounts are set per campus — you'll see the current rate when you accept a job. Payments are processed after your report is reviewed and accepted by our team." },
      { q: "What goes into an inspection report?", a: "Your report should include: current photos of all main areas (entrance, living space, kitchen, bathroom, bedroom), an honest assessment of the property condition, whether the property matches the listing photos, proximity to campus, and any issues like water supply, electricity, or security concerns." },
    ],
  },
  {
    title: "Payments & refunds",
    icon: I.wallet(),
    faqs: [
      { q: "What payment methods are accepted?", a: "We accept debit cards, bank transfers, and USSD payments through Paystack. All payments are processed in Nigerian Naira (NGN)." },
      { q: "Is my payment information secure?", a: "All payments are processed by Paystack, a CBN-licensed payment service provider. RentalHub never stores your card details — we only store a payment reference for your booking." },
      { q: "Can I get a refund?", a: "Refunds are available if: the landlord declines your booking after payment (rare — full refund issued automatically), the property materially differs from the listing and you raise a dispute before confirming move-in, or in exceptional circumstances agreed by our team. Refunds are not available after you confirm move-in — this is why it's important not to confirm until you're satisfied." },
      { q: "How long do refunds take?", a: "Approved refunds are processed within 3–7 working days depending on your bank. You'll receive an email confirmation when the refund is initiated." },
    ],
  },
  {
    title: "Account & security",
    icon: I.lock(),
    faqs: [
      { q: "How do I reset my password?", a: "Go to the login page and tap 'Forgot password'. Enter your registered email address and we'll send you a reset link that expires in 1 hour. Check your spam folder if it doesn't arrive within a few minutes." },
      { q: "Can I change my registered email address?", a: "Yes. Go to your profile settings and update your email address. You'll need to verify the new address via a confirmation code before the change takes effect." },
      { q: "My account has been frozen. What do I do?", a: "Accounts are frozen if our team detects suspicious activity, a dispute is pending, or a policy violation is flagged. You'll receive an email explaining the reason. Contact us at hello@mikaelsoninitiative.org with your account email and we'll review the situation." },
      { q: "How do I delete my account?", a: "You can request account deletion by emailing hello@mikaelsoninitiative.org from your registered address. Accounts with active bookings or pending payments cannot be deleted until those are resolved. Deletion is permanent and takes 30 days to complete." },
    ],
  },
];

export default function HelpPage() {
  const { go } = useApp();
  const { mobile } = useViewport();
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div style={{ background: T.paper, minHeight: "100vh" }}>
      <PublicNav />

      {/* Hero */}
      <div style={{ background: T.paper2, borderBottom: "1px solid " + T.line2 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: mobile ? "40px 22px 44px" : "64px 40px 72px" }}>
          <h1 style={{ margin: 0, fontFamily: T.serif, fontWeight: 400, fontSize: mobile ? 40 : 66, lineHeight: 0.97, letterSpacing: "-.025em", color: T.ink }}>
            Help <span style={{ fontStyle: "italic", color: T.clay }}>centre</span>.
          </h1>
          <p style={{ fontFamily: T.sans, fontSize: mobile ? 16 : 18, color: T.ink2, lineHeight: 1.6, maxWidth: 500, marginTop: 18 }}>
            Answers to the most common questions. If you can't find what you need, email us — we reply to every message.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: mobile ? "32px 22px 56px" : "56px 40px 80px" }}>
        <div style={{ display: mobile ? "block" : "grid", gridTemplateColumns: "240px 1fr", gap: 48, alignItems: "start" }}>

          {/* Sidebar nav */}
          {!mobile && (
            <div style={{ position: "sticky", top: 100 }}>
              <div style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: ".08em", color: T.ink3, marginBottom: 14 }}>Topics</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {SECTIONS.map((s, i) => (
                  <button
                    key={s.title}
                    onClick={() => setActiveSection(i)}
                    style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 14px", borderRadius: 11, border: "none", cursor: "pointer", background: activeSection === i ? T.claySoft : "transparent", color: activeSection === i ? T.clay : T.ink2, fontFamily: T.sans, fontSize: 14, fontWeight: activeSection === i ? 600 : 400, textAlign: "left" }}
                  >
                    {/* render icon inline */}
                    <span style={{ flex: "0 0 auto" }}>{s.icon}</span>
                    {s.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile section tabs */}
          {mobile && (
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 24 }}>
              {SECTIONS.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => setActiveSection(i)}
                  style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid " + (activeSection === i ? T.clay : T.line), background: activeSection === i ? T.clay : "transparent", color: activeSection === i ? "#fff" : T.ink2, fontFamily: T.sans, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" as const, cursor: "pointer" }}
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}

          {/* FAQ content */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: T.claySoft, color: T.clay, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
                {SECTIONS[activeSection].icon}
              </div>
              <h2 style={{ margin: 0, fontFamily: T.serif, fontWeight: 500, fontSize: mobile ? 26 : 32, color: T.ink, letterSpacing: "-.01em" }}>
                {SECTIONS[activeSection].title}
              </h2>
            </div>
            <Card pad={0}>
              <div style={{ padding: mobile ? "0 18px" : "0 28px" }}>
                {SECTIONS[activeSection].faqs.map((faq) => (
                  <AccordionItem key={faq.q} {...faq} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div style={{ background: T.paper2, borderTop: "1px solid " + T.line2, padding: mobile ? "40px 22px" : "64px 40px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionHead eyebrow="Still need help?" title="Get in touch" mobile={mobile} />
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap: mobile ? 14 : 20 }}>
            {[
              { Ic: I.mail, title: "Email support", linkLabel: "hello@mikaelsoninitiative.org", desc: "We reply to every email, usually within 24 hours.", action: () => { window.location.href = "mailto:hello@mikaelsoninitiative.org"; } },
              { Ic: I.shield, title: "Report a safety issue", linkLabel: "Safety & Trust", desc: "If you've encountered a scam or unsafe situation, report it immediately.", action: () => go("safety") },
              { Ic: I.doc, title: "Privacy & legal", linkLabel: "Privacy policy", desc: "Questions about your data, rights, or legal matters.", action: () => go("privacy") },
            ].map(({ Ic, title, linkLabel, desc, action }) => (
              <Card key={title} pad={mobile ? 20 : 24} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: T.claySoft, color: T.clay, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {Ic({ width: 20, height: 20 })}
                </div>
                <div>
                  <div style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 700, color: T.ink, marginBottom: 5 }}>{title}</div>
                  <div style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink2, lineHeight: 1.55 }}>{desc}</div>
                </div>
                <button
                  onClick={action}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, color: T.clay, fontFamily: T.sans, fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
                >
                  {linkLabel} {I.arrow({ width: 14, height: 14 })}
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
