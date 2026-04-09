"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type ActiveBookingStatus = "PENDING" | "CONFIRMED" | "AWAITING_PAYMENT" | "PAID";

interface BookButtonProps {
  propertyId: string;
  propertyPrice?: number;
  existingBookingStatus?: ActiveBookingStatus | null;
  userRole: string | null;
}

export default function BookButton({ propertyId, propertyPrice, existingBookingStatus, userRole }: BookButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState<ActiveBookingStatus | null>(existingBookingStatus ?? null);
  const [bidAmount, setBidAmount] = useState(propertyPrice ? String(Number(propertyPrice)) : "");
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
      const normalizedBidAmount =
        bidAmount === "" ? Number(propertyPrice ?? 0) : Number(bidAmount);
      if (!Number.isFinite(normalizedBidAmount) || normalizedBidAmount <= 0) {
        throw new Error("Enter a valid bid amount.");
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, bidAmount: normalizedBidAmount }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Booking failed");
      setBooked("PENDING");
      router.push("/student?tab=bookings");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed. Please try again.");
      setLoading(false);
    }
  };

  if (booked === "PAID") {
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
        <p className="text-green-700 font-semibold text-sm">✓ You are a tenant in this property</p>
        <Link href="/student?tab=bookings" className="text-sm text-[#E67E22] hover:underline mt-1 inline-block font-medium">
          View apartment details →
        </Link>
      </div>
    );
  }

  if (booked === "AWAITING_PAYMENT") {
    return (
      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl text-center">
        <p className="text-orange-700 font-semibold text-sm">⏳ Payment required to secure this booking</p>
        <Link href="/student?tab=bookings" className="text-sm text-[#E67E22] hover:underline mt-1 inline-block font-medium">
          Complete payment →
        </Link>
      </div>
    );
  }

  if (booked === "CONFIRMED") {
    return (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
        <p className="text-blue-700 font-semibold text-sm">✓ Booking confirmed by landlord</p>
        <Link href="/student?tab=bookings" className="text-sm text-[#E67E22] hover:underline mt-1 inline-block font-medium">
          View your bookings →
        </Link>
      </div>
    );
  }

  if (booked === "PENDING") {
    return (
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-700 font-semibold text-sm">⏳ Booking request sent — awaiting landlord confirmation</p>
        <Link href="/student?tab=bookings" className="text-sm text-[#E67E22] hover:underline mt-1 inline-block font-medium">
          View your bookings →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <label className="text-sm text-gray-600 block mb-2">Your bid (naira)</label>
      <input
        type="number"
        min="1"
        value={bidAmount}
        onChange={(event) => setBidAmount(event.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/20 focus:border-[#E67E22]"
      />
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
