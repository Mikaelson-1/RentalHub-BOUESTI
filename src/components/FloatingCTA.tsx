"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white border-t border-gray-200 shadow-xl px-4 py-3 flex gap-3">
        <Link
          href="/properties"
          className="flex-1 flex items-center justify-center gap-2 bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          <Search className="w-4 h-4" />
          Browse Properties
        </Link>
        <Link
          href="/register"
          className="flex-1 flex items-center justify-center gap-2 border-2 border-[#192F59] text-[#192F59] font-semibold py-3 rounded-xl transition-colors text-sm hover:bg-[#192F59] hover:text-white"
        >
          Sign Up Free
        </Link>
      </div>
    </div>
  );
}
