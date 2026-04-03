import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await prisma.property.findMany({
    where: { status: "APPROVED" },
    select: { id: true, updatedAt: true },
  });

  const propertyUrls: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `https://rentalhub.ng/properties/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://rentalhub.ng",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://rentalhub.ng/properties",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...propertyUrls,
  ];
}
