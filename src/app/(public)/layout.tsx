import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavbar />
      <main className="flex-grow overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}
