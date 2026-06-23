"use client";

import { useState } from "react";
import { T, I } from "@/lib/rh/theme";
import { useApp, useViewport } from "@/components/rh/app";
import { Button, Card, Field, Input } from "@/components/rh/ui";
import { AuthShell } from "@/components/rh/auth-shell";
import { apiPost } from "@/lib/rh/api";

export default function ForgotPasswordPage() {
  const { go, showToast } = useApp();
  const { mobile } = useViewport();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await apiPost("/api/auth/forgot-password", { email: email.toLowerCase() });
    } catch {
      // Always show success to avoid leaking registered emails
    } finally {
      setLoading(false);
      setSent(true);
    }
  }

  return (
    <AuthShell mobile={mobile} title="Forgot password?" sub="Enter your email and we'll send you a link to reset it.">
      {!sent ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Email address">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              onKeyDown={(e) => e.key === "Enter" && email.includes("@") && handleSubmit()}
            />
          </Field>
          <Button full size="lg" disabled={!email.includes("@") || loading} onClick={handleSubmit}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </div>
      ) : (
        <Card pad={20} style={{ background: T.greenSoft, border: "1px solid " + T.green + "22" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            {I.mail({ width: 20, height: 20, style: { color: T.green } })}
            <span style={{ fontFamily: T.sans, fontWeight: 700, color: T.green, fontSize: 14.5 }}>Check your inbox</span>
          </div>
          <p style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink2, lineHeight: 1.55, marginTop: 8 }}>
            If <strong style={{ color: T.ink }}>{email}</strong> is registered, you&apos;ll receive a reset link shortly. Check spam if you don&apos;t see it.
          </p>
        </Card>
      )}
      <p style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink2, textAlign: "center", marginTop: 22 }}>
        <span onClick={() => go("login")} style={{ color: T.clay, fontWeight: 600, cursor: "pointer" }}>← Back to sign in</span>
      </p>
    </AuthShell>
  );
}
