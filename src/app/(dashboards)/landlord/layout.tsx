import { RouteGuard } from "@/components/rh/route-guard";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard role="LANDLORD">{children}</RouteGuard>;
}
