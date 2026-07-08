import AuthProvider from "@/app/(auth)/AuthProvider";

// Root page uses Google OAuth; wrap with the same provider the auth routes use.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
