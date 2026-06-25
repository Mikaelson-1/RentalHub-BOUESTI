import { RouteGuard } from "@/components/rh/route-guard";

export default function InspectorLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard role="INSPECTOR">{children}</RouteGuard>;
}
