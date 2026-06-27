"use client";

import { T, I } from "@/lib/rh/theme";
import { useApp, useViewport } from "@/components/rh/app";
import { Button, Card, PublicNav, Footer, SectionHead } from "@/components/rh/ui";

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "var(--rh-serif, 'Hanken Grotesk', sans-serif)", fontSize: 44, fontWeight: 600, color: T.clay, lineHeight: 1 }}>{n}</div>
      <div style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink2, marginTop: 8, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

function ValueCard({ icon, title, body }: { icon: ReturnType<typeof I.shield>; title: string; body: string }) {
  const { mobile } = useViewport();
  return (
    <Card pad={mobile ? 22 : 28}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: T.claySoft, color: T.clay, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        {icon}
      </div>
      <div style={{ fontFamily: T.serif, fontSize: mobile ? 19 : 22, color: T.ink, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontFamily: T.sans, fontSize: 14, color: T.ink2, marginTop: 8, lineHeight: 1.6 }}>{body}</div>
    </Card>
  );
}

export default function AboutPage() {
  const { go } = useApp();
  const { mobile } = useViewport();

  return (
    <div style={{ background: T.paper, minHeight: "100vh" }}>
      <PublicNav />

      {/* Hero */}
      <div style={{ background: T.paper2, borderBottom: "1px solid " + T.line2 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: mobile ? "44px 22px 48px" : "72px 40px 80px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: ".08em", color: T.clay, background: T.claySoft, padding: "5px 12px", borderRadius: 999, fontFamily: T.sans, marginBottom: 22 }}>
            {I.sparkle({ width: 13, height: 13 })} Our story
          </span>
          <h1 style={{ margin: 0, fontFamily: T.serif, fontWeight: 400, fontSize: mobile ? 40 : 68, lineHeight: 0.98, letterSpacing: "-.025em", color: T.ink }}>
            Making student housing <span style={{ fontStyle: "italic", color: T.clay }}>honest</span>.
          </h1>
          <p style={{ fontFamily: T.sans, fontSize: mobile ? 16 : 18.5, color: T.ink2, lineHeight: 1.65, maxWidth: 600, marginTop: 22 }}>
            RentalHub was built because finding safe, affordable off-campus housing in Nigeria shouldn&apos;t be a gamble. We&apos;re a product of Mikaelson Initiative — a team that lived through the agent fees, the scams, and the shock of arriving at a place nothing like the photos.
          </p>
        </div>
      </div>

      {/* The problem */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: mobile ? "44px 22px" : "72px 40px" }}>
        <SectionHead eyebrow="Why we exist" title="The problem we're solving" mobile={mobile} />
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: mobile ? 14 : 20 }}>
          <Stat n="1 in 3" label="Nigerian students reports paying for housing that wasn't what was advertised" />
          <Stat n="₦20k–₦80k" label="Typical agent commission charged on top of rent — often pocketed with no service" />
          <Stat n="48 hrs" label="Our admin team reviews and approves every listing before it goes live" />
          <Stat n="Zero" label="Agent fees on RentalHub. Rent what you see, pay what is quoted. Nothing extra." />
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: mobile ? "0 22px" : "0 40px" }}>
        <div style={{ borderTop: "1px solid " + T.line }} />
      </div>

      {/* How we work */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: mobile ? "44px 22px" : "72px 40px" }}>
        <SectionHead eyebrow="The platform" title="Three sides, one goal" mobile={mobile} />
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap: mobile ? 16 : 24 }}>
          {[
            { Ic: I.users, title: "Students", body: "Browse verified homes near your campus, book directly with the landlord, and pay securely into escrow. Your money is released only after you move in — never before." },
            { Ic: I.building, title: "Landlords", body: "List your property, get it reviewed by our team, and connect directly with verified students. We handle payments, so you get paid reliably without chasing tenants." },
            { Ic: I.eye, title: "Campus inspectors", body: "A network of registered students who visit properties on behalf of remote students. They submit photo reports so renters know exactly what they're paying for." },
          ].map(({ Ic, title, body }) => (
            <Card key={title} pad={mobile ? 22 : 28} style={{ background: T.card }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: T.paper2, color: T.clay, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                {Ic({ width: 22, height: 22 })}
              </div>
              <div style={{ fontFamily: T.serif, fontSize: mobile ? 21 : 24, color: T.ink, fontWeight: 500, marginBottom: 10 }}>{title}</div>
              <div style={{ fontFamily: T.sans, fontSize: 14.5, color: T.ink2, lineHeight: 1.65 }}>{body}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Values */}
      <div style={{ background: T.paper2, padding: mobile ? "44px 22px" : "72px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHead eyebrow="What we stand for" title="Our values" mobile={mobile} />
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(2,1fr)", gap: mobile ? 14 : 20 }}>
            <ValueCard
              icon={I.shield({ width: 22, height: 22 })}
              title="Trust above everything"
              body="Every feature we build is designed to reduce risk for students. If a feature doesn't make housing safer or more transparent, we don't ship it."
            />
            <ValueCard
              icon={I.sparkle({ width: 22, height: 22 })}
              title="No hidden anything"
              body="Rent is rent. We list the price you pay, explain every fee, and never charge students for browsing or booking. Landlords pay a small service fee — students pay only rent."
            />
            <ValueCard
              icon={I.users({ width: 22, height: 22 })}
              title="Community-powered verification"
              body="Our inspectors are campus students themselves. They know the neighbourhoods, the landlords, and the areas — making their on-ground reports more valuable than any algorithm."
            />
            <ValueCard
              icon={I.lock({ width: 22, height: 22 })}
              title="Your money, until you move in"
              body="We operate an escrow model. Rent is held securely and transferred to the landlord only after you've confirmed you've moved in and the home matches what was listed."
            />
          </div>
        </div>
      </div>

      {/* Company */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: mobile ? "44px 22px" : "72px 40px" }}>
        <div style={{ background: T.card, border: "1px solid " + T.line, borderRadius: 24, padding: mobile ? 26 : 40 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: ".08em", color: T.ink2, background: T.paper2, padding: "5px 12px", borderRadius: 999, fontFamily: T.sans }}>
            The company
          </span>
          <h2 style={{ margin: "18px 0 0", fontFamily: T.serif, fontWeight: 400, fontSize: mobile ? 28 : 38, letterSpacing: "-.02em", color: T.ink }}>
            Mikaelson Initiative
          </h2>
          <div style={{ display: "flex", gap: mobile ? 12 : 16, marginTop: 26, flexWrap: "wrap" }}>
            <Button onClick={() => go("search")} iconRight={I.arrow}>Browse homes</Button>
            <Button variant="outline" onClick={() => go("help")}>Contact us</Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
