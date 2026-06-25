"use client";

import { useEffect, useState } from "react";
import { useApp, useViewport } from "@/components/rh/app";
import { T, Logo } from "@/lib/rh/theme";

export default function AdminLoginPage() {
  const { login, go, user, initialized, showToast } = useApp();
  const { mobile } = useViewport();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized) return;
    if (user?.role === "ADMIN") go("admin");
  }, [initialized, user, go]);

  const submit = async () => {
    setError(null);
    if (!email.includes("@") || !password) { setError("Enter your email and password."); return; }
    setLoading(true);
    try {
      const u = await login(email.trim(), password);
      if (u.role !== "ADMIN") {
        setError("This portal is for administrators only.");
        return;
      }
      showToast(`Signed in as ${u.name}`);
      go("admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0c0e14", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.clay} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontFamily: T.sans, fontSize: 11.5, fontWeight: 700, color: T.clay, letterSpacing: ".1em", textTransform: "uppercase" }}>Admin Portal</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Logo ink="#fff" color={T.clay} size={26} fontSize={22} />
          </div>
          <p style={{ fontFamily: T.sans, fontSize: 13, color: "rgba(255,255,255,.35)", marginTop: 8, letterSpacing: ".02em" }}>Authorized access only</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: mobile ? "28px 22px" : "36px 32px", boxShadow: "0 24px 64px rgba(0,0,0,.5)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: T.ink2, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 7 }}>Email address</label>
              <input
                type="email"
                value={email}
                autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rentalhub.ng"
                style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${T.line}`, fontFamily: T.sans, fontSize: 14.5, color: T.ink, background: T.paper, outline: "none" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: T.ink2, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 7 }}>Password</label>
              <input
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => { if (e.key === "Enter") void submit(); }}
                style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${T.line}`, fontFamily: T.sans, fontSize: 14.5, color: T.ink, background: T.paper, outline: "none" }}
              />
            </div>

            {error && (
              <div style={{ fontFamily: T.sans, fontSize: 13, color: T.red, background: T.redSoft, borderRadius: 10, padding: "10px 14px" }}>
                {error}
              </div>
            )}

            <button
              onClick={() => void submit()}
              disabled={loading}
              style={{ width: "100%", padding: "13px", borderRadius: 10, background: loading ? T.ink3 : T.clay, color: "#fff", fontFamily: T.sans, fontSize: 15, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: 4, transition: "background .15s" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </div>

        <p style={{ fontFamily: T.sans, fontSize: 12, color: "rgba(255,255,255,.2)", textAlign: "center", marginTop: 20 }}>
          This page is for RentalHub administrators only.
        </p>
      </div>
    </div>
  );
}
