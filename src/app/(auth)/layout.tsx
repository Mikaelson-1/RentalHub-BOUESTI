import AuthProvider from "./AuthProvider";

// Auth pages render their own chrome in the redesign.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
