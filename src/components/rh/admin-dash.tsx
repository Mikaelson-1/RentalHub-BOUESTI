"use client";

import { useEffect, useState } from "react";
import { T, naira, I, Photo } from "@/lib/rh/theme";
import { useApp, useViewport } from "@/components/rh/app";
import { Button, Card, Avatar, StatusBadge, Pill, SkeletonCard } from "@/components/rh/ui";
import { DashShell, Stat, EmptyState } from "@/components/rh/dash-shell";
import {
  getAdminSummary, getPendingProperties, getAdminLandlords, getAdminPayouts,
  getAdminAllProperties, getAdminUsers, changePassword, setUserFreeze, setUserFlag,
  setPropertyStatus, setLandlordVerification, setPayoutStatus, mapProperty,
  type AdminSummary, type AdminLandlord, type AdminPayout, type ApiProperty, type AdminUser, type UiListing,
} from "@/lib/rh/api";


function initialsOf(name: string) {
  return (name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()) || "?";
}

function AiScore({ score, note, compact }: { score: string; note?: string | null; compact?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: compact ? "center" : "flex-start", gap: 9 }}>
      <Pill tone={score === "PASS" ? "green" : score === "FAIL" ? "red" : "gold"} icon={I.sparkle}>AI: {score}</Pill>
      {note && !compact && <span style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink2, fontStyle: "italic", lineHeight: 1.4 }}>&quot;{note}&quot;</span>}
    </div>
  );
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const { showToast } = useApp();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!current || !next || !confirm) { setError("All fields are required."); return; }
    if (next.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (next !== confirm) { setError("New passwords do not match."); return; }
    setLoading(true);
    try {
      await changePassword(current, next);
      showToast("Password updated successfully");
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = { width: "100%", boxSizing: "border-box" as const, padding: "10px 13px", borderRadius: 10, border: `1.5px solid ${T.line}`, fontFamily: T.sans, fontSize: 14, color: T.ink, background: T.paper, outline: "none" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(33,29,24,.35)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, padding: 28, width: "100%", maxWidth: 400, boxShadow: "0 24px 60px rgba(0,0,0,.22)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontFamily: T.serif, fontSize: 22, fontWeight: 500, color: T.ink }}>Change password</h2>
          <span onClick={onClose} style={{ cursor: "pointer", color: T.ink2 }}>{I.x({ width: 20, height: 20 })}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={{ display: "block", fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: T.ink2, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Current password</label><input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="••••••••" style={fieldStyle} /></div>
          <div><label style={{ display: "block", fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: T.ink2, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>New password</label><input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="Min. 8 characters" style={fieldStyle} /></div>
          <div><label style={{ display: "block", fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: T.ink2, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Confirm new password</label><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" onKeyDown={(e) => { if (e.key === "Enter") void submit(); }} style={fieldStyle} /></div>
          {error && <div style={{ fontFamily: T.sans, fontSize: 13, color: T.red, background: T.redSoft, borderRadius: 10, padding: "10px 14px" }}>{error}</div>}
          <Button full disabled={loading} onClick={() => void submit()}>{loading ? "Updating…" : "Update password"}</Button>
        </div>
      </div>
    </div>
  );
}

export function AdminDash() {
  const { showToast, go, user } = useApp();
  const { mobile } = useViewport();
  const userRole = user?.role ?? "ADMIN";
  const canManageUsers = ["ADMIN", "MODERATOR"].includes(userRole);

  const VISIBLE_TABS: Record<string, string[]> = {
    ADMIN: ["pending", "verifications", "properties", "payouts", "users", "forecast"],
    MODERATOR: ["pending", "verifications", "properties", "users"],
    AUDITOR: ["payouts", "forecast", "users"],
  };
  const visibleTabs = VISIBLE_TABS[userRole] ?? VISIBLE_TABS.ADMIN;

  const [tab, setTab] = useState(() => visibleTabs[0]);
  const [showChangePw, setShowChangePw] = useState(false);
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [pending, setPending] = useState<ApiProperty[]>([]);
  const [verifs, setVerifs] = useState<AdminLandlord[]>([]);
  const [payouts, setPayouts] = useState<AdminPayout[]>([]);
  const [allProperties, setAllProperties] = useState<UiListing[]>([]);
  const [allPropsFilter, setAllPropsFilter] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      getAdminSummary(), getPendingProperties(), getAdminLandlords(), getAdminPayouts(),
      getAdminAllProperties(), getAdminUsers(),
    ]).then((res) => {
      if (!active) return;
      const [s, p, v, po, ap, u] = res;
      if (s.status === "fulfilled") setSummary(s.value);
      if (p.status === "fulfilled") setPending(p.value.items);
      if (v.status === "fulfilled") setVerifs(v.value);
      if (po.status === "fulfilled") setPayouts(po.value);
      if (ap.status === "fulfilled") setAllProperties(ap.value.items.map(mapProperty));
      if (u.status === "fulfilled") setUsers(u.value.items);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const awaitingVerifs = verifs.filter((v) => v.verificationStatus === "UNDER_REVIEW");

  const decideProperty = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await setPropertyStatus(id, status, status === "REJECTED" ? "Rejected from the admin review queue." : undefined);
      setPending((a) => a.filter((x) => x.id !== id));
      showToast(status === "APPROVED" ? "Listing approved & published" : "Listing rejected — landlord notified");
    } catch (e) { showToast(e instanceof Error ? e.message : "Action failed"); }
  };
  const decideVerif = async (id: string, action: "APPROVE" | "REJECT") => {
    try {
      await setLandlordVerification(id, action, action === "REJECT" ? "Documents did not meet our verification requirements." : undefined);
      setVerifs((a) => a.map((x) => (x.id === id ? { ...x, verificationStatus: action === "APPROVE" ? "VERIFIED" : "REJECTED" } : x)));
      showToast(action === "APPROVE" ? "Landlord verified" : "Verification rejected");
    } catch (e) { showToast(e instanceof Error ? e.message : "Action failed"); }
  };
  const decidePayout = async (id: string, action: "COMPLETE" | "FAIL") => {
    try {
      await setPayoutStatus(id, action);
      setPayouts((a) => a.filter((x) => x.id !== id));
      showToast(action === "COMPLETE" ? "Payout marked complete — landlord notified" : "Flagged to support");
    } catch (e) { showToast(e instanceof Error ? e.message : "Action failed"); }
  };
  const freezeUser = async (u: AdminUser, action: "FREEZE" | "UNFREEZE") => {
    try {
      await setUserFreeze(u.id, action);
      const updated = { ...u, isFrozen: action === "FREEZE" };
      setUsers((a) => a.map((x) => (x.id === u.id ? updated : x)));
      setSelectedUser(updated);
      showToast(action === "FREEZE" ? `${u.name} has been suspended` : `${u.name}'s account restored`);
    } catch (e) { showToast(e instanceof Error ? e.message : "Action failed"); }
  };
  const flagUser = async (u: AdminUser, action: "FLAG" | "UNFLAG") => {
    try {
      await setUserFlag(u.id, action);
      showToast(action === "FLAG" ? `${u.name} has been flagged for review` : `Flag removed from ${u.name}`);
    } catch (e) { showToast(e instanceof Error ? e.message : "Action failed"); }
  };

  return (
    <>
    {showChangePw && <ChangePasswordModal onClose={() => setShowChangePw(false)} />}
    <DashShell role="admin" tab={tab} setTab={setTab}
      title={userRole === "MODERATOR" ? "Moderator dashboard" : userRole === "AUDITOR" ? "Auditor dashboard" : "Admin dashboard"}
      subtitle={userRole === "MODERATOR" ? "Review listings, verify landlords and manage users" : userRole === "AUDITOR" ? "Review payouts and transaction records" : "Review listings, verify landlords and manage payouts"}
      badges={{ pending: pending.length || undefined, verifications: awaitingVerifs.length || undefined, payouts: payouts.length || undefined }}
      visibleTabs={visibleTabs}
      action={<Button size="sm" variant="outline" icon={I.shield} onClick={() => setShowChangePw(true)}>Change password</Button>}>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(6,1fr)", gap: mobile ? 12 : 14, marginBottom: 26 }}>
        <Stat label="Properties" value={summary?.totalProperties ?? "—"} tone="ink" icon={I.building} onClick={() => setTab("properties")} active={tab === "properties"} />
        <Stat label="Pending" value={pending.length} tone="gold" icon={I.clock} onClick={() => setTab("pending")} active={tab === "pending"} />
        <Stat label="Verifications" value={awaitingVerifs.length} tone="blue" icon={I.shield} onClick={() => setTab("verifications")} active={tab === "verifications"} />
        <Stat label="Payouts" value={payouts.length} tone="green" icon={I.wallet} onClick={() => setTab("payouts")} active={tab === "payouts"} />
        <Stat label="Users" value={summary ? summary.totalUsers.toLocaleString() : "—"} tone="ink" icon={I.users} onClick={() => setTab("users")} active={tab === "users"} />
        <Stat label="Bookings" value={summary?.totalBookings ?? "—"} tone="clay" icon={I.inbox} onClick={() => setTab("forecast")} active={tab === "forecast"} />
      </div>

      {tab === "pending" && (
        loading ? <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[1,2,3].map((i) => <SkeletonCard key={i} imgHeight={96} rows={3} />)}</div>
        : pending.length === 0 ? <EmptyState icon={I.checkCircle} title="All caught up" sub="No properties are waiting for review." />
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {pending.map((p) => {
              const aiScore = p.aiScamFlag ? "FAIL" : "PASS";
              const media = Array.isArray(p.images) ? p.images.length : 0;
              return (
                <Card key={p.id} pad={mobile ? 16 : 20}>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ width: mobile ? "100%" : 130, height: mobile ? 130 : 96, borderRadius: 12, overflow: "hidden", flex: "0 0 auto" }}><Photo seed={p.id.length} tag={false} /></div>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <h3 style={{ margin: 0, fontFamily: T.serif, fontSize: 21, color: T.ink, fontWeight: 500 }}>{p.title}</h3>
                      <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, marginTop: 4 }}>{p.landlord?.name ?? "—"} · {p.location?.name ?? "—"} · <strong style={{ color: T.ink }}>{naira(Number(p.price) || 0)}/yr</strong></div>
                      <div style={{ fontFamily: T.sans, fontSize: 12, color: T.ink3, marginTop: 4 }}>{media} media item{media === 1 ? "" : "s"}{p.createdAt ? ` · submitted ${new Date(p.createdAt).toLocaleDateString()}` : ""}</div>
                      <div style={{ marginTop: 12 }}><AiScore score={aiScore} note={p.aiScamReason ?? "No issues detected by AI pre-screen."} /></div>
                    </div>
                    <div style={{ display: "flex", flexDirection: mobile ? "row" : "column", gap: 8, justifyContent: "center", flex: "0 0 auto", width: mobile ? "100%" : "auto" }}>
                      <Button variant="green" size="sm" full={mobile} onClick={() => decideProperty(p.id, "APPROVED")}>Approve</Button>
                      <Button variant="danger" size="sm" full={mobile} onClick={() => decideProperty(p.id, "REJECTED")}>Reject</Button>
                      <Button variant="ghost" size="sm" full={mobile} onClick={() => go("review", p.id)} iconRight={I.chevRight}>Review</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      )}

      {tab === "verifications" && (
        loading ? <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[1,2,3].map((i) => <SkeletonCard key={i} rows={4} />)}</div>
        : verifs.length === 0 ? <EmptyState icon={I.shield} title="No verifications pending" sub="All landlord submissions have been reviewed." />
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {verifs.map((v) => (
              <Card key={v.id} pad={mobile ? 16 : 20} style={{ opacity: v.verificationStatus === "REJECTED" ? 0.7 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 14, flex: 1, minWidth: 200 }}>
                    <Avatar landlord={{ initials: initialsOf(v.name), color: "#8A5A6B" }} size={46} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><span style={{ fontFamily: T.sans, fontSize: 15.5, fontWeight: 700, color: T.ink }}>{v.name}</span><StatusBadge status={v.verificationStatus} /></div>
                      <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2 }}>{v.email}</div>
                      {v.aiPreScreenScore && <div style={{ marginTop: 10 }}><AiScore score={v.aiPreScreenScore} note={v.aiPreScreenNote} /></div>}
                      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                        {([["Gov ID", v.governmentIdUrl], ["Selfie", v.selfieUrl], ["Ownership", v.ownershipProofUrl]] as [string, string | null | undefined][]).map(([t, url]) => (
                          url ? (
                            <a key={t} href={url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 10, fontFamily: T.sans, fontSize: 12.5, fontWeight: 600, background: T.blueSoft, color: T.blue, border: "1px solid transparent", textDecoration: "none", cursor: "pointer" }}>
                              {I.doc({ width: 13, height: 13 })} {t} {I.chevRight({ width: 11, height: 11 })}
                            </a>
                          ) : (
                            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 10, fontFamily: T.sans, fontSize: 12.5, fontWeight: 600, background: T.paper, color: T.ink3, border: "1px solid " + T.line }}>
                              {I.x({ width: 13, height: 13 })} {t}
                            </span>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                  {v.verificationStatus === "UNDER_REVIEW" && (
                    <div style={{ display: "flex", flexDirection: mobile ? "row" : "column", gap: 8, flex: "0 0 auto", width: mobile ? "100%" : "auto" }}>
                      <Button variant="green" size="sm" full={mobile} onClick={() => decideVerif(v.id, "APPROVE")}>Approve</Button>
                      <Button variant="danger" size="sm" full={mobile} onClick={() => decideVerif(v.id, "REJECT")}>Reject</Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {tab === "payouts" && (
        loading ? <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[1,2,3].map((i) => <SkeletonCard key={i} rows={3} />)}</div>
        : payouts.length === 0 ? <EmptyState icon={I.wallet} title="No payouts pending" sub="Payouts appear here once students confirm move-in." />
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {payouts.map((po) => {
              const lord = po.property?.landlord;
              return (
                <Card key={po.id} pad={mobile ? 16 : 20}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div style={{ fontFamily: T.serif, fontSize: 20, color: T.ink, fontWeight: 500 }}>{po.property?.title ?? "Property"}</div>
                      <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, marginTop: 4 }}>{po.student?.name ?? "Student"} paid · landlord <strong style={{ color: T.ink }}>{lord?.name ?? "—"}</strong></div>
                      <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
                        <div><div style={{ fontFamily: T.sans, fontSize: 11, color: T.ink3, textTransform: "uppercase", letterSpacing: ".04em" }}>Release to landlord</div><div style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 700, color: T.green, marginTop: 2 }}>{naira(Number(po.amount) || 0)}</div></div>
                        <div><div style={{ fontFamily: T.sans, fontSize: 11, color: T.ink3, textTransform: "uppercase", letterSpacing: ".04em" }}>Bank details</div><div style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink, marginTop: 4 }}>{lord?.bankName ?? "—"}<br />{lord?.bankAccountNumber ?? "—"} · {lord?.bankAccountName ?? "—"}</div></div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center", flex: "0 0 auto", width: mobile ? "100%" : "auto" }}>
                      <Button variant="green" full={mobile} icon={I.check} onClick={() => decidePayout(po.id, "COMPLETE")}>Mark transferred</Button>
                      <Button variant="danger" size="sm" full={mobile} onClick={() => decidePayout(po.id, "FAIL")}>Flag issue</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      )}

      {tab === "properties" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {(["", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
              <Button key={s} size="sm" variant={allPropsFilter === s ? "dark" : "outline"} onClick={() => {
                setAllPropsFilter(s);
                getAdminAllProperties(s || undefined).then((r) => setAllProperties(r.items.map(mapProperty))).catch(() => {});
              }}>{s || "All"}</Button>
            ))}
          </div>
          {loading ? <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[1,2,3].map((i) => <SkeletonCard key={i} rows={2} />)}</div>
          : allProperties.length === 0 ? <EmptyState icon={I.building} title="No properties" sub="No properties match this filter." />
          : (
            <Card pad={0} style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.sans, fontSize: 13.5 }}>
                  <thead>
                    <tr style={{ background: T.paper2 }}>
                      {["Title", "Landlord", "Area", "Price", "Status", ""].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: T.ink2, fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allProperties.map((p, i) => (
                      <tr key={p.id} style={{ borderTop: i ? "1px solid " + T.line2 : "none" }}>
                        <td style={{ padding: "13px 16px", color: T.ink, fontWeight: 500, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</td>
                        <td style={{ padding: "13px 16px", color: T.ink2 }}>{p.landlordName}</td>
                        <td style={{ padding: "13px 16px", color: T.ink2 }}>{p.area}</td>
                        <td style={{ padding: "13px 16px", color: T.ink, whiteSpace: "nowrap" }}>{naira(p.price)}/yr</td>
                        <td style={{ padding: "13px 16px" }}><StatusBadge status={(p as unknown as { status?: string }).status ?? "APPROVED"} /></td>
                        <td style={{ padding: "13px 16px" }}><Button variant="ghost" size="sm" onClick={() => go("review", p.id)} iconRight={I.chevRight}>Review</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === "users" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {(["", "STUDENT", "LANDLORD", "ADMIN", "MODERATOR", "AUDITOR"] as const).map((r) => (
              <Button key={r} size="sm" variant={userRoleFilter === r ? "dark" : "outline"} onClick={() => {
                setUserRoleFilter(r);
                getAdminUsers(r || undefined).then((res) => setUsers(res.items)).catch(() => {});
              }}>{r || "All"}</Button>
            ))}
          </div>
          {loading ? <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[1,2,3].map((i) => <SkeletonCard key={i} rows={2} />)}</div>
          : users.length === 0 ? <EmptyState icon={I.users} title="No users" sub="No users match this filter." />
          : (
            <Card pad={0} style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.sans, fontSize: 13.5 }}>
                  <thead>
                    <tr style={{ background: T.paper2 }}>
                      {["Name", "Email", "Role", "Status", "Properties", "Bookings", "Joined"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: T.ink2, fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} onClick={() => setSelectedUser(u)} style={{ borderTop: i ? "1px solid " + T.line2 : "none", cursor: "pointer" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = T.paper2; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "13px 16px", fontWeight: 600, color: T.ink }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            {u.name}
                            {u.isFrozen && <span style={{ fontSize: 10, fontWeight: 700, background: T.redSoft, color: T.red, borderRadius: 6, padding: "2px 6px", textTransform: "uppercase", letterSpacing: ".04em" }}>Suspended</span>}
                          </span>
                        </td>
                        <td style={{ padding: "13px 16px", color: T.ink2 }}>{u.email}</td>
                        <td style={{ padding: "13px 16px" }}><Pill tone={["ADMIN","MODERATOR","AUDITOR"].includes(u.role) ? "red" : u.role === "LANDLORD" ? "blue" : "clay"}>{u.role}</Pill></td>
                        <td style={{ padding: "13px 16px" }}>{u.verificationStatus !== "UNVERIFIED" ? <StatusBadge status={u.verificationStatus} /> : <span style={{ color: T.ink3, fontSize: 12 }}>—</span>}</td>
                        <td style={{ padding: "13px 16px", color: T.ink2, textAlign: "center" }}>{u._count.properties}</td>
                        <td style={{ padding: "13px 16px", color: T.ink2, textAlign: "center" }}>{u._count.bookings}</td>
                        <td style={{ padding: "13px 16px", color: T.ink3, whiteSpace: "nowrap" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {selectedUser && (
        <div style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(33,29,24,.3)", backdropFilter: "blur(2px)" }} onClick={() => setSelectedUser(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: mobile ? "100%" : 380, background: T.paper, overflowY: "auto", boxShadow: "-24px 0 60px -20px rgba(33,29,24,.25)", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontFamily: T.serif, fontSize: 22, color: T.ink, fontWeight: 500 }}>User detail</h2>
              <span onClick={() => setSelectedUser(null)} style={{ cursor: "pointer", color: T.ink2 }}>{I.x({ width: 22, height: 22 })}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <Avatar landlord={{ initials: initialsOf(selectedUser.name), color: ["ADMIN","MODERATOR","AUDITOR"].includes(selectedUser.role) ? "#8A3A3A" : selectedUser.role === "LANDLORD" ? "#3C5A86" : "#2F5D4F" }} size={56} />
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 20, color: T.ink }}>{selectedUser.name}</div>
                <div style={{ marginTop: 6 }}><Pill tone={["ADMIN","MODERATOR","AUDITOR"].includes(selectedUser.role) ? "red" : selectedUser.role === "LANDLORD" ? "blue" : "clay"}>{selectedUser.role}</Pill></div>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid " + T.line, overflow: "hidden" }}>
              {([
                ["Email", selectedUser.email],
                ["Joined", new Date(selectedUser.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })],
                ["Email verified", selectedUser.emailVerified ? "Yes" : "No"],
                ["Properties", String(selectedUser._count.properties)],
                ["Bookings", String(selectedUser._count.bookings)],
              ] as [string, string][]).map(([label, val], i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderTop: i ? "1px solid " + T.line2 : "none" }}>
                  <span style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2 }}>{label}</span>
                  <span style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.ink }}>{val}</span>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderTop: "1px solid " + T.line2 }}>
                <span style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2 }}>Verification</span>
                <StatusBadge status={selectedUser.verificationStatus} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderTop: "1px solid " + T.line2 }}>
                <span style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2 }}>Account status</span>
                <span style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: selectedUser.isFrozen ? T.red : T.green }}>{selectedUser.isFrozen ? "Suspended" : "Active"}</span>
              </div>
            </div>
            {canManageUsers && !["ADMIN", "MODERATOR", "AUDITOR"].includes(selectedUser.role) && (
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                {selectedUser.isFrozen ? (
                  <Button full variant="outline" icon={I.check} onClick={() => void freezeUser(selectedUser, "UNFREEZE")}>Restore account</Button>
                ) : (
                  <Button full variant="danger" onClick={() => void freezeUser(selectedUser, "FREEZE")}>Suspend account</Button>
                )}
                <Button full variant="outline" size="sm" onClick={() => void flagUser(selectedUser, "FLAG")}>Flag for review</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "forecast" && (
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(3,1fr)", gap: mobile ? 12 : 18 }}>
          <Card pad={22} style={{ background: T.claySoft, border: "none" }}>
            <div style={{ fontFamily: T.sans, fontSize: 13, color: T.clayDeep, fontWeight: 600 }}>Total properties</div>
            <div style={{ fontFamily: T.serif, fontSize: 40, fontWeight: 600, color: T.clay, marginTop: 6 }}>{summary?.totalProperties ?? "—"}</div>
            <div style={{ fontFamily: T.sans, fontSize: 12, color: T.ink3, marginTop: 4 }}>All time</div>
          </Card>
          <Card pad={22}>
            <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, fontWeight: 600 }}>Pending review</div>
            <div style={{ fontFamily: T.serif, fontSize: 40, fontWeight: 600, color: T.gold, marginTop: 6 }}>{pending.length}</div>
            <div style={{ fontFamily: T.sans, fontSize: 12, color: T.ink3, marginTop: 4 }}>Awaiting approval</div>
          </Card>
          <Card pad={22}>
            <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, fontWeight: 600 }}>Total users</div>
            <div style={{ fontFamily: T.serif, fontSize: 40, fontWeight: 600, color: T.ink, marginTop: 6 }}>{summary ? summary.totalUsers.toLocaleString() : "—"}</div>
            <div style={{ fontFamily: T.sans, fontSize: 12, color: T.ink3, marginTop: 4 }}>Registered accounts</div>
          </Card>
          <Card pad={22} style={{ background: T.greenSoft, border: "none" }}>
            <div style={{ fontFamily: T.sans, fontSize: 13, color: T.green, fontWeight: 600 }}>Total bookings</div>
            <div style={{ fontFamily: T.serif, fontSize: 40, fontWeight: 600, color: T.green, marginTop: 6 }}>{summary?.totalBookings ?? "—"}</div>
            <div style={{ fontFamily: T.sans, fontSize: 12, color: T.ink3, marginTop: 4 }}>All time</div>
          </Card>
          <Card pad={22}>
            <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, fontWeight: 600 }}>Pending verifications</div>
            <div style={{ fontFamily: T.serif, fontSize: 40, fontWeight: 600, color: T.blue, marginTop: 6 }}>{awaitingVerifs.length}</div>
            <div style={{ fontFamily: T.sans, fontSize: 12, color: T.ink3, marginTop: 4 }}>Landlords under review</div>
          </Card>
          <Card pad={22}>
            <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, fontWeight: 600 }}>Pending payouts</div>
            <div style={{ fontFamily: T.serif, fontSize: 40, fontWeight: 600, color: T.ink, marginTop: 6 }}>{payouts.length}</div>
            <div style={{ fontFamily: T.sans, fontSize: 12, color: T.ink3, marginTop: 4 }}>Awaiting transfer</div>
          </Card>
        </div>
      )}
    </DashShell>
    </>
  );
}
