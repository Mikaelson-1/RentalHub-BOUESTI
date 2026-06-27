"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { T, naira, I, Logo, amenityIcon } from "@/lib/rh/theme";
import { useApp, useViewport } from "@/components/rh/app";
import { Button, Card, StatusBadge, Textarea, Pill } from "@/components/rh/ui";
import { getProperty, setPropertyStatus, type ApiProperty } from "@/lib/rh/api";

function imageStrings(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.flatMap((item) => {
    if (typeof item === "string" && item.startsWith("http")) return [item];
    if (typeof item === "object" && item && "url" in item) {
      const u = (item as { url: unknown }).url;
      return typeof u === "string" ? [u] : [];
    }
    return [];
  });
}

export default function AdminPropertyReviewPage() {
  const { go, showToast } = useApp();
  const { mobile } = useViewport();
  const { id } = useParams<{ id: string }>();

  const [p, setP] = useState<ApiProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [deciding, setDeciding] = useState(false);

  useEffect(() => {
    let active = true;
    getProperty(id)
      .then((prop) => { if (active) setP(prop); })
      .catch(() => { if (active) setError("Couldn't load this listing."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const decide = async (status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !reason.trim()) {
      showToast("Add a reason before rejecting");
      return;
    }
    setDeciding(true);
    try {
      await setPropertyStatus(id, status, reason.trim() || undefined);
      showToast(status === "APPROVED" ? "Listing approved & published" : "Listing rejected — landlord notified");
      go("admin");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Action failed");
      setDeciding(false);
    }
  };

  const images = p ? imageStrings(p.images) : [];
  const amenities = p && Array.isArray(p.amenities) ? (p.amenities as string[]) : [];
  const aiScore = p?.aiScamFlag ? "FAIL" : "PASS";
  const aiTone = aiScore === "FAIL" ? "red" : "green";

  return (
    <div style={{ background: T.paper, minHeight: "100vh" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(244,238,228,.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid " + T.line2 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => go("home")} style={{ cursor: "pointer" }}><Logo size={24} fontSize={20} /></div>
          <span onClick={() => go("admin")} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: T.sans, fontSize: 13.5, color: T.ink2, cursor: "pointer" }}>{I.arrowLeft({ width: 16, height: 16 })}Back to admin queue</span>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: mobile ? "20px" : "32px 24px 56px" }}>
        {loading ? (
          <Card pad={40} style={{ textAlign: "center" }}><div style={{ fontFamily: T.sans, color: T.ink2 }}>Loading listing…</div></Card>
        ) : error || !p ? (
          <Card pad={40} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink }}>Listing not found</div>
            <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink2, marginTop: 8 }}>{error || "It may have been removed."}</p>
            <div style={{ marginTop: 16, display: "inline-block" }}><Button onClick={() => go("admin")}>Back to admin</Button></div>
          </Card>
        ) : (
          <Card pad={mobile ? 22 : 30}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
              <h1 style={{ fontFamily: T.serif, fontWeight: 400, fontSize: mobile ? 28 : 38, letterSpacing: "-.02em", color: T.ink, margin: 0, lineHeight: 1.05 }}>{p.title}</h1>
              <StatusBadge status={p.status ?? "PENDING"} />
            </div>

            {/* AI pre-screen */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 18, padding: 16, borderRadius: 14, background: aiTone === "green" ? T.greenSoft : T.redSoft }}>
              <span style={{ color: aiTone === "green" ? T.green : T.red, flex: "0 0 auto", marginTop: 1 }}>{I.sparkle({ width: 20, height: 20 })}</span>
              <div>
                <div style={{ fontFamily: T.sans, fontSize: 13.5, fontWeight: 700, color: aiTone === "green" ? T.green : T.red }}>AI pre-screen: {aiScore}</div>
                <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, marginTop: 3, lineHeight: 1.5 }}>{p.aiScamReason ?? "No issues flagged by AI pre-screen."}</div>
              </div>
            </div>

            {/* Key facts */}
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 16 : 28, marginTop: 22 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {([
                  ["Location", p.location?.name ?? "—"],
                  ["Price", naira(Number(p.price) || 0) + "/yr"],
                  ["Distance to campus", p.distanceToCampus != null ? Number(p.distanceToCampus) + " km" : "—"],
                  ["Vacant units", String(p.vacantUnits ?? 1)],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontFamily: T.sans, fontSize: 14 }}>
                    <span style={{ color: T.ink2 }}>{k}</span>
                    <span style={{ color: T.ink, fontWeight: 600, textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {([
                  ["Landlord", p.landlord?.name ?? "—"],
                  ["Landlord status", p.landlord?.verificationStatus ?? "—"],
                  ["Media items", String(images.length)],
                  ["Submitted", p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontFamily: T.sans, fontSize: 14 }}>
                    <span style={{ color: T.ink2 }}>{k}</span>
                    <span style={{ color: T.ink, fontWeight: 600, textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 20, color: T.ink, margin: "0 0 8px" }}>Description</h2>
              <p style={{ fontFamily: T.sans, fontSize: 14.5, color: T.ink2, lineHeight: 1.6, margin: 0 }}>{p.description}</p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div style={{ marginTop: 22 }}>
                <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 20, color: T.ink, margin: "0 0 12px" }}>Amenities</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {amenities.map((a) => (
                    <Pill key={a} tone="clay">{amenityIcon(a, { width: 13, height: 13 })}{" "}{a}</Pill>
                  ))}
                </div>
              </div>
            )}

            {/* Photos */}
            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 20, color: T.ink, margin: "0 0 12px" }}>
                Uploaded photos <span style={{ fontFamily: T.sans, fontSize: 13, color: T.ink3, fontWeight: 400 }}>({images.length} items)</span>
              </h2>
              {images.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 10 }}>
                  {images.slice(0, 8).map((src, i) => (
                    <div key={i} style={{ position: "relative", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden" }}>
                      <Image src={src} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink3, padding: "16px 0" }}>No photos uploaded.</div>
              )}
            </div>

            {/* Review decision */}
            {(p.status === "PENDING" || !p.status) && (
              <div style={{ marginTop: 26, borderTop: "1px solid " + T.line, paddingTop: 22 }}>
                <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 20, color: T.ink, margin: "0 0 12px" }}>Review decision</h2>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (required when rejecting) — shared with the landlord" style={{ minHeight: 72 }} />
                <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <Button variant="danger" icon={I.x} disabled={deciding} onClick={() => decide("REJECTED")}>Reject listing</Button>
                  <Button variant="green" icon={I.check} disabled={deciding} onClick={() => decide("APPROVED")}>Approve listing</Button>
                </div>
              </div>
            )}

            {p.status && p.status !== "PENDING" && (
              <div style={{ marginTop: 22, padding: "14px 18px", borderRadius: 12, background: p.status === "APPROVED" ? T.greenSoft : T.redSoft, fontFamily: T.sans, fontSize: 14, color: p.status === "APPROVED" ? T.green : T.red, fontWeight: 600 }}>
                This listing was already {p.status.toLowerCase()}.
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
