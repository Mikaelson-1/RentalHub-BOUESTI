import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { SCHOOL_LOCATION_KEYWORDS } from "@/lib/schools";
import { getPropertyImage } from "@/lib/property-image";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Available Properties",
  description:
    "Browse all verified off-campus accommodation near BOUESTI. Filter by location and find your perfect student room or apartment.",
  openGraph: {
    title: "Available Properties | RentalHub",
    description:
      "Browse all verified off-campus accommodation near BOUESTI. Filter by location and find your perfect student room or apartment.",
    url: "https://rentalhub.ng/properties",
  },
};

interface PropertiesPageProps {
  searchParams?: Promise<{
    location?: string;
    school?: string;
  }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const schoolFilter = resolvedSearchParams?.school?.trim() || "";
  const locationFilter = resolvedSearchParams?.location?.trim() || "";
  const activeFilter = schoolFilter || locationFilter;
  const selectedKeywords = schoolFilter ? SCHOOL_LOCATION_KEYWORDS[schoolFilter] ?? [schoolFilter] : [locationFilter];
  const locationNameFilters = selectedKeywords
    .map((keyword) => keyword.trim())
    .filter((keyword): keyword is string => Boolean(keyword));

  const properties = await prisma.property.findMany({
    where: {
      status: "APPROVED",
      ...(activeFilter && {
        location: {
          OR: locationNameFilters.map((keyword) => ({
            name: {
              contains: keyword,
              mode: "insensitive" as const,
            },
          })),
        },
      }),
    },
    include: {
      location: true,
      landlord: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  /** Extract the first uploaded image URL from a property's images JSON field */
  function getFirstUploadedImage(images: unknown): string | null {
    if (!Array.isArray(images)) return null;
    for (const item of images) {
      if (typeof item === "string") return item;
      if (
        typeof item === "object" &&
        item !== null &&
        "url" in item &&
        typeof (item as { url: unknown }).url === "string"
      ) {
        const typed = item as { url: string; type?: string };
        // Only use image-type uploads, not videos or docs
        if (!typed.type || typed.type === "image") return typed.url;
      }
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#192F59]">Available Properties</h1>
          <p className="text-gray-600 mt-2">
            Browse verified off-campus accommodation around BOUESTI.
          </p>
          {activeFilter && (
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex items-center bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-3 py-1 text-xs font-medium">
                {schoolFilter ? `School: ${schoolFilter}` : `Location: ${locationFilter}`}
              </span>
              <Link href="/properties" className="text-xs text-[#192F59] hover:text-[#E67E22] transition-colors">
                Clear filter
              </Link>
            </div>
          )}
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-600">
              {activeFilter
                ? `No approved properties found for ${schoolFilter || locationFilter}.`
                : "No approved properties are available yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="relative h-48">
                  {(() => {
                    const uploadedSrc = getFirstUploadedImage(property.images);
                    const src = uploadedSrc ?? getPropertyImage(property.id);
                    return (
                      <Image
                        src={src}
                        alt={property.title}
                        fill
                        className="object-cover"
                        unoptimized={!!uploadedSrc}
                      />
                    );
                  })()}
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-500">{property.location.name}</p>
                  <h2 className="text-lg font-semibold text-[#192F59] mt-1">{property.title}</h2>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{property.description}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[#00A553] font-bold text-xl">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        maximumFractionDigits: 0,
                      }).format(Number(property.price))}
                    </p>
                    <Link
                      href={`/properties/${property.id}`}
                      className="bg-[#192F59] hover:bg-[#0f1d3a] text-white text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
