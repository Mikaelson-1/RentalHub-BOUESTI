"use client";

/**
 * app.tsx — client glue for the ported design.
 *
 * The Claude Design prototype used a hash router + a single AppProvider with
 * role/campus/toast. Here we keep campus + toast + a viewport hook, and map the
 * prototype's `go(route, arg, params)` calls onto real Next.js routes so the
 * ported components work almost verbatim.
 */
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

// On the client, useLayoutEffect fires synchronously after DOM mutation but
// BEFORE the browser paints — so the mobile layout is applied before the user
// ever sees the desktop-default layout. On the server useLayoutEffect is a no-op
// (SSR never paints), so we fall back to useEffect to silence the server warning.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { useRouter } from "next/navigation";
import { T, I } from "@/lib/rh/theme";
import { CAMPUSES, type Campus } from "@/lib/rh/data";
import { apiGet, apiPost, googleAuth, AUTH_STORAGE_KEY } from "@/lib/rh/api";

const INACTIVITY_MS = 2 * 60 * 60 * 1000; // 2 hours
const ACTIVITY_KEY = "rh_auth_activity";

function getLastActivity(): number {
  try { return parseInt(window.localStorage.getItem(ACTIVITY_KEY) || "0", 10); } catch { return 0; }
}
function touchActivity(): void {
  try { window.localStorage.setItem(ACTIVITY_KEY, String(Date.now())); } catch { /* ignore */ }
}

export async function setRoleCookie(role: string): Promise<void> {
  try {
    await fetch("/api/auth/set-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
  } catch {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `rh_role=${role.toLowerCase()}; path=/; max-age=86400; SameSite=Lax${secure}`;
  }
}
async function clearRoleCookie(): Promise<void> {
  try {
    await fetch("/api/auth/set-session", { method: "DELETE" });
  } catch {
    document.cookie = "rh_role=; path=/; max-age=0; SameSite=Lax";
  }
}
function isSessionExpired(): boolean {
  const last = getLastActivity();
  return last > 0 && Date.now() - last > INACTIVITY_MS;
}

type Params = Record<string, string> | undefined;

const ROUTE_MAP: Record<string, (arg?: string | null, params?: Params) => string> = {
  home: () => "/",
  search: (_a, params) => "/properties" + (params?.area ? `?area=${encodeURIComponent(params.area)}` : ""),
  property: (arg) => `/properties/${arg ?? ""}`,
  login: () => "/login",
  register: () => "/register",
  forgot: () => "/forgot-password",
  reset: () => "/reset-password",
  verify: (_a, params) => {
    const qs = new URLSearchParams();
    if (params?.role) qs.set("role", params.role);
    if (params?.email) qs.set("email", params.email);
    const s = qs.toString();
    return "/verify-email" + (s ? `?${s}` : "");
  },
  "setup-role": () => "/setup-role",
  student: () => "/student",
  "student-profile": () => "/student/profile",
  receipt: (arg) => `/student/bookings/${arg ?? "bk"}/receipt`,
  pay: (arg) => `/student/bookings/${arg ?? "bk"}/verify-payment`,
  booking: () => "/student",
  landlord: () => "/landlord",
  "landlord-info": () => "/landlord",
  "landlord-profile": () => "/landlord/profile",
  "landlord-verification": () => "/landlord/verification",
  "add-property": () => "/landlord/add-property",
  manage: (arg) => `/landlord/properties/${arg ?? ""}`,
  "edit-property": (arg) => `/landlord/edit-property/${arg ?? ""}`,
  inspector: () => "/inspector",
  "inspector-signup": () => "/inspector-signup",
  "inspector-pending": () => "/inspector-signup/success",
  "admin-login": () => "/admin-login",
  admin: () => "/admin",
  review: (arg) => `/admin/properties/${arg ?? ""}`,
  pending: () => "/pending-approval",
  unauthorized: () => "/unauthorized",
  privacy: () => "/privacy",
  terms: () => "/terms",
  "how-it-works": () => "/#how-it-works",
  safety: () => "/safety",
  about: () => "/about",
  help: () => "/help",
};

export type GoFn = (route: string, arg?: string | null, params?: Params) => void;

export interface AuthUser { id: string; name: string; email: string; role: string; verificationStatus?: string; avatarUrl?: string | null; campus?: string | null }

interface AppValue {
  go: GoFn;
  role: string;
  user: AuthUser | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  loginWithGoogle: (accessToken: string) => Promise<{ user: AuthUser; isNewUser: boolean }>;
  updateUser: (patch: Partial<AuthUser>, newToken?: string) => void;
  signOut: () => void;
  campus: Campus;
  setCampus: (id: string) => void;
  showToast: (msg: string) => void;
}

const AppCtx = createContext<AppValue | null>(null);

export function useApp(): AppValue {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}

export function useViewport() {
  const [w, setW] = useState(1200); // SSR-safe default (desktop)
  useIsoLayoutEffect(() => {
    const on = () => setW(window.innerWidth);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return { w, mobile: w < 768, tablet: w >= 768 && w < 1080 };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [campusId, setCampusId] = useState("bouesti");
  const [toast, setToast] = useState<string | null>(null);
  const [auth, setAuth] = useState<{ token: string; user: AuthUser } | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedCampus = window.localStorage.getItem("rh_campus");
    if (savedCampus) setCampusId(savedCampus);
    try {
      const a = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || "null");
      if (a?.token && a?.user) {
        if (isSessionExpired()) {
          window.localStorage.removeItem(AUTH_STORAGE_KEY);
          window.localStorage.removeItem(ACTIVITY_KEY);
        } else {
          setAuth(a);
          touchActivity();
          void setRoleCookie(a.user.role);
        }
      }
    } catch { /* ignore */ }
    setInitialized(true);
  }, []);

  // Background refresh: pull latest verificationStatus + campus from the server
  // on every app mount so that admin approvals are reflected without re-login.
  useEffect(() => {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return;
    let cancelled = false;
    apiGet<{ verificationStatus?: string; campus?: string | null }>("/api/auth/me")
      .then((fresh) => {
        if (!cancelled) {
          setAuth((prev) => {
            if (!prev) return prev;
            const patch: Partial<AuthUser> = {};
            if (fresh.verificationStatus) patch.verificationStatus = fresh.verificationStatus;
            if (fresh.campus !== undefined) patch.campus = fresh.campus;
            if (!Object.keys(patch).length) return prev;
            const updated = { ...prev, user: { ...prev.user, ...patch } };
            window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const campus = CAMPUSES.find((c) => c.id === campusId) || CAMPUSES[0];

  const go = useCallback<GoFn>((route, arg, params) => {
    const fn = ROUTE_MAP[route];
    router.push(fn ? fn(arg, params) : "/" + route);
  }, [router]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiPost<{ token: string; user: AuthUser }>("/api/auth/login", { email, password });
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    touchActivity();
    await setRoleCookie(data.user.role);
    setAuth(data);
    return data.user;
  }, []);

  const loginWithGoogle = useCallback(async (accessToken: string) => {
    const data = await googleAuth(accessToken);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: data.token, user: data.user }));
    touchActivity();
    await setRoleCookie(data.user.role);
    setAuth({ token: data.token, user: data.user });
    return { user: data.user, isNewUser: data.isNewUser };
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>, newToken?: string) => {
    setAuth((prev) => {
      if (!prev) return prev;
      const updated = { token: newToken ?? prev.token, user: { ...prev.user, ...patch } };
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(ACTIVITY_KEY);
    void clearRoleCookie();
    setAuth(null);
    router.push("/");
  }, [router]);

  // Keep a stable ref so the interval/visibility handler always calls the latest signOut
  const signOutRef = useRef(signOut);
  useEffect(() => { signOutRef.current = signOut; }, [signOut]);

  useEffect(() => {
    if (!auth) return;

    let lastWrite = Date.now();
    const onActivity = () => {
      const now = Date.now();
      if (now - lastWrite > 30_000) { lastWrite = now; touchActivity(); }
    };

    const checkExpiry = () => { if (isSessionExpired()) signOutRef.current(); };

    const onVisible = () => { if (document.visibilityState === "visible") checkExpiry(); };

    const interval = setInterval(checkExpiry, 60_000);
    const events = ["mousemove", "keydown", "pointerdown", "touchstart", "scroll"] as const;
    events.forEach((e) => document.addEventListener(e, onActivity, { passive: true }));
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      events.forEach((e) => document.removeEventListener(e, onActivity));
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [auth]);

  const setCampus = useCallback((id: string) => {
    setCampusId(id);
    window.localStorage.setItem("rh_campus", id);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <AppCtx.Provider value={{ go, role: auth?.user.role?.toLowerCase() ?? "guest", user: auth?.user ?? null, initialized, login, loginWithGoogle, updateUser, signOut, campus, setCampus, showToast }}>
      {children}
      {toast && (
        <div style={{ position: "fixed", bottom: "calc(26px + env(safe-area-inset-bottom, 0px))", left: "50%", transform: "translateX(-50%)", zIndex: 200, background: T.ink, color: T.paper, padding: "13px 22px", borderRadius: 12, fontFamily: T.sans, fontSize: 14.5, fontWeight: 500, boxShadow: "0 16px 40px -12px rgba(0,0,0,.5)", display: "flex", alignItems: "center", gap: 9, maxWidth: "min(90vw, 480px)", width: "max-content" }}>
          {I.checkCircle({ width: 18, height: 18, style: { color: "#7FD6A6", flex: "0 0 auto" } })}
          {toast}
        </div>
      )}
    </AppCtx.Provider>
  );
}
