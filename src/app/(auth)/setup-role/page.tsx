"use client";

import { useState } from "react";
import { T, I, Logo } from "@/lib/rh/theme";
import { CAMPUSES } from "@/lib/rh/data";
import { useApp, useViewport } from "@/components/rh/app";
import { Button, Card, Field, Select } from "@/components/rh/ui";
import { apiPatch, type AuthUser } from "@/lib/rh/api";

export default function SetupRolePage() {
  const { go, showToast, user, updateUser, setCampus } = useApp();
  const { mobile } = useViewport();
  const [sel, setSel] = useState<"STUDENT" | "LANDLORD" | null>(null);
  const [campusId, setCampusId] = useState(CAMPUSES[0].id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName = user?.name?.split(" ")[0] || "there";

  const confirm = async () => {
    if (!sel) return;
    setError(null);
    setSaving(true);
    try {
      const updated = await apiPatch<AuthUser>("/api/auth/setup-role", {
        role: sel,
        ...(sel === "STUDENT" ? { campus: campusId } : {}),
      });
      updateUser(updated);
      if (sel === "STUDENT") setCampus(campusId);
      showToast("Account ready");
      go(sel.toLowerCase() as "student" | "landlord");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save role");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.paper, display: "flex", alignItems: "center", justifyContent: "center", padding: mobile ? "32px 20px" : 48 }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        <div onClick={() => go("home")} style={{ cursor: "pointer", display: "flex", justifyContent: "center", marginBottom: 28 }}><Logo /></div>
        <Card pad={mobile ? 26 : 38}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: T.serif, fontWeight: 400, fontSize: mobile ? 28 : 34, letterSpacing: "-.02em", color: T.ink, margin: 0 }}>Welcome, {firstName}!</h1>
            <p style={{ fontFamily: T.sans, fontSize: 14.5, color: T.ink2, marginTop: 10 }}>One last step — tell us how you&apos;ll use RentalHub.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 14, marginTop: 26 }}>
            {([["STUDENT", "I'm a student", "Browse and book verified homes near your school.", I.user],
              ["LANDLORD", "I'm a landlord", "List your property and reach verified student tenants.", I.home]] as const).map(([r, t, d, Ic]) => (
              <div key={r} onClick={() => setSel(r)} style={{ padding: 22, borderRadius: 16, cursor: "pointer", textAlign: "left", background: sel === r ? T.claySoft : "#fff", border: "2px solid " + (sel === r ? T.clay : T.line), transition: "all .12s" }}>
                <div style={{ width: 48, height: 48, borderRadius: 999, background: sel === r ? T.clay : T.paper, color: sel === r ? "#fff" : T.ink2, display: "flex", alignItems: "center", justifyContent: "center" }}>{Ic({ width: 23, height: 23 })}</div>
                <div style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 700, color: T.ink, marginTop: 14 }}>{t}</div>
                <p style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, marginTop: 5, lineHeight: 1.5 }}>{d}</p>
              </div>
            ))}
          </div>
          {sel === "STUDENT" && (
            <div style={{ marginTop: 18 }}>
              <Field label="Your school">
                <Select value={campusId} onChange={(e) => setCampusId(e.target.value)}>
                  {CAMPUSES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}{c.live ? "" : " (coming soon)"}</option>
                  ))}
                </Select>
              </Field>
            </div>
          )}
          {error && <div style={{ fontFamily: T.sans, fontSize: 13, color: T.red, background: T.redSoft, borderRadius: 10, padding: "10px 14px", marginTop: 16 }}>{error}</div>}
          <div style={{ marginTop: 24 }}>
            <Button full size="lg" disabled={!sel || saving} iconRight={I.arrow} onClick={confirm}>
              {saving ? "Saving…" : "Continue"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
