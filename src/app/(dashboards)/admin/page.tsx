"use client";

import { useState } from "react";

// Mock data - replace with actual API calls
const mockPendingProperties = [
  {
    id: "1",
    title: "New Self-Contain in Olumilua",
    landlord: "Mr. Adeyemi",
    location: "Olumilua Area",
    price: "₦180,000/year",
    submitted: "2024-03-21",
    images: 3,
  },
  {
    id: "2",
    title: "Student Apartment - 3 Units",
    landlord: "Mrs. Johnson",
    location: "Ajebandele",
    price: "₦220,000/year",
    submitted: "2024-03-20",
    images: 5,
  },
  {
    id: "3",
    title: "Furnished Self-Contain",
    landlord: "Mr. Okafor",
    location: "Ikoyi Estate",
    price: "₦250,000/year",
    submitted: "2024-03-19",
    images: 4,
  },
];

const mockStats = {
  totalProperties: 45,
  pendingApprovals: 3,
  totalUsers: 128,
  totalBookings: 67,
};

export default function AdminDashboard() {
  const [pending, setPending] = useState(mockPendingProperties);

  const handleApprove = (id: string) => {
    // TODO: Implement API call
    setPending(pending.filter((p) => p.id !== id));
  };

  const handleReject = (id: string) => {
    // TODO: Implement API call
    setPending(pending.filter((p) => p.id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage properties, users, and platform settings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-primary-green">
            {mockStats.totalProperties}
          </div>
          <div className="text-gray-600">Total Properties</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-yellow-200">
          <div className="text-3xl font-bold text-yellow-600">
            {mockStats.pendingApprovals}
          </div>
          <div className="text-gray-600">Pending Approvals</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-primary-green">
            {mockStats.totalUsers}
          </div>
          <div className="text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-primary-green">
            {mockStats.totalBookings}
          </div>
          <div className="text-gray-600">Total Bookings</div>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-navy">Pending Approvals</h2>
            {pending.length > 0 && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {pending.length} pending
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {pending.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500 text-lg">
                No pending approvals at the moment
              </p>
              <p className="text-gray-400 text-sm mt-1">
                All properties have been reviewed
              </p>
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
                      <div className="flex items-start gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-navy text-lg">
                            {property.title}
                          </h3>
                          <p className="text-gray-600">
                            Landlord: {property.landlord}
                          </p>
                          <p className="text-gray-600">
                            Location: {property.location}
                          </p>
                          <p className="text-primary-green font-medium mt-1">
                            {property.price}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{property.images} images</span>
                            <span>Submitted: {property.submitted}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleApprove(property.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(property.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Reject
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-navy">Manage Users</h3>
          <p className="text-gray-600 text-sm mt-1">
            View and manage student and landlord accounts
          </p>
        </button>

        <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-navy">All Properties</h3>
          <p className="text-gray-600 text-sm mt-1">
            View and manage all property listings
          </p>
        </button>

        <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-navy">Analytics</h3>
          <p className="text-gray-600 text-sm mt-1">
            View platform statistics and reports
          </p>
        </button>
      </div>
    </div>
  );
}
