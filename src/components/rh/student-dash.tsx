"use client";

import { useEffect, useState } from "react";
import { T, naira, I, Photo } from "@/lib/rh/theme";
import { useApp, useViewport } from "@/components/rh/app";
import { Button, Card, Avatar, StatusBadge, Field, Input, PropertyCard, SkeletonCard } from "@/components/rh/ui";
import { DashShell, Stat, EmptyState } from "@/components/rh/dash-shell";
import { getBookings, mapBooking, signAgreement, confirmMoveIn, updateProfile, uploadFile, submitReview, getMyInspections, reviewInspection, type UiBooking, type ApiInspection } from "@/lib/rh/api";
import { StarRating } from "@/components/rh/ui";
import { useSaved } from "@/lib/rh/saved";

function initialsOf(name: string) {
  return (name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()) || "?";
}

function ReviewModal({ propertyId, propertyTitle, onClose }: { propertyId: string; propertyTitle: string; onClose: () => void }) {
  const { showToast } = useApp();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!rating) return;
    setSaving(true);
    try {
      await submitReview(propertyId, rating, comment.trim() || undefined);
      showToast("Review submitted — thank you!");
      onClose();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Couldn't submit review");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(33,29,24,.6)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.paper, borderRadius: 20, width: "100%", maxWidth: 460, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontFamily: T.serif, fontSize: 24, color: T.ink, fontWeight: 500 }}>Rate your stay</h2>
          <span onClick={onClose} style={{ cursor: "pointer", color: T.ink2 }}>{I.x({ width: 22, height: 22 })}</span>
        </div>
        <p style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink2, margin: "0 0 18px" }}>{propertyTitle}</p>
        <StarRating value={rating} onChange={setRating} size={32} />
        <div style={{ marginTop: 16 }}>
          <Field label="Comment (optional)">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share what you liked or what could be improved…" rows={3} style={{ width: "100%", fontFamily: T.sans, fontSize: 14, color: T.ink, border: "1px solid " + T.line, borderRadius: 11, padding: "11px 14px", outline: "none", resize: "vertical", boxSizing: "border-box", background: "#fff" }} />
          </Field>
        </div>
        <div style={{ marginTop: 18 }}>
          <Button full disabled={!rating || saving} onClick={submit}>{saving ? "Submitting…" : "Submit review"}</Button>
        </div>
      </div>
    </div>
  );
}

function InspectorReviewModal({ inspection, onClose, onDone }: { inspection: ApiInspection; onClose: () => void; onDone: (updated: ApiInspection) => void }) {
  const { showToast } = useApp();
  const { mobile } = useViewport();
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!rating) return;
    setSaving(true);
    try {
      const updated = await reviewInspection(inspection.id, rating, note.trim() || undefined);
      showToast("Review submitted — thank you!");
      onDone(updated);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Couldn't submit review");
      setSaving(false);
    }
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(33,29,24,.6)", backdropFilter: "blur(3px)", display: "flex", alignItems: mobile ? "flex-end" : "center", justifyContent: "center", padding: mobile ? 0 : 20 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: T.paper, borderRadius: mobile ? "20px 20px 0 0" : 20, width: "100%", maxWidth: 460, padding: mobile ? "28px 22px 36px" : 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontFamily: T.serif, fontSize: 22, color: T.ink, fontWeight: 500 }}>Rate your inspector</h2>
          <span onClick={onClose} style={{ cursor: "pointer", color: T.ink2 }}>{I.x({ width: 22, height: 22 })}</span>
        </div>
        <p style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink2, margin: "0 0 4px" }}>
          {inspection.inspector?.name ?? "Inspector"} — {inspection.property?.title ?? ""}
        </p>
        <div style={{ marginTop: 14 }}>
          <StarRating value={rating} onChange={setRating} size={32} />
        </div>
        <div style={{ marginTop: 14 }}>
          <Field label="Note (optional)">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How was the inspection? Was it thorough and helpful?"
              rows={3}
              style={{ width: "100%", fontFamily: T.sans, fontSize: 14, color: T.ink, border: "1px solid " + T.line, borderRadius: 11, padding: "11px 14px", outline: "none", resize: "vertical", boxSizing: "border-box", background: "#fff" }}
            />
          </Field>
        </div>
        <div style={{ marginTop: 18 }}>
          <Button full disabled={!rating || saving} onClick={submit}>{saving ? "Submitting…" : "Submit review"}</Button>
        </div>
      </div>
    </div>
  );
}

function BookingRow({ bk, mobile, onAct }: { bk: UiBooking; mobile: boolean; onAct: (a: string, b: UiBooking) => void }) {
  const { go } = useApp();
  const p = bk.property;
  const total = bk.bid + bk.agencyFee + bk.cautionFee;
  const [reviewing, setReviewing] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  return (
    <Card pad={0} style={{ overflow: "hidden" }}>
      <div style={{ display: mobile ? "block" : "flex" }}>
        <div style={{ position: "relative", width: mobile ? "100%" : 220, height: mobile ? 150 : "auto", flex: "0 0 auto" }}>
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Photo from={p.from} to={p.to} label={p.area} />
          )}
          <span style={{ position: "absolute", top: 12, left: 12 }}><StatusBadge status={bk.status} style={{ background: "rgba(255,255,255,.95)" }} /></span>
        </div>
        <div style={{ flex: 1, padding: mobile ? 18 : 22, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink2, display: "flex", alignItems: "center", gap: 5 }}>{I.pin({ width: 13, height: 13 })}{p.area}</div>
              <h3 style={{ margin: "4px 0 0", fontFamily: T.serif, fontSize: 22, color: T.ink, fontWeight: 500 }}>{p.title}</h3>
            </div>
            <div style={{ textAlign: mobile ? "left" : "right" }}>
              <div style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 600, color: T.ink }}>{naira(bk.bid)}</div>
              <div style={{ fontFamily: T.sans, fontSize: 11.5, color: T.ink2 }}>your bid · listed {naira(p.price)}</div>
            </div>
          </div>

          {bk.status === "PENDING" && (
            <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 9, background: T.goldSoft, borderRadius: 12, padding: "11px 14px", fontFamily: T.sans, fontSize: 13.5, color: T.ink2 }}>
                {I.clock({ width: 16, height: 16, style: { color: T.gold, flex: "0 0 auto" } })} Waiting for {p.landlordName.split(" ")[0]} to review your offer.
              </div>
              <Button variant="danger" onClick={() => onAct("cancel", bk)}>Cancel</Button>
            </div>
          )}

          {(bk.status === "CONFIRMED" || bk.status === "AWAITING_PAYMENT") && (
            <div style={{ marginTop: 16, background: T.claySoft, borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontFamily: T.sans, fontSize: 13.5, fontWeight: 700, color: T.clayDeep }}>Payment required to secure this home</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: T.sans, fontSize: 13, color: T.ink2 }}>
                <span>Rent {naira(bk.bid)} · Agency {naira(bk.agencyFee)} · Caution {naira(bk.cautionFee)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
                <span style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2 }}>Total due</span>
                <span style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 700, color: T.ink }}>{naira(total)}</span>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <Button variant="dark" onClick={() => go("pay", bk.id)} icon={I.wallet} style={{ flex: 1, minWidth: 180 }}>Pay {naira(total)} securely</Button>
                <Button variant="danger" onClick={() => onAct("cancel", bk)}>Cancel</Button>
              </div>
            </div>
          )}

          {bk.status === "PAID" && (
            <div style={{ marginTop: 16, background: T.greenSoft, borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                {I.checkCircle({ width: 18, height: 18, style: { color: T.green } })}<span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.green }}>Paid &amp; secured</span>
                {bk.leaseEndDate && <span style={{ marginLeft: "auto", fontFamily: T.sans, fontSize: 12, color: T.ink2 }}>Lease to {new Date(bk.leaseEndDate).toLocaleDateString()}</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: T.sans, fontSize: 13, color: T.ink, cursor: "pointer" }} onClick={() => go("receipt", bk.id)}>{I.doc({ width: 15, height: 15, style: { color: T.clay } })} Payment receipt</span>
              </div>
              {!bk.agreementSigned && (
                <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", background: T.blueSoft, borderRadius: 10, padding: "11px 14px" }}>
                  {I.doc({ width: 15, height: 15, style: { color: T.blue, flex: "0 0 auto" } })}
                  <span style={{ fontFamily: T.sans, fontSize: 13, color: T.blue, flex: 1, minWidth: 160 }}>Please sign your tenancy agreement to complete your move-in.</span>
                  <Button size="sm" onClick={() => onAct("sign", bk)}>Sign agreement</Button>
                </div>
              )}
              {!bk.movedIn ? (
                <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink2, flex: 1, minWidth: 180 }}>Moved in? Confirm to release payment to your landlord.</span>
                  <Button variant="green" icon={I.check} onClick={() => onAct("movein", bk)}>I&apos;ve moved in</Button>
                </div>
              ) : (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontFamily: T.sans, fontSize: 13, color: T.green, display: "flex", alignItems: "center", gap: 7 }}>{I.checkCircle({ width: 15, height: 15 })} Move-in confirmed · payment released</div>
                  {!hasReviewed && (
                    <div style={{ marginTop: 10 }}>
                      <Button size="sm" variant="soft" icon={I.star} onClick={() => setReviewing(true)}>Leave a review</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, fontFamily: T.sans, fontSize: 12, color: T.ink3 }}>
            <span>Listed by {p.landlordName}</span>
          </div>
        </div>
      </div>
      {reviewing && <ReviewModal propertyId={p.id} propertyTitle={p.title} onClose={() => { setReviewing(false); setHasReviewed(true); }} />}
    </Card>
  );
}

function AgreementModal({ bk, onClose, onSign }: { bk: UiBooking; onClose: () => void; onSign: (name: string) => void }) {
  const [name, setName] = useState("");
  const [read, setRead] = useState(false);
  const rules = [
    "The tenancy runs for the lease period agreed at booking; rent is paid in full via RentalHub before move-in.",
    "The property is for residential use by the named tenant only — no subletting without written consent.",
    "Keep the property clean and in good condition; report damage, leaks or faults to the landlord promptly.",
    "Observe quiet hours (10pm–7am) and be respectful of neighbours in shared compounds.",
    "No smoking indoors, and no pets without the landlord's written permission.",
    "Give at least one month's notice before vacating; the caution fee is refunded after a satisfactory inspection.",
  ];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(33,29,24,.6)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.paper, borderRadius: 20, width: "100%", maxWidth: 560, maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid " + T.line, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><h2 style={{ margin: 0, fontFamily: T.serif, fontSize: 24, color: T.ink, fontWeight: 500 }}>Tenancy agreement</h2><div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink2, marginTop: 2 }}>{bk.property.title} · {bk.property.area}</div></div>
          <span onClick={onClose} style={{ cursor: "pointer", color: T.ink2 }}>{I.x({ width: 22, height: 22 })}</span>
        </div>
        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          <p style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink2, lineHeight: 1.6, marginTop: 0 }}>This agreement is between the landlord and you, the tenant, facilitated by RentalHub. Please read and accept the key terms:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {rules.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 11 }}>
                <span style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 700, color: T.clay, flex: "0 0 auto" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink, lineHeight: 1.5 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: 20, borderTop: "1px solid " + T.line, background: "#fff" }}>
          <label style={{ display: "flex", gap: 9, alignItems: "flex-start", cursor: "pointer", marginBottom: 12 }}>
            <input type="checkbox" checked={read} onChange={(e) => setRead(e.target.checked)} style={{ accentColor: T.clay, width: 16, height: 16, marginTop: 2 }} />
            <span style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, lineHeight: 1.4 }}>I have read and agree to abide by these tenancy terms.</span>
          </label>
          <Field label="Type your full name to sign"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" /></Field>
          <div style={{ marginTop: 14 }}><Button full size="lg" disabled={!read || name.trim().split(/\s+/).length < 2} onClick={() => onSign(name)}>Sign &amp; agree</Button></div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user, updateUser, showToast } = useApp();
  const ext = user as { phoneNumber?: string; matricCardUrl?: string } | null;
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(ext?.phoneNumber ?? "");
  const [saving, setSaving] = useState(false);
  const [matricUrl, setMatricUrl] = useState(ext?.matricCardUrl ?? "");
  const [uploading, setUploading] = useState(false);

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const updated = await updateProfile({ name: name.trim(), phoneNumber: phone.trim() || undefined, matricCardUrl: matricUrl || undefined });
      updateUser(updated);
      showToast("Profile saved");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Couldn't save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleMatricUpload(file: File) {
    setUploading(true);
    try {
      const result = await uploadFile(file);
      setMatricUrl(result.url);
      showToast("Matric card uploaded — save to confirm");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const matricDone = !!matricUrl;

  return (
    <Card pad={22} style={{ maxWidth: 560 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Avatar landlord={{ initials: initialsOf(name || "S"), color: "#3C5A86" }} size={64} />
        <div>
          <div style={{ fontFamily: T.serif, fontSize: 24, color: T.ink }}>{name || "Student"}</div>
          <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, marginTop: 2 }}>{user?.email}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Phone number" hint="Optional"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" /></Field>
        <Field label="Email"><Input value={user?.email ?? ""} disabled style={{ opacity: 0.6 }} /></Field>
        <div style={{ borderTop: "1px solid " + T.line2, paddingTop: 14 }}>
          <div style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: T.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 12 }}>Student verification</div>
          <label style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, border: "1px dashed " + (matricDone ? T.green : T.line), borderRadius: 14, cursor: "pointer", background: matricDone ? T.greenSoft : "#fff" }}>
            <span style={{ width: 42, height: 42, borderRadius: 11, background: matricDone ? "#fff" : T.paper, color: matricDone ? T.green : T.clay, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
              {matricDone ? I.check({ width: 20, height: 20 }) : I.user({ width: 20, height: 20 })}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 600, color: T.ink }}>Student matric card</div>
              <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink2 }}>Upload your school ID / matriculation card</div>
            </div>
            <span style={{ color: matricDone ? T.green : T.ink3, fontFamily: T.sans, fontSize: 12.5, fontWeight: 600 }}>
              {uploading ? "Uploading…" : matricDone ? "Uploaded ✓" : <>{I.upload({ width: 15, height: 15 })} Upload</>}
            </span>
            <input type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMatricUpload(f); }} />
          </label>
        </div>
        <Button disabled={!name.trim() || saving} onClick={save}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </Card>
  );
}

function SavedTab() {
  const { go } = useApp();
  const { mobile } = useViewport();
  const { items, isSaved, toggle } = useSaved();
  if (items.length === 0) return <EmptyState icon={I.inbox} title="No saved homes yet" sub="Browse properties and tap the heart to save your favourites here." action={<Button onClick={() => go("search")} iconRight={I.arrow}>Browse homes</Button>} />;
  return (
    <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fill, minmax(248px, 1fr))", gap: mobile ? 16 : 20 }}>
      {items.map((l) => <PropertyCard key={l.id} l={l} mobile={mobile} onClick={() => go("property", l.id)} saved={isSaved(l.id)} onSave={() => toggle(l)} />)}
    </div>
  );
}

export function StudentDash({ initial }: { initial?: string }) {
  const { go, showToast, user } = useApp();
  const { mobile } = useViewport();
  const extUser = user as { matricCardUrl?: string } | null;
  const hasId = !!extUser?.matricCardUrl;
  const [tab, setTab] = useState(initial || "bookings");
  const [bookings, setBookings] = useState<UiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signing, setSigning] = useState<UiBooking | null>(null);
  const [inspections, setInspections] = useState<ApiInspection[]>([]);
  const [reviewingInspection, setReviewingInspection] = useState<ApiInspection | null>(null);

  useEffect(() => {
    let active = true;
    getBookings()
      .then((bs) => { if (active) setBookings(bs.map(mapBooking)); })
      .catch((e) => { if (active) setError(e instanceof Error ? e.message : "Failed to load bookings"); })
      .finally(() => { if (active) setLoading(false); });
    getMyInspections()
      .then((items) => { if (active) setInspections(items); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const update = (id: string, patch: Partial<UiBooking>) => setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const onAct = async (action: string, bk: UiBooking) => {
    if (action === "cancel") {
      setBookings((bs) => bs.filter((b) => b.id !== bk.id));
      showToast("Booking removed");
    } else if (action === "sign") {
      setSigning(bk);
    } else if (action === "movein") {
      try { await confirmMoveIn(bk.id); update(bk.id, { movedIn: true }); showToast("Move-in confirmed · payment released"); }
      catch (e) { showToast(e instanceof Error ? e.message : "Couldn't confirm move-in"); }
    }
  };

  const counts = {
    total: bookings.length,
    paid: bookings.filter((b) => b.status === "PAID").length,
    active: bookings.filter((b) => ["CONFIRMED", "AWAITING_PAYMENT"].includes(b.status)).length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
  };
  const visible = bookings.filter((b) => b.status !== "CANCELLED");

  return (
    <DashShell role="student" tab={tab} setTab={(t) => (t === "home" ? go("search") : setTab(t))} title="Student dashboard" subtitle="Browse homes and manage your bookings"
      badges={{ bookings: counts.active || undefined, inspections: inspections.filter((i) => i.status === "REQUESTED" || i.status === "ACCEPTED").length || undefined }}
      action={<Button variant="dark" icon={I.search} onClick={() => go("search")} size={mobile ? "sm" : "md"}>{mobile ? "Browse" : "Browse homes"}</Button>}>

      <div className="rh-m-col2" style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: mobile ? 12 : 18, marginBottom: 26 }}>
        <Stat label="Total bookings" value={counts.total} tone="ink" icon={I.inbox} />
        <Stat label="Paid & secured" value={counts.paid} tone="green" icon={I.checkCircle} />
        <Stat label="Awaiting action" value={counts.active} tone="clay" icon={I.clock} />
        <Stat label="Pending offers" value={counts.pending} tone="gold" icon={I.bolt} />
      </div>

      {!hasId && tab !== "profile" && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: T.goldSoft, border: "1.5px solid " + T.gold, borderRadius: 14, padding: "14px 18px", marginBottom: 22, flexWrap: "wrap" }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", color: T.gold }}>
            {I.shieldAlert({ width: 20, height: 20 })}
          </span>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.ink }}>Upload your student ID to book</div>
            <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink2, marginTop: 2 }}>You need to verify your identity before placing a booking request.</div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setTab("profile")}>Upload ID card</Button>
        </div>
      )}

      {tab === "profile" ? (
        <ProfileTab />
      ) : tab === "saved" ? (
        <SavedTab />
      ) : tab === "inspections" ? (
        inspections.length === 0 ? (
          <EmptyState icon={I.search} title="No inspections yet" sub="Request a campus inspection on any property page to get a video report before you commit." action={<Button onClick={() => go("search")} iconRight={I.arrow}>Browse homes</Button>} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {inspections.map((insp) => {
              const statusColor: Record<string, string> = { REQUESTED: T.gold ?? "#C99500", ACCEPTED: T.blue ?? "#2B5278", COMPLETED: T.green, EXPIRED: T.ink3 };
              const statusLabel: Record<string, string> = { REQUESTED: "Waiting for inspector", ACCEPTED: "Inspector assigned", COMPLETED: "Completed", EXPIRED: "Expired" };
              const canReview = insp.status === "COMPLETED" && insp.inspector && insp.inspectorRating == null;
              return (
                <Card key={insp.id} pad={mobile ? 16 : 20}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.ink }}>{insp.property?.title ?? "—"}</div>
                      <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, marginTop: 2 }}>{insp.property?.location?.name ?? ""}</div>
                      {insp.inspector && (
                        <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink2, marginTop: 4 }}>
                          Inspector: <strong>{insp.inspector.name}</strong>
                        </div>
                      )}
                      {insp.videoLink && (
                        <a href={insp.videoLink} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, padding: "7px 13px", borderRadius: 10, background: T.claySoft, color: T.clay, fontFamily: T.sans, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                          {I.arrow({ width: 13, height: 13 })} Watch inspection video
                        </a>
                      )}
                      {insp.notes && (
                        <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink2, marginTop: 8, padding: "10px 12px", background: T.paper, borderRadius: 10, lineHeight: 1.5 }}>
                          {insp.notes}
                        </div>
                      )}
                      {insp.inspectorRating != null && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                          {[1,2,3,4,5].map((n) => (
                            <span key={n} style={{ fontSize: 14, color: n <= insp.inspectorRating! ? T.gold : T.ink3 }}>★</span>
                          ))}
                          {insp.inspectorReviewNote && (
                            <span style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink2, marginLeft: 4 }}>{insp.inspectorReviewNote}</span>
                          )}
                        </div>
                      )}
                      {canReview && (
                        <div style={{ marginTop: 10 }}>
                          <Button size="sm" variant="soft" icon={I.star} onClick={() => setReviewingInspection(insp)}>
                            Rate inspector
                          </Button>
                        </div>
                      )}
                    </div>
                    <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: statusColor[insp.status] ?? T.ink3, background: T.paper, padding: "5px 12px", borderRadius: 999, flex: "0 0 auto" }}>
                      {statusLabel[insp.status] ?? insp.status}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      ) : loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} imgHeight={150} rows={4} />)}
        </div>
      ) : error ? (
        <Card pad={48} style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: T.redSoft, color: T.red, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{I.shieldAlert({ width: 26, height: 26 })}</div>
          <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink }}>Couldn&apos;t load bookings</div>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink2, marginTop: 8 }}>{error} — try signing in again.</p>
        </Card>
      ) : visible.length === 0 ? (
        <EmptyState icon={I.inbox} title="No bookings yet" sub="Browse verified homes near your campus and place your first booking." action={<Button onClick={() => go("search")} iconRight={I.arrow}>Browse homes</Button>} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {visible.map((bk) => <BookingRow key={bk.id} bk={bk} mobile={mobile} onAct={onAct} />)}
        </div>
      )}

      {signing && <AgreementModal bk={signing} onClose={() => setSigning(null)} onSign={async (name) => {
        const bk = signing; setSigning(null);
        try { await signAgreement(bk.id, name); update(bk.id, { agreementSigned: true }); showToast("Tenancy agreement signed"); }
        catch (e) { showToast(e instanceof Error ? e.message : "Couldn't sign agreement"); }
      }} />}
      {reviewingInspection && (
        <InspectorReviewModal
          inspection={reviewingInspection}
          onClose={() => setReviewingInspection(null)}
          onDone={(updated) => {
            setInspections((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
            setReviewingInspection(null);
          }}
        />
      )}
    </DashShell>
  );
}
