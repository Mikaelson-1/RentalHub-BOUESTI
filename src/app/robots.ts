import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/properties"],
        disallow: ["/admin", "/landlord", "/student", "/api", "/login", "/register"],
      },
    ],
    sitemap: "https://rentalhub.ng/sitemap.xml",
  };
}
