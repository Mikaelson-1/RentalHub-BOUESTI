import PublicNavbar from "@/components/PublicNavbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavbar />
      <main className="flex-grow bg-gray-50 overflow-x-hidden">{children}</main>
    </>
  );
}
