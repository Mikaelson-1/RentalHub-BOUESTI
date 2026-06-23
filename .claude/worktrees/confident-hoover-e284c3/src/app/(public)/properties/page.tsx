import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { SCHOOL_LOCATION_KEYWORDS } from "@/lib/schools";
import { Building2 } from "lucide-react";
import { Badge, Button, Card, EmptyState } from "@/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Available Properties",
  description:
    "Browse all verified off-campus accommodation across Nigeria. Filter by location and find your perfect student room or apartment.",
  openGraph: {
    title: "Available Properties | RentalHub",
    description:
      "Browse all verified off-campus accommodation across Nigeria. Filter by location and find your perfect student room or apartment.",
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
        if (!typed.type || typed.type === "image") return typed.url;
      }
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#192F59]">Available Properties</h1>
            <p className="text-gray-600 mt-2">Browse verified off-campus accommodation across Nigeria.</p>
          </div>
          {activeFilter && (
            <div className="flex items-center gap-3">
              <Badge variant="info" size="md">
                {schoolFilter ? `School: ${schoolFilter}` : `Location: ${locationFilter}`}
              </Badge>
              <Link href="/properties" className="text-xs text-[#192F59] hover:text-[#E67E22] transition-colors">
                Clear filter
              </Link>
            </div>
          )}
        </div>

        {properties.length === 0 ? (
          <EmptyState
            title={activeFilter ? `No properties found` : "No properties available"}
            description={
              activeFilter
                ? `No approved properties found for ${schoolFilter || locationFilter}.`
                : "No approved properties are available yet."
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const isFullyBooked = property.vacantUnits <= 0;
              const uploadedSrc = getFirstUploadedImage(property.images);
              return (
                <Card key={property.id} shadow="sm" border>
                  <div className="relative h-48 bg-gray-100 -m-4 mb-4">
                    {uploadedSrc ? (
                      <Image
                        src={uploadedSrc}
                        alt={property.title}
                        fill
                        className={`object-cover${isFullyBooked ? " opacity-60" : ""}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                    {isFullyBooked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg">
                          Fully Booked
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{property.location.name}</p>
                  <h2 className="text-lg font-semibold text-[#192F59] mt-1">{property.title}</h2>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{property.description}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className={`font-bold text-xl ${isFullyBooked ? "text-gray-400" : "text-[#00A553]"}`}>
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        maximumFractionDigits: 0,
                      }).format(Number(property.price))}
                    </p>
                    {isFullyBooked ? (
                      <Badge variant="danger" size="sm">
                        Not Available
                      </Badge>
                    ) : (
                      <Link href={`/properties/${property.id}`}>
                        <Button size="sm" variant="primary">
                          View Details
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
