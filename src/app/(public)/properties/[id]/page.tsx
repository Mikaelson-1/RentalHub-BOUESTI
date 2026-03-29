import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PropertyDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      location: true,
      landlord: {
        select: {
          name: true,
          verificationStatus: true,
        },
      },
    },
  });

  if (!property || property.status !== "APPROVED") {
    notFound();
  }

  const amenities = Array.isArray(property.amenities) ? property.amenities : [];
  const rawImages = Array.isArray(property.images) ? property.images : [];
  const imageUrls = rawImages.flatMap((imageItem) => {
    if (typeof imageItem === "string") {
      return [imageItem];
    }
    if (
      typeof imageItem === "object" &&
      imageItem !== null &&
      "url" in imageItem &&
      typeof (imageItem as { url: unknown }).url === "string"
    ) {
      return [(imageItem as { url: string }).url];
    }
    return [];
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/properties" className="text-sm text-[#E67E22] hover:underline">
          Back to properties
        </Link>

        <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {imageUrls.length > 0 && (
            <div className="mb-6">
              <img
                src={imageUrls[0]}
                alt={property.title}
                className="w-full h-72 object-cover rounded-xl border border-gray-200"
              />
            </div>
          )}

          <p className="text-sm text-gray-500">{property.location.name}</p>
          <h1 className="text-3xl font-bold text-[#192F59] mt-1">{property.title}</h1>
          <p className="text-[#00A553] text-2xl font-bold mt-3">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              maximumFractionDigits: 0,
            }).format(Number(property.price))}
            <span className="text-sm font-medium text-gray-500 ml-1">/year</span>
          </p>

          <p className="text-gray-700 mt-6 leading-relaxed">{property.description}</p>

          {amenities.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-[#192F59] mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <span key={`${amenity}-${index}`} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                    {String(amenity)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              Listed by <span className="font-medium text-gray-900">{property.landlord.name}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Verification: {property.landlord.verificationStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
