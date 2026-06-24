import { RouteGuard } from "@/components/rh/route-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard role="ADMIN">{children}</RouteGuard>;
}
