import { RouteGuard } from "@/components/rh/route-guard";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard role="STUDENT">{children}</RouteGuard>;
}
