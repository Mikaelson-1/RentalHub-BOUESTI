"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { T, I, Logo } from "@/lib/rh/theme";
import { AUTH_STORAGE_KEY } from "@/lib/rh/api";

type Status = "loading" | "pending" | "verified" | "suspended" | "none";

export default function InspectorSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [name, setName] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      const session = raw ? JSON.parse(raw) : null;
      if (!session?.user || session.user.role !== "INSPECTOR") {
        setStatus("none");
        return;
      }
      setName(session.user.name?.split(" ")[0] ?? "there");
      const vs: string = session.user.verificationStatus ?? "UNDER_REVIEW";
      if (vs === "VERIFIED") setStatus("verified");
      else if (vs === "SUSPENDED") setStatus("suspended");
      else setStatus("pending");
    } catch {
      setStatus("none");
    }
  }, []);

  if (status === "loading") {
    return <div style={{ minHeight: "100vh", background: T.paper, display: "flex", alignItems: "center", justifyContent: "center" }} />;
  }

  if (status === "none") {
    return (
      <div style={{ minHeight: "100vh", background: T.paper, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: T.sans, color: T.ink2, marginBottom: 16 }}>No active inspector session found.</p>
          <span onClick={() => router.push("/inspector-signup")} style={{ fontFamily: T.sans, fontWeight: 600, color: T.clay, cursor: "pointer" }}>
            Apply to become an inspector →
          </span>
        </div>
      </div>
    );
  }

  if (status === "verified") {
    router.replace("/inspector-dashboard");
    return null;
  }

  const suspended = status === "suspended";

  return (
    <div style={{ minHeight: "100vh", background: T.paper, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={() => router.push("/")} style={{ cursor: "pointer", marginBottom: 36 }}>
        <Logo />
      </div>

      <div style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 22, padding: "44px 36px", boxShadow: "0 4px 32px rgba(33,29,24,.08)", textAlign: "center" }}>
        {suspended ? (
          <>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: T.redSoft, color: T.red, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              {I.x({ width: 28, height: 28 })}
            </div>
            <h1 style={{ fontFamily: T.serif, fontWeight: 400, fontSize: 28, color: T.ink, margin: "0 0 12px" }}>Account suspended</h1>
            <p style={{ fontFamily: T.sans, fontSize: 14.5, color: T.ink2, lineHeight: 1.6, marginBottom: 28 }}>
              Your inspector account has been suspended. Contact support if you believe this is a mistake.
            </p>
            <span
              onClick={() => window.location.href = "mailto:support@rentalhub.ng"}
              style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 600, color: T.clay, cursor: "pointer" }}
            >
              Contact support →
            </span>
          </>
        ) : (
          <>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: T.claySoft, color: T.clay, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              {I.clock({ width: 28, height: 28 })}
            </div>
            <h1 style={{ fontFamily: T.serif, fontWeight: 400, fontSize: 28, color: T.ink, margin: "0 0 12px" }}>
              Application received, {name}!
            </h1>
            <p style={{ fontFamily: T.sans, fontSize: 14.5, color: T.ink2, lineHeight: 1.6, marginBottom: 8 }}>
              Your profile is undergoing admin verification. We typically review applications within <strong>24–48 hours</strong>.
            </p>
            <p style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink3, lineHeight: 1.6, marginBottom: 28 }}>
              You'll receive an email once your account is approved. Check your inbox at the address you registered with.
            </p>

            <div style={{ background: T.paper, borderRadius: 14, padding: "16px 20px", textAlign: "left", marginBottom: 28 }}>
              {[
                ["Documents submitted", true],
                ["Email verification", true],
                ["Admin review", false],
                ["Account activated", false],
              ].map(([label, done]) => (
                <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${T.line}` }} >
                  <div style={{ width: 22, height: 22, borderRadius: 999, background: done ? T.green : T.line, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
                    {done ? I.shield({ width: 12, height: 12 }) : null}
                  </div>
                  <span style={{ fontFamily: T.sans, fontSize: 13.5, color: done ? T.ink : T.ink3, fontWeight: done ? 600 : 400 }}>{label as string}</span>
                </div>
              ))}
            </div>

            <span onClick={() => router.push("/")} style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 600, color: T.clay, cursor: "pointer" }}>
              Back to homepage →
            </span>
          </>
        )}
      </div>
    </div>
  );
}
