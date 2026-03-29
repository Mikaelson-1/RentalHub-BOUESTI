"use client";

import Link from "next/link";
import { useState } from "react";

// Mock data - replace with actual API calls
const mockBookings = [
  {
    id: "1",
    property: "Modern Self-Contain in Uro",
    location: "Uro",
    price: "₦150,000/year",
    status: "CONFIRMED",
    date: "2024-03-15",
  },
  {
    id: "2",
    property: "2-Bedroom Flat near Campus",
    location: "Odo Oja",
    price: "₦200,000/year",
    status: "PENDING",
    date: "2024-03-20",
  },
];

const mockProperties = [
  {
    id: "1",
    title: "Spacious Self-Contain",
    location: "Ikoyi Estate",
    price: "₦180,000/year",
    distance: "0.5km",
    image: null,
  },
  {
    id: "2",
    title: "Student-Friendly Apartment",
    location: "Afao",
    price: "₦120,000/year",
    distance: "1.2km",
    image: null,
  },
  {
    id: "3",
    title: "Newly Built Self-Contain",
    location: "Oke Kere",
    price: "₦160,000/year",
    distance: "0.8km",
    image: null,
  },
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<"browse" | "bookings">("browse");

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">Student Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Browse properties and manage your bookings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-primary-green">
            {mockBookings.length}
          </div>
          <div className="text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-primary-green">
            {mockBookings.filter((b) => b.status === "CONFIRMED").length}
          </div>
          <div className="text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-primary-green">
            {mockBookings.filter((b) => b.status === "PENDING").length}
          </div>
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
                activeTab === "browse"
                  ? "border-primary-green text-primary-green"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Browse Properties
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "bookings"
                  ? "border-primary-green text-primary-green"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              My Bookings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "browse" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProperties.map((property) => (
                <div
                  key={property.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-navy text-lg">
                      {property.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{property.location}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-primary-green font-bold">
                        {property.price}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {property.distance} to campus
                      </span>
                    </div>
                    <button className="w-full mt-4 bg-primary-green hover:bg-primary-dark text-white py-2 rounded-lg transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {mockBookings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No bookings yet</p>
                  <Link
                    href="/properties"
                    className="text-primary-green hover:underline mt-2 inline-block"
                  >
                    Browse properties
                  </Link>
                </div>
              ) : (
                mockBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-navy">
                        {booking.property}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {booking.location} • {booking.price}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Booked on {booking.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
