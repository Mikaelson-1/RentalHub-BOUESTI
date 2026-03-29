import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import ReviewActions from "./ReviewActions";

interface AdminPropertyReviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminPropertyReviewPage({ params }: AdminPropertyReviewPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      location: true,
      landlord: {
        select: {
          name: true,
          email: true,
          verificationStatus: true,
        },
      },
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  if (!property) {
    notFound();
  }

  const amenities = Array.isArray(property.amenities) ? property.amenities : [];
  const rawImages = Array.isArray(property.images) ? property.images : [];

  const mediaItems = rawImages.map((item, index) => {
    if (typeof item === "string") {
      return {
        id: `media-${index}`,
        type: "image",
        name: `image-${index + 1}`,
        url: item,
      };
    }

    if (typeof item === "object" && item !== null) {
      const typedItem = item as {
        type?: string;
        name?: string;
        url?: string;
        mimeType?: string;
        size?: number;
      };
      return {
        id: `media-${index}`,
        type: typedItem.type || "file",
        name: typedItem.name || `file-${index + 1}`,
        url: typedItem.url,
        mimeType: typedItem.mimeType,
        size: typedItem.size,
      };
    }

    return {
      id: `media-${index}`,
      type: "file",
      name: `file-${index + 1}`,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin" className="text-sm text-[#E67E22] hover:underline">
          Back to Admin Queue
        </Link>

        <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-[#192F59]">{property.title}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                property.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : property.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {property.status}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-gray-800">Location:</span> {property.location.name}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Price:</span>{" "}
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  maximumFractionDigits: 0,
                }).format(Number(property.price))}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Distance to campus:</span>{" "}
                {property.distanceToCampus ? `${property.distanceToCampus} km` : "Not provided"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Bookings:</span> {property._count.bookings}
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-gray-800">Landlord:</span> {property.landlord.name}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Email:</span> {property.landlord.email}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Landlord Status:</span>{" "}
                {property.landlord.verificationStatus}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Submitted:</span>{" "}
                {new Date(property.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-base font-semibold text-[#192F59]">Description</h2>
            <p className="mt-2 text-gray-700 whitespace-pre-line">{property.description}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-base font-semibold text-[#192F59]">Amenities</h2>
            {amenities.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">No amenities provided.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <span key={`${amenity}-${index}`} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                    {String(amenity)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-base font-semibold text-[#192F59]">Uploaded Media</h2>
            {mediaItems.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">No file metadata available.</p>
            ) : (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {mediaItems.map((mediaItem) => (
                  <div key={mediaItem.id} className="rounded-md border border-gray-200 p-3">
                    {mediaItem.url && mediaItem.type === "image" ? (
                      <img
                        src={mediaItem.url}
                        alt={mediaItem.name}
                        className="w-full h-44 object-cover rounded-md border border-gray-100"
                      />
                    ) : (
                      <div className="h-44 rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-xs text-gray-500 px-3 text-center">
                        Preview unavailable
                      </div>
                    )}
                    <div className="mt-2 text-sm text-gray-700">
                      <p className="font-medium">{mediaItem.name}</p>
                      <p className="text-gray-500">
                        {mediaItem.type}
                        {mediaItem.mimeType ? ` • ${mediaItem.mimeType}` : ""}
                        {typeof mediaItem.size === "number" ? ` • ${(mediaItem.size / 1024).toFixed(1)} KB` : ""}
                      </p>
                      {mediaItem.url && mediaItem.type !== "image" && (
                        <a
                          href={mediaItem.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#E67E22] hover:underline"
                        >
                          Open file
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ReviewActions propertyId={property.id} />
        </div>
      </div>
    </div>
  );
}
