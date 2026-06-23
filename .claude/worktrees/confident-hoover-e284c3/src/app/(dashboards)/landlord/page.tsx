"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { ShieldAlert, ShieldX, Clock, TrendingUp } from "lucide-react";
import { Alert, Button, EmptyState, SectionHeader, StatBox, Table, Tabs } from "@/components";

interface Listing {
  id: string;
  title: string;
  price: number | string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  location: {
    name: string;
  };
  _count?: {
    bookings: number;
  };
}

interface BookingRequest {
  id: string;
  status: "PENDING" | "CONFIRMED" | "AWAITING_PAYMENT" | "PAID" | "CANCELLED" | "EXPIRED";
  bidAmount: number | null;
  createdAt: string;
  student: {
    name: string;
  };
  property: {
    id: string;
    title: string;
    price: number | string;
  };
}

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  totalPaidBookings: number;
  bookings: {
    id: string;
    propertyTitle: string;
    studentName: string;
    amount: number;
    paidAt: string | null;
    paystackRef: string | null;
    moveInDate: string | null;
    leaseEndDate: string | null;
  }[];
}

interface ListingsResponse {
  success: boolean;
  data?: {
    items: Listing[];
  };
  error?: string;
}

interface BookingsResponse {
  success: boolean;
  data?: BookingRequest[];
  error?: string;
}

function VerificationBanner({ status }: { status?: string }) {
  if (!status || status === "VERIFIED") return null;

  const config: Record<string, { icon: React.ReactNode; bg: string; text: string; cta: string | null; message: string }> = {
    UNVERIFIED: {
      icon: <ShieldAlert className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
      cta: "Complete Verification",
      message: "Your account is not yet verified. Complete verification so students can trust your listings.",
    },
    UNDER_REVIEW: {
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
      cta: null,
      message: "Your documents are under review. We'll notify you by email within 24–48 hours.",
    },
    REJECTED: {
      icon: <ShieldX className="w-5 h-5 text-red-600" />,
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      cta: "Resubmit Documents",
      message: "Your verification was rejected. Please review the feedback and resubmit.",
    },
    SUSPENDED: {
      icon: <ShieldX className="w-5 h-5 text-red-600" />,
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      cta: null,
      message: "Your account has been suspended by an administrator. Contact support for more information.",
    },
  };

  const c = config[status];
  if (!c) return null;

  return (
    <div className={`flex items-start justify-between gap-4 border rounded-xl px-5 py-4 mb-6 ${c.bg}`}>
      <div className="flex items-start gap-3">
        {c.icon}
        <p className={`text-sm font-medium ${c.text}`}>{c.message}</p>
      </div>
      {c.cta && (
        <Link
          href="/landlord/verification"
          className="flex-shrink-0 text-xs font-semibold bg-white border border-current px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {c.cta}
        </Link>
      )}
    </div>
  );
}

export default function LandlordDashboard() {
  const { data: session } = useSession();
  const verificationStatus = (session?.user as { verificationStatus?: string })?.verificationStatus;
  const [activeTab, setActiveTab] = useState<"listings" | "requests" | "earnings">("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingRequestId, setUpdatingRequestId] = useState("");

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [listingsResponse, requestsResponse] = await Promise.all([
        fetch("/api/properties?mine=true&pageSize=50", { cache: "no-store" }),
        fetch("/api/bookings", { cache: "no-store" }),
      ]);

      const listingsPayload = (await listingsResponse.json()) as ListingsResponse;
      const requestsPayload = (await requestsResponse.json()) as BookingsResponse;

      if (!listingsResponse.ok || !listingsPayload.success) {
        throw new Error(listingsPayload.error || "Failed to load your listings.");
      }

      if (!requestsResponse.ok || !requestsPayload.success) {
        throw new Error(requestsPayload.error || "Failed to load tenant requests.");
      }

      setListings(listingsPayload.data?.items ?? []);
      setRequests(requestsPayload.data ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load landlord dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadEarnings = useCallback(async () => {
    if (earnings) return; // already loaded
    setEarningsLoading(true);
    try {
      const res = await fetch("/api/landlord/earnings", { cache: "no-store" });
      const json = await res.json();
      if (res.ok && json.success) setEarnings(json.data);
    } catch { /* silent */ }
    finally { setEarningsLoading(false); }
  }, [earnings]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    if (activeTab === "earnings") loadEarnings();
  }, [activeTab, loadEarnings]);

  const totalViews = useMemo(
    () => listings.reduce((acc, listing) => acc + (listing._count?.bookings ?? 0), 0),
    [listings],
  );

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === "PENDING" || r.status === "AWAITING_PAYMENT").length,
    [requests],
  );

  const formatPrice = (price: number | string) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(price));

  const updateRequestStatus = async (bookingId: string, status: "CONFIRMED" | "CANCELLED") => {
    setUpdatingRequestId(bookingId);
    setError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to update booking request.");
      }
      await loadDashboardData();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update booking request.");
    } finally {
      setUpdatingRequestId("");
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      AWAITING_PAYMENT: "bg-orange-100 text-orange-800",
      PAID: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      EXPIRED: "bg-gray-100 text-gray-600",
    };
    return map[status] ?? "bg-gray-100 text-gray-600";
  };

  const bidAmountValue = (request: BookingRequest) => Number(request.bidAmount ?? request.property.price);

  const highestBidByProperty = useMemo(() => {
    const pendingGroups = requests.filter((request) => request.status === "PENDING").reduce<Record<string, BookingRequest[]>>((acc, request) => {
      acc[request.property.id] = acc[request.property.id] ? [...acc[request.property.id], request] : [request];
      return acc;
    }, {});

    return Object.fromEntries(
      Object.entries(pendingGroups).map(([propertyId, entries]) => [
        propertyId,
        {
          total: entries.length,
          maxBid: Math.max(...entries.map((entry) => bidAmountValue(entry))),
        },
      ]),
    );
  }, [requests]);

  const canAcceptRequest = (request: BookingRequest) => {
    const metrics = highestBidByProperty[request.property.id];
    if (!metrics || metrics.total < 2) return true;
    return bidAmountValue(request) >= metrics.maxBid;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">Landlord Dashboard</h1>
          <p className="text-gray-600 mt-1 text-sm">Manage your listings and tenant requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/landlord/profile"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            My Profile
          </Link>
          <Link
            href="/landlord/add-property"
            className="bg-[#E67E22] hover:bg-[#D35400] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            Add Property
          </Link>
        </div>
      </div>

      <VerificationBanner status={verificationStatus} />

      {error && <Alert type="error" title="Error" message={error} onClose={() => setError("")} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatBox value={listings.length} label="Total Listings" color="green" />
        <StatBox value={listings.filter((l) => l.status === "APPROVED").length} label="Approved" color="green" />
        <StatBox value={pendingRequests} label="Pending Requests" color="green" />
        <StatBox value={totalViews} label="Total Booking Requests" color="green" />
      </div>

      <Tabs
        tabs={[
          {
            id: "listings",
            label: "My Listings",
            content: (
              isLoading ? (
                <EmptyState title="Loading dashboard..." description="" />
              ) : listings.length === 0 ? (
                <EmptyState
                  title="No listings yet"
                  description="Add your first property to get started"
                  action={{
                    label: "Add Property",
                    onClick: () => (window.location.href = "/landlord/add-property"),
                  }}
                />
              ) : (
                <Table
                  columns={[
                    { header: "Property", key: "title" },
                    { header: "Location", key: "location", render: (val) => val.name },
                    { header: "Price", key: "price", render: (val) => formatPrice(val) },
                    {
                      header: "Status",
                      key: "status",
                      render: (val) => (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          val === "APPROVED" ? "bg-green-100 text-green-800" :
                          val === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {val}
                        </span>
                      ),
                    },
                    { header: "Requests", key: "bookings", render: (val) => val ?? 0, width: "80px" },
                    {
                      header: "Actions",
                      key: "id",
                      render: (val, row) => (
                        <div className="flex gap-3">
                          <Link href={`/landlord/properties/${val}`} className="text-sm text-[#192F59] hover:text-[#E67E22] font-medium">
                            View
                          </Link>
                          <Link href={`/landlord/edit-property/${val}`} className="text-sm text-gray-500 hover:text-[#E67E22] font-medium">
                            Edit
                          </Link>
                        </div>
                      ),
                    },
                  ]}
                  data={listings.map((l) => ({
                    ...l,
                    location: { name: l.location.name },
                    bookings: l._count?.bookings,
                  }))}
                  emptyMessage="No listings found"
                />
              )
            ),
          },
          {
            id: "requests",
            label: "Tenant Requests",
            badge: pendingRequests > 0 ? pendingRequests : undefined,
            content: (
              requests.length === 0 ? (
                <EmptyState title="No tenant requests yet" description="Requests from students will appear here" />
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-navy truncate">{request.student.name}</h3>
                        <p className="text-gray-600 text-sm truncate">Property: {request.property.title}</p>
                        <p className="text-gray-700 text-sm mt-1">
                          Bid: <span className="font-semibold text-[#00A553]">{formatPrice(bidAmountValue(request))}</span>
                          <span className="text-gray-400 text-xs ml-2">(listed: {formatPrice(request.property.price)})</span>
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Submitted {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        {request.status === "AWAITING_PAYMENT" && (
                          <p className="text-xs text-orange-600 mt-1 font-medium">⏳ Student has 48 hours to complete payment</p>
                        )}
                        {request.status === "PENDING" && (highestBidByProperty[request.property.id]?.total ?? 0) >= 2 && (
                          <p className="text-xs text-orange-700 mt-1">Multiple bids — only highest bid can be accepted.</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 flex gap-2">
                        {request.status === "PENDING" ? (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => updateRequestStatus(request.id, "CONFIRMED")}
                              disabled={updatingRequestId === request.id || !canAcceptRequest(request)}
                              title={!canAcceptRequest(request) ? "Only highest bid can be accepted when there are multiple requests." : undefined}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => updateRequestStatus(request.id, "CANCELLED")}
                              disabled={updatingRequestId === request.id}
                            >
                              Decline
                            </Button>
                          </>
                        ) : request.status === "AWAITING_PAYMENT" ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => updateRequestStatus(request.id, "CANCELLED")}
                            disabled={updatingRequestId === request.id}
                            loading={updatingRequestId === request.id}
                          >
                            {updatingRequestId === request.id ? "Cancelling…" : "Cancel Booking"}
                          </Button>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge(request.status)}`}>
                            {request.status.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ),
          },
          {
            id: "earnings",
            label: "Earnings",
            content: (
              earningsLoading ? (
                <EmptyState title="Loading earnings..." description="" />
              ) : !earnings ? (
                <EmptyState title="No earnings data available" description="Your earnings will appear here" />
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatBox value={formatPrice(earnings.totalEarnings)} label="Total Earnings (All time)" color="green" />
                    <StatBox value={formatPrice(earnings.monthlyEarnings)} label="This Month" color="blue" />
                    <StatBox value={earnings.totalPaidBookings} label="Paid Bookings" color="blue" />
                  </div>
                  {earnings.bookings.length === 0 ? (
                    <EmptyState title="No paid bookings yet" description="Completed payments will appear here" />
                  ) : (
                    <Table
                      columns={[
                        { header: "Property", key: "propertyTitle" },
                        { header: "Student", key: "studentName" },
                        { header: "Amount", key: "amount", render: (val) => formatPrice(val) },
                        { header: "Paid On", key: "paidAt", render: (val) => val ? new Date(val).toLocaleDateString() : "—" },
                        { header: "Move-in", key: "moveInDate", render: (val) => val ? new Date(val).toLocaleDateString() : "—" },
                        { header: "Ref", key: "paystackRef", render: (val) => val ? <span className="text-xs font-mono text-gray-400">{val}</span> : "—" },
                      ]}
                      data={earnings.bookings}
                      emptyMessage="No paid bookings found"
                    />
                  )}
                </div>
              )
            ),
          },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab as "listings" | "requests" | "earnings");
          if (tab === "earnings") loadEarnings();
        }}
      />
    </div>
  );
}
