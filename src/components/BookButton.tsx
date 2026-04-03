"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface BookButtonProps {
  propertyId: string;
  hasBooking: boolean;
  userRole: string | null;
}

export default function BookButton({ propertyId, hasBooking, userRole }: BookButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(hasBooking);
  const [error, setError] = useState("");

  // Landlords and admins don't see this button
  if (userRole === "LANDLORD" || userRole === "ADMIN") return null;

  const handleBook = async () => {
    if (!userRole) {
      router.push(`/login?callbackUrl=/properties/${propertyId}`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Booking failed");
      setBooked(true);
      router.push("/student?tab=bookings");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed. Please try again.");
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
        <p className="text-green-700 font-semibold text-sm">✓ You have booked this property</p>
        <a href="/student?tab=bookings" className="text-sm text-[#E67E22] hover:underline mt-1 inline-block font-medium">
          View your bookings →
        </a>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleBook}
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-gray-900 font-bold py-4 px-8 rounded-xl text-base transition-colors shadow-sm"
      >
        {loading ? "Processing..." : userRole ? "Confirm Booking" : "Book Now"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
    </div>
  );
}
