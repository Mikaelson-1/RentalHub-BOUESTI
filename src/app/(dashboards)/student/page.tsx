"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Wifi, Zap, Shield, Droplets, Car, Sun, CheckCircle, Lock } from "lucide-react";
import { getPropertyImage } from "@/lib/property-image";

interface PropertyDetail {
  id: string;
  title: string;
  description: string;
  price: number | string;
  distanceToCampus: number | null;
  amenities: string[];
  location: { name: string };
  landlord: { name: string };
}

interface BookingItem {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  property: PropertyDetail;
}

interface BrowseProperty {
  id: string;
  title: string;
  price: number | string;
  location: { name: string };
}

function AmenityIcon({ name }: { name: string }) {
  const l = name.toLowerCase();
  if (l.includes("wifi") || l.includes("internet")) return <Wifi className="w-3 h-3" />;
  if (l.includes("solar")) return <Sun className="w-3 h-3" />;
  if (l.includes("generator") || l.includes("prepaid")) return <Zap className="w-3 h-3" />;
  if (l.includes("security") || l.includes("burglar")) return <Shield className="w-3 h-3" />;
  if (l.includes("water") || l.includes("borehole")) return <Droplets className="w-3 h-3" />;
  if (l.includes("parking") || l.includes("car")) return <Car className="w-3 h-3" />;
  return <CheckCircle className="w-3 h-3" />;
}

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "bookings" ? "bookings" : "browse";

  const [activeTab, setActiveTab] = useState<"browse" | "bookings">(defaultTab);
  const [properties, setProperties] = useState<BrowseProperty[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingPropertyId, setBookingPropertyId] = useState("");
  const [updatingBookingId, setUpdatingBookingId] = useState("");
  const [error, setError] = useState("");

  const loadStudentData = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [propertiesResponse, bookingsResponse] = await Promise.all([
        fetch("/api/properties?pageSize=24", { cache: "no-store" }),
        fetch("/api/bookings", { cache: "no-store" }),
      ]);

      const propertiesPayload = await propertiesResponse.json();
      const bookingsPayload = await bookingsResponse.json();

      if (!propertiesResponse.ok || !propertiesPayload.success) {
        throw new Error(propertiesPayload.error || "Failed to load properties.");
      }
      if (!bookingsResponse.ok || !bookingsPayload.success) {
        throw new Error(bookingsPayload.error || "Failed to load bookings.");
      }

      setProperties(propertiesPayload.data?.items ?? []);
      // Bookings API returns data as a plain array
      setBookings(Array.isArray(bookingsPayload.data) ? bookingsPayload.data : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);

  const bookProperty = async (propertyId: string) => {
    setBookingPropertyId(propertyId);
    setError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.error || "Failed to create booking.");
      await loadStudentData();
      setActiveTab("bookings");
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : "Failed to create booking.");
    } finally {
      setBookingPropertyId("");
    }
  };

  const cancelBooking = async (bookingId: string) => {
    setUpdatingBookingId(bookingId);
    setError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: "CANCELLED" }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.error || "Failed to cancel booking.");
      await loadStudentData();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "Failed to cancel booking.");
    } finally {
      setUpdatingBookingId("");
    }
  };

  const hasActiveBooking = (propertyId: string) =>
    bookings.some((b) => b.property.id === propertyId && (b.status === "PENDING" || b.status === "CONFIRMED"));

  const formatPrice = (price: number | string) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(Number(price));

  const confirmedBookings = useMemo(() => bookings.filter((b) => b.status === "CONFIRMED").length, [bookings]);
  const pendingBookings = useMemo(() => bookings.filter((b) => b.status === "PENDING").length, [bookings]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">Student Dashboard</h1>
        <p className="text-gray-600 mt-1">Browse properties and manage your bookings</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-primary-green">{bookings.length}</div>
          <div className="text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-primary-green">{confirmedBookings}</div>
          <div className="text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-yellow-500">{pendingBookings}</div>
          <div className="text-gray-600">Pending</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "browse" ? "border-primary-green text-primary-green" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Browse Properties
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "bookings" ? "border-primary-green text-primary-green" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              My Bookings {bookings.length > 0 && <span className="ml-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{bookings.length}</span>}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading dashboard...</div>
          ) : activeTab === "browse" ? (
            properties.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No properties available yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => {
                  const booked = hasActiveBooking(property.id);
                  return (
                    <div key={property.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-40 bg-gray-100">
                        <Image src={getPropertyImage(property.id)} alt={property.title} fill className="object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-navy">{property.title}</h3>
                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {property.location.name}
                        </p>
                        <p className="text-primary-green font-bold mt-2">{formatPrice(property.price)}<span className="text-xs text-gray-400 font-normal">/yr</span></p>
                        <div className="flex gap-2 mt-3">
                          <Link href={`/properties/${property.id}`} className="flex-1 text-center text-sm border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            View
                          </Link>
                          <button
                            onClick={() => bookProperty(property.id)}
                            disabled={booked || bookingPropertyId === property.id}
                            className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-gray-900 font-semibold py-2 rounded-lg transition-colors text-sm"
                          >
                            {bookingPropertyId === property.id ? "..." : booked ? "Booked ✓" : "Book"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No bookings yet</p>
              <button onClick={() => setActiveTab("browse")} className="text-primary-green hover:underline mt-2 inline-block text-sm">
                Browse properties →
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                  {/* Property image */}
                  <div className="relative h-52 bg-gray-100">
                    <Image
                      src={getPropertyImage(booking.property.id)}
                      alt={booking.property.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "CONFIRMED" ? "bg-green-500 text-white" :
                        booking.status === "PENDING" ? "bg-amber-400 text-gray-900" :
                        "bg-gray-400 text-white"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Location + title */}
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" /> {booking.property.location.name}
                    </p>
                    <h3 className="text-xl font-bold text-[#192F59]">{booking.property.title}</h3>

                    {/* Price + distance */}
                    <div className="flex items-baseline gap-3 mt-2">
                      <p className="text-2xl font-bold text-[#00A553]">
                        {formatPrice(booking.property.price)}
                        <span className="text-sm font-normal text-gray-400 ml-1">/year</span>
                      </p>
                      {booking.property.distanceToCampus && (
                        <span className="text-xs text-gray-400">{Number(booking.property.distanceToCampus)} km to campus</span>
                      )}
                    </div>

                    {/* Description */}
                    {booking.property.description && (
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                        {booking.property.description}
                      </p>
                    )}

                    {/* Amenities */}
                    {booking.property.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {booking.property.amenities.map((a) => (
                          <span key={a} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                            <AmenityIcon name={a} /> {a}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Landlord + booked date */}
                    <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                      <span>Listed by <span className="font-medium text-gray-600">{booking.property.landlord.name}</span></span>
                      <span>Booked {new Date(booking.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>

                    {/* Actions */}
                    {booking.status !== "CANCELLED" && (
                      <div className="mt-5 flex flex-col sm:flex-row gap-3">
                        <button
                          className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3.5 rounded-xl transition-colors text-sm"
                          onClick={() => alert("Payment integration coming soon. Your booking is reserved — the landlord has been notified.")}
                        >
                          <Lock className="w-4 h-4" />
                          Pay now to secure
                        </button>
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          disabled={updatingBookingId === booking.id}
                          className="sm:w-auto text-sm text-red-500 hover:text-red-600 disabled:opacity-50 border border-red-200 px-5 py-3.5 rounded-xl hover:bg-red-50 transition-colors"
                        >
                          {updatingBookingId === booking.id ? "Cancelling..." : "Cancel Booking"}
                        </button>
                      </div>
                    )}
                    {booking.status === "CANCELLED" && (
                      <p className="mt-4 text-sm text-gray-400 text-center">This booking was cancelled.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
