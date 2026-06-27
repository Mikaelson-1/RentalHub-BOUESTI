"use client";

import { T, I } from "@/lib/rh/theme";
import { useApp, useViewport } from "@/components/rh/app";
import { Button, Card, PublicNav, Footer, SectionHead, Pill } from "@/components/rh/ui";

function PillarCard({ step, icon, title, body, details }: {
  step: string;
  icon: ReturnType<typeof I.shield>;
  title: string;
  body: string;
  details: string[];
}) {
  const { mobile } = useViewport();
  return (
    <Card pad={mobile ? 22 : 32}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, background: T.claySoft, color: T.clay, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
          {icon}
        </div>
        <div>
          <div style={{ fontFamily: T.sans, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: ".08em", color: T.ink3, marginBottom: 5 }}>{step}</div>
          <div style={{ fontFamily: T.serif, fontSize: mobile ? 21 : 25, color: T.ink, lineHeight: 1.1 }}>{title}</div>
        </div>
      </div>
      <p style={{ fontFamily: T.sans, fontSize: 15, color: T.ink2, lineHeight: 1.65, margin: "0 0 16px" }}>{body}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {details.map((d) => (
          <div key={d} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ width: 20, height: 20, borderRadius: 999, background: T.greenSoft, color: T.green, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", marginTop: 1 }}>
              {I.check({ width: 10, height: 10 })}
            </span>
            <span style={{ fontFamily: T.sans, fontSize: 14, color: T.ink2, lineHeight: 1.5 }}>{d}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function SafetyPage() {
  const { go } = useApp();
  const { mobile } = useViewport();

  return (
    <div style={{ background: T.paper, minHeight: "100vh" }}>
      <PublicNav />

      {/* Hero */}
      <div style={{ background: T.ink, color: "#fff", padding: mobile ? "48px 22px 52px" : "80px 40px 88px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Pill tone="green" style={{ background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.9)", border: "none", marginBottom: 22 }}>Safety & Trust</Pill>
          <h1 style={{ margin: 0, fontFamily: T.serif, fontWeight: 400, fontSize: mobile ? 40 : 70, lineHeight: 0.97, letterSpacing: "-.025em" }}>
            Your safety is<br />the whole <span style={{ fontStyle: "italic", color: T.clay }}>point</span>.
          </h1>
          <p style={{ fontFamily: T.sans, fontSize: mobile ? 16 : 18.5, color: "rgba(255,255,255,.7)", lineHeight: 1.65, maxWidth: 580, marginTop: 22 }}>
            Everything on RentalHub — admin reviews, escrow payments, inspector reports, landlord verification — exists for one reason: to make sure you never get scammed when looking for a place to live.
          </p>
        </div>
      </div>

      {/* Four pillars */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: mobile ? "44px 22px" : "72px 40px" }}>
        <SectionHead eyebrow="Four layers of protection" title="How we keep you safe" mobile={mobile} />
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(2,1fr)", gap: mobile ? 16 : 24 }}>
          <PillarCard
            step="Layer 01"
            icon={I.shield({ width: 24, height: 24 })}
            title="Every listing is reviewed by our team"
            body="No property goes live without a manual review by our admin team. We check property photos, the description, and the listed price against our data for the area."
            details={[
              "Admins review the property photos for accuracy and quality",
              "Listings are checked against known pricing in the area",
              "Duplicate or suspicious listings are removed before going live",
              "Any listing that fails review is sent back to the landlord with notes",
            ]}
          />
          <PillarCard
            step="Layer 02"
            icon={I.user({ width: 24, height: 24 })}
            title="Landlords are identity-verified"
            body="Before a landlord can list anything, they go through a verification process that confirms who they are and that they have the right to rent out the property."
            details={[
              "Government-issued ID uploaded and reviewed by our team",
              "A live selfie matched against the ID to prevent impersonation",
              "Proof of property ownership or landlord's agreement required",
              "Unverified landlords cannot publish listings — only drafts",
            ]}
          />
          <PillarCard
            step="Layer 03"
            icon={I.eye({ width: 24, height: 24 })}
            title="Campus inspectors visit properties in person"
            body="Our network of registered student-inspectors visit properties on behalf of remote students. They submit a report with photos and a detailed assessment so you know exactly what you're paying for."
            details={[
              "Inspectors are registered students at the same campus",
              "They carry a verified RentalHub inspector badge and matric card",
              "Their report includes photos, condition notes, and a live video walkthrough",
              "Reports are reviewed before being shared with requesting students",
            ]}
          />
          <PillarCard
            step="Layer 04"
            icon={I.wallet({ width: 24, height: 24 })}
            title="Your rent is held in escrow until move-in"
            body="We never send your rent straight to a landlord. Payments are held securely and only released after you confirm you've moved in and the home matches the listing."
            details={[
              "All payments processed through Paystack — a CBN-licensed PSP",
              "Funds held in escrow until you manually confirm move-in",
              "If the property doesn't match the listing, you can raise a dispute before confirming",
              "Landlords are paid within 24 hours of your move-in confirmation",
            ]}
          />
        </div>
      </div>

      {/* What we can't protect against */}
      <div style={{ background: T.paper2, padding: mobile ? "44px 22px" : "72px 40px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionHead eyebrow="Be aware" title="What to watch out for" mobile={mobile} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["Never pay outside the platform", "Landlords or anyone claiming to represent RentalHub should never ask you to send money via bank transfer, POS, or any channel other than the in-app payment flow. If someone asks you to pay outside the platform, it is a scam — report it immediately."],
              ["We will never call you to request payment", "RentalHub will never call you to ask for a payment, a transfer, or your bank details. All payment instructions come from the app only."],
              ["Your booking is only confirmed in-app", "A WhatsApp message, a phone call, or a receipt from a landlord's personal account does not constitute a confirmed booking. Your booking is only confirmed when you see a confirmation inside your RentalHub account."],
            ].map(([t, d]) => (
              <div key={String(t)} style={{ background: T.card, border: "1px solid " + T.line, borderRadius: 16, padding: mobile ? 18 : 24 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: T.goldSoft, color: T.gold, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
                    {I.shieldAlert({ width: 18, height: 18 })}
                  </div>
                  <div>
                    <div style={{ fontFamily: T.sans, fontSize: mobile ? 15 : 16, fontWeight: 700, color: T.ink, marginBottom: 6 }}>{t}</div>
                    <div style={{ fontFamily: T.sans, fontSize: 14, color: T.ink2, lineHeight: 1.6 }}>{d}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report a problem */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: mobile ? "44px 22px 56px" : "72px 40px 88px" }}>
        <div style={{ background: T.card, border: "1px solid " + T.line, borderRadius: 24, padding: mobile ? 26 : 40, textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 999, background: T.claySoft, color: T.clay, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            {I.phone({ width: 26, height: 26 })}
          </div>
          <h2 style={{ margin: 0, fontFamily: T.serif, fontWeight: 400, fontSize: mobile ? 28 : 36, letterSpacing: "-.02em", color: T.ink }}>
            Something doesn&apos;t look right?
          </h2>
          <p style={{ fontFamily: T.sans, fontSize: mobile ? 14.5 : 16, color: T.ink2, lineHeight: 1.65, maxWidth: 480, margin: "14px auto 0" }}>
            Report a suspicious listing, a payment issue, or anything that feels off. Our team reviews every report, usually within 24 hours.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 26, justifyContent: "center", flexWrap: "wrap" }}>
            <Button onClick={() => go("help")} iconRight={I.arrow}>Report a problem</Button>
            <Button variant="outline" onClick={() => { window.location.href = "mailto:hello@mikaelsoninitiative.org"; }}>Email us directly</Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
