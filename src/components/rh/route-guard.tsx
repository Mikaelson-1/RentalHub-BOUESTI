"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { T, I } from "@/lib/rh/theme";
import { useApp } from "@/components/rh/app";

type GuardRole = "STUDENT" | "LANDLORD" | "ADMIN" | "INSPECTOR";

function isAllowedForRole(userRole: string, guard: GuardRole): boolean {
  if (guard === "ADMIN") return ["ADMIN", "MODERATOR", "AUDITOR"].includes(userRole);
  return userRole === guard;
}

export function RouteGuard({ role, children }: { role: GuardRole; children: React.ReactNode }) {
  const { user, initialized } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.replace(role === "ADMIN" ? "/admin-login" : "/login"); return; }
    if (!isAllowedForRole(user.role, role)) { router.replace("/unauthorized"); }
  }, [initialized, user, role, router]);

  if (!initialized) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T.paper }}>
        {I.clock({ width: 28, height: 28, style: { color: T.ink3 } })}
      </div>
    );
  }

  if (!user || !isAllowedForRole(user.role, role)) return null;

  return <>{children}</>;
}
