"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, I, Logo } from "@/lib/rh/theme";
import { CAMPUSES } from "@/lib/rh/data";
import { useViewport } from "@/components/rh/app";
import { Button, Field, Input, Select } from "@/components/rh/ui";
import { API_BASE, AUTH_STORAGE_KEY } from "@/lib/rh/api";

interface FormData {
  name: string;
  email: string;
  password: string;
  matricNumber: string;
  campus: string;
}

const isDriveLink = (v: string) => /^https:\/\/(drive|docs)\.google\.com\//.test(v.trim());

export default function InspectorSignupPage() {
  const router = useRouter();
  const { mobile } = useViewport();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({ name: "", email: "", password: "", matricNumber: "", campus: "bouesti" });
  const set = (k: keyof FormData, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const [idLink, setIdLink] = useState("");
  const [screenshotLink, setScreenshotLink] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const liveCampuses = CAMPUSES.filter((c) => c.live);

  const validateStep0 = () => {
    if (!form.name.trim()) return "Enter your full name.";
    if (!form.email.includes("@")) return "Enter a valid email address.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (!form.matricNumber.trim()) return "Enter your matriculation number.";
    return null;
  };

  const nextStep = () => {
    const err = validateStep0();
    if (err) { setError(err); return; }
    setError(null);
    setStep(1);
  };

  const submit = async () => {
    if (!isDriveLink(idLink)) { setError("Paste a valid Google Drive link for your Student ID."); return; }
    if (!isDriveLink(screenshotLink)) { setError("Paste a valid Google Drive link for your portal screenshot."); return; }
    setError(null);
    setBusy(true);

    try {
      // 1. Register the inspector account.
      const regRes = await fetch(`${API_BASE}/api/auth/inspector-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const regJson = await regRes.json();
      if (!regRes.ok || regJson.success === false) throw new Error(regJson.error ?? "Registration failed.");
      const { token, user } = regJson.data ?? regJson;

      // 2. Save document links to the profile.
      const patchRes = await fetch(`${API_BASE}/api/auth/me`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ studentIdUrl: idLink.trim(), portalScreenshotUrl: screenshotLink.trim() }),
      });
      const patchJson = await patchRes.json();
      if (!patchRes.ok || patchJson.success === false) throw new Error(patchJson.error ?? "Profile update failed.");

      // 3. Store session so the success page can read the user state.
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
      router.push("/inspector-signup/success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const steps = ["Your details", "Documents"];

  return (
    <div style={{ minHeight: "100vh", background: T.paper, display: "flex", alignItems: "center", justifyContent: "center", padding: mobile ? "32px 20px 48px" : 48 }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div onClick={() => router.push("/")} style={{ cursor: "pointer", display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <Logo />
        </div>

        <div style={{ background: "#fff", borderRadius: 22, padding: mobile ? "28px 22px" : "40px 36px", boxShadow: "0 4px 32px rgba(33,29,24,.08)" }}>
          {/* Step progress */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{ height: 4, borderRadius: 4, background: i <= step ? T.clay : T.line }} />
                <div style={{ fontFamily: T.sans, fontSize: 11.5, color: i === step ? T.clay : T.ink3, marginTop: 6, fontWeight: i === step ? 700 : 500 }}>
                  {i + 1}. {s}
                </div>
              </div>
            ))}
          </div>

          {step === 0 && (
            <>
              <h1 style={{ fontFamily: T.serif, fontWeight: 400, fontSize: 28, color: T.ink, margin: "0 0 6px" }}>Become a campus inspector</h1>
              <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink2, marginBottom: 24, lineHeight: 1.5 }}>
                Help students verify homes before they pay. You must be a registered student at a live campus.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="Full name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Adaeze Okonkwo" /></Field>
                <Field label="School email"><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@school.edu.ng" /></Field>
                <Field label="Campus">
                  <Select value={form.campus} onChange={(e) => set("campus", e.target.value)}>
                    {liveCampuses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                </Field>
                <Field label="Matriculation number"><Input value={form.matricNumber} onChange={(e) => set("matricNumber", e.target.value)} placeholder="e.g. 2021/1/00234AC" /></Field>
                <Field label="Password" hint="At least 8 characters."><Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Create a password" /></Field>
              </div>
              {error && <div style={{ fontFamily: T.sans, fontSize: 13, color: T.red, background: T.redSoft, borderRadius: 10, padding: "10px 14px", marginTop: 16 }}>{error}</div>}
              <div style={{ marginTop: 22 }}>
                <Button full size="lg" iconRight={I.arrow} onClick={nextStep}>Continue</Button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 style={{ fontFamily: T.serif, fontWeight: 400, fontSize: 26, color: T.ink, margin: "0 0 6px" }}>Share your documents</h2>
              <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink2, marginBottom: 8, lineHeight: 1.5 }}>
                Upload your documents to Google Drive, set sharing to <strong>Anyone with the link</strong>, then paste each link below.
              </p>
              <div style={{ background: T.paper, borderRadius: 12, padding: "10px 14px", marginBottom: 20 }}>
                <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink3, lineHeight: 1.6 }}>
                  Documents needed: <strong style={{ color: T.ink }}>Student ID card</strong> and <strong style={{ color: T.ink }}>student portal screenshot</strong> (showing your name &amp; matric number).
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field
                  label="Student ID card — Google Drive link"
                  hint="drive.google.com/file/d/… or drive.google.com/open?id=…"
                >
                  <Input
                    value={idLink}
                    onChange={(e) => setIdLink(e.target.value)}
                    placeholder="https://drive.google.com/file/d/…"
                  />
                </Field>
                <Field
                  label="Portal screenshot — Google Drive link"
                  hint="Current semester showing your name and matric number."
                >
                  <Input
                    value={screenshotLink}
                    onChange={(e) => setScreenshotLink(e.target.value)}
                    placeholder="https://drive.google.com/file/d/…"
                  />
                </Field>
              </div>
              {error && <div style={{ fontFamily: T.sans, fontSize: 13, color: T.red, background: T.redSoft, borderRadius: 10, padding: "10px 14px", marginTop: 16 }}>{error}</div>}
              <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                <Button size="lg" onClick={() => { setError(null); setStep(0); }} style={{ flex: "0 0 auto" }}>Back</Button>
                <Button full size="lg" disabled={busy} onClick={submit}>
                  {busy ? "Submitting application…" : "Submit application"}
                </Button>
              </div>
            </>
          )}
        </div>

        <p style={{ fontFamily: T.sans, fontSize: 13, color: T.ink3, textAlign: "center", marginTop: 20 }}>
          Already registered?{" "}
          <span onClick={() => router.push("/login")} style={{ color: T.clay, fontWeight: 600, cursor: "pointer" }}>Sign in</span>
        </p>
      </div>
    </div>
  );
}
