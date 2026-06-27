import "server-only";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "https://rentalhub-backend-blue.vercel.app").replace(/\/$/, "");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function serverGetProperties(campusId: string): Promise<{ items: any[] }> {
  try {
    const res = await fetch(
      `${API_BASE}/api/properties?pageSize=100&campus=${encodeURIComponent(campusId)}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return { items: [] };
    return res.json();
  } catch {
    return { items: [] };
  }
}

export async function serverGetLocations(campusId: string): Promise<Array<{ id: string; name: string }>> {
  try {
    const res = await fetch(
      `${API_BASE}/api/locations?campus=${encodeURIComponent(campusId)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
  } catch {
    return [];
  }
}
