import { Suspense } from "react";
import { mapProperty } from "@/lib/rh/api";
import { serverGetProperties, serverGetLocations } from "@/lib/rh/server-api";
import SearchInner from "./SearchInner";

export const revalidate = 300;

const DEFAULT_CAMPUS = "bouesti";

export default async function PropertiesPage() {
  const [raw, locs] = await Promise.all([
    serverGetProperties(DEFAULT_CAMPUS),
    serverGetLocations(DEFAULT_CAMPUS),
  ]);

  const initialListings = raw.items.map(mapProperty);
  const initialLocations = locs.map((l) => l.name);

  return (
    <Suspense fallback={<div style={{ background: "#FAF8F4", minHeight: "100vh" }} />}>
      <SearchInner
        initialListings={initialListings}
        initialLocations={initialLocations}
        serverCampusId={DEFAULT_CAMPUS}
      />
    </Suspense>
  );
}
