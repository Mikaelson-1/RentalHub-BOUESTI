"use client";

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { T, I } from "@/lib/rh/theme";
import { CAMPUSES } from "@/lib/rh/data";
import { useApp, useViewport } from "@/components/rh/app";
import { Button, Field, Input, Select } from "@/components/rh/ui";
import { AuthShell } from "@/components/rh/auth-shell";
import { registerUser } from "@/lib/rh/api";

export default function RegisterPage() {
  const { go, loginWithGoogle, showToast } = useApp();
  const { mobile } = useViewport();
  const [acctRole, setAcctRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!name.trim() || !email.includes("@") || password.length < 8) {
      setError("Enter your name, a valid email, and a password of at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await registerUser({ name: name.trim(), email: email.trim(), password, role: acctRole.toUpperCase() });
      go("verify", null, { role: acctRole, email: email.trim() });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess: async (res) => {
      setError(null);
      setGoogleLoading(true);
      try {
        const { user, isNewUser } = await loginWithGoogle(res.access_token);
        if (isNewUser) { go("setup-role"); return; }
        showToast(`Welcome back, ${user.name}`);
        go(user.role === "LANDLORD" ? "landlord" : "student");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Google sign-up failed.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setError("Google sign-up failed. Please try again."),
  });

  return (
    <AuthShell mobile={mobile} title="Create your account" sub="It takes a minute. You'll verify your email next.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        {([["student", "I’m a student", "Find & book a home", I.user], ["landlord", "I’m a landlord", "List my property", I.home]] as const).map(([r, t, d, Ic]) => (
          <div key={r} onClick={() => setAcctRole(r)} style={{ padding: 16, borderRadius: 14, cursor: "pointer", background: acctRole === r ? T.claySoft : "#fff", border: "1.5px solid " + (acctRole === r ? T.clay : T.line) }}>
            <span style={{ color: acctRole === r ? T.clay : T.ink2 }}>{Ic({ width: 22, height: 22 })}</span>
            <div style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 700, color: T.ink, marginTop: 10 }}>{t}</div>
            <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink2, marginTop: 2 }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chioma Eze" /></Field>
        <Field label="Email address"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></Field>
        {acctRole === "student" && <Field label="School"><Select defaultValue="bouesti">{CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}{c.live ? "" : " (coming soon)"}</option>)}</Select></Field>}
        <Field label="Phone number"><Input placeholder="0803 000 0000" /></Field>
        <Field label="Password" hint="At least 8 characters."><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" /></Field>
        {error && <div style={{ fontFamily: T.sans, fontSize: 13, color: T.red, background: T.redSoft, borderRadius: 10, padding: "10px 14px" }}>{error}</div>}
        <Button full size="lg" disabled={loading} onClick={submit}>{loading ? "Creating account…" : "Create account"}</Button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0 4px" }}>
        <div style={{ flex: 1, height: 1, background: T.line }} />
        <span style={{ fontFamily: T.sans, fontSize: 12.5, color: T.ink3 }}>or</span>
        <div style={{ flex: 1, height: 1, background: T.line }} />
      </div>
      <button
        disabled={googleLoading}
        onClick={() => googleSignup()}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "13px", background: "#fff", border: "1px solid " + T.line, borderRadius: 999, cursor: googleLoading ? "not-allowed" : "pointer", fontFamily: T.sans, fontSize: 14.5, fontWeight: 600, color: T.ink, opacity: googleLoading ? 0.7 : 1 }}>
        <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-1.9 3.2-4.8 3.2-7.9Z" /><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.9A10.9 10.9 0 0 0 12 23Z" /><path fill="#FBBC05" d="M6 14.3a6.5 6.5 0 0 1 0-4.2V7.2H2.3a10.9 10.9 0 0 0 0 9.8L6 14.3Z" /><path fill="#EA4335" d="M12 5.5c1.6 0 3 .5 4.1 1.6l3.1-3.1A10.9 10.9 0 0 0 2.3 7.2L6 10.1c.9-2.6 3.2-4.6 6-4.6Z" /></svg>
        {googleLoading ? "Signing up…" : "Continue with Google"}
      </button>
      <p style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink2, textAlign: "center", marginTop: 20 }}>
        Already have an account? <span onClick={() => go("login")} style={{ color: T.clay, fontWeight: 600, cursor: "pointer" }}>Sign in</span>
      </p>
    </AuthShell>
  );
}
