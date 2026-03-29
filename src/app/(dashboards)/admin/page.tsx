"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

interface AdminSummary {
  totalProperties: number;
  pendingApprovals: number;
  totalUsers: number;
  totalBookings: number;
}

interface PendingProperty {
  id: string;
  title: string;
  price: number | string;
  createdAt: string;
  images: unknown;
  landlord: {
    name: string;
    email: string;
  };
  location: {
    name: string;
  };
}

interface AdminSummaryResponse {
  success: boolean;
  data?: AdminSummary;
  error?: string;
}

interface PendingPropertiesResponse {
  success: boolean;
  data?: {
    items: PendingProperty[];
    total: number;
  };
  error?: string;
}

const initialSummary: AdminSummary = {
  totalProperties: 0,
  pendingApprovals: 0,
  totalUsers: 0,
  totalBookings: 0,
};

export default function AdminDashboard() {
  const [summary, setSummary] = useState<AdminSummary>(initialSummary);
  const [pending, setPending] = useState<PendingProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadAdminData = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [summaryResponse, pendingResponse] = await Promise.all([
        fetch("/api/admin/summary", { cache: "no-store" }),
        fetch("/api/properties?status=PENDING&pageSize=50", { cache: "no-store" }),
      ]);

      const summaryPayload = (await summaryResponse.json()) as AdminSummaryResponse;
      const pendingPayload = (await pendingResponse.json()) as PendingPropertiesResponse;

      if (!summaryResponse.ok || !summaryPayload.success || !summaryPayload.data) {
        throw new Error(summaryPayload.error || "Could not load admin summary.");
      }

      if (!pendingResponse.ok || !pendingPayload.success) {
        throw new Error(pendingPayload.error || "Could not load pending properties.");
      }

      setSummary(summaryPayload.data);
      setPending(pendingPayload.data?.items ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load admin data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const formatPrice = (price: number | string) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(price));

  const getImageCount = (images: unknown) => {
    if (!Array.isArray(images)) {
      return 0;
    }
    return images.length;
  };

  const pendingCount = useMemo(() => pending.length, [pending.length]);

  const updatePropertyStatus = async (propertyId: string, status: "APPROVED" | "REJECTED") => {
    setUpdatingId(propertyId);
    setError("");

    try {
      const response = await fetch(`/api/properties/${propertyId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || `Failed to ${status.toLowerCase()} listing.`);
      }

      setPending((prev) => prev.filter((property) => property.id !== propertyId));
      setSummary((prev) => ({
        ...prev,
        pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
      }));
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Failed to update status.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage properties, users, and platform settings
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-primary-green">
            {summary.totalProperties}
          </div>
          <div className="text-gray-600">Total Properties</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-yellow-200">
          <div className="text-3xl font-bold text-yellow-600">
            {summary.pendingApprovals}
          </div>
          <div className="text-gray-600">Pending Approvals</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-primary-green">
            {summary.totalUsers}
          </div>
          <div className="text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-primary-green">
            {summary.totalBookings}
          </div>
          <div className="text-gray-600">Total Bookings</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-navy">Pending Approvals</h2>
            {pendingCount > 0 && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingCount} pending
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Loading pending listings...</div>
          ) : pending.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No pending approvals at the moment</p>
              <p className="text-gray-400 text-sm mt-1">All properties have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map((property) => (
                <div
                  key={property.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-navy text-lg">{property.title}</h3>
                      <p className="text-gray-600">Landlord: {property.landlord.name}</p>
                      <p className="text-gray-600">Location: {property.location.name}</p>
                      <p className="text-primary-green font-medium mt-1">{formatPrice(property.price)}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{getImageCount(property.images)} media item(s)</span>
                        <span>Submitted: {new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Review Details
                      </Link>
                      <button
                        onClick={() => updatePropertyStatus(property.id, "APPROVED")}
                        disabled={updatingId === property.id}
                        className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updatePropertyStatus(property.id, "REJECTED")}
                        disabled={updatingId === property.id}
                        className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </div>
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
