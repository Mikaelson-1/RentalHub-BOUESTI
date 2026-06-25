"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { T, shortNaira, naira, I } from "@/lib/rh/theme";
import { AREAS, AMENITY_GROUPS } from "@/lib/rh/data";
import { apiGet, mapProperty, type UiListing, type ApiListResponse } from "@/lib/rh/api";
import { useSaved } from "@/lib/rh/saved";
import { useCompare } from "@/lib/rh/compare";
import { useApp, useViewport } from "@/components/rh/app";
import { Button, Card, Select, PropertyCard, PublicNav, Footer } from "@/components/rh/ui";

const MapView = dynamic(() => import("@/components/rh/MapView"), { ssr: false, loading: () => <div style={{ height: 520, borderRadius: 18, background: T.paper, border: "1px solid " + T.line, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.sans, color: T.ink2 }}>Loading map…</div> });

interface Filters { area: string | null; maxPrice: number; gender: string | null; amenities: string[] }
const EMPTY: Filters = { area: null, maxPrice: 450000, gender: null, amenities: [] };

function FilterChip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <span onClick={onClick} style={{ padding: "8px 14px", borderRadius: 999, cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", border: "1px solid " + (active ? T.clay : T.line), background: active ? T.clay : "#fff", color: active ? "#fff" : T.ink2, transition: "all .12s" }}>{children}</span>
  );
}

function FilterPanel({ f, setF, mobile }: { f: Filters; setF: React.Dispatch<React.SetStateAction<Filters>>; mobile: boolean }) {
  const allAmen = Object.values(AMENITY_GROUPS).flat();
  const toggle = (key: keyof Filters, val: string) => setF((p) => {
    const cur = p[key];
    if (Array.isArray(cur)) return { ...p, [key]: cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val] };
    return { ...p, [key]: cur === val ? null : val };
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      <div>
        <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 12 }}>Max rent / year</div>
        <input type="range" min="60000" max="450000" step="10000" value={f.maxPrice} onChange={(e) => setF((p) => ({ ...p, maxPrice: +e.target.value }))} style={{ width: "100%", accentColor: T.clay }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: T.sans, fontSize: 12.5, color: T.ink2, marginTop: 6 }}>
          <span>₦60k</span><span style={{ fontWeight: 700, color: T.clay }}>Up to {shortNaira(f.maxPrice)}</span><span>₦450k</span>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 12 }}>Gender preference</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Any", "Female", "Male"].map((g) => <FilterChip key={g} active={f.gender === g} onClick={() => toggle("gender", g)}>{g}</FilterChip>)}
        </div>
      </div>
      <div>
        <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 12 }}>Amenities</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {allAmen.slice(0, mobile ? 8 : 14).map((a) => <FilterChip key={a} active={f.amenities.includes(a)} onClick={() => toggle("amenities", a)}>{a}</FilterChip>)}
        </div>
      </div>
    </div>
  );
}

// Side-by-side comparison modal
function CompareModal({ items, onClose, onNavigate }: { items: UiListing[]; onClose: () => void; onNavigate: (id: string) => void }) {
  const FIELDS: [string, (l: UiListing) => React.ReactNode][] = [
    ["Price/year", (l) => <strong>{naira(l.price)}</strong>],
    ["Area", (l) => l.area],
    ["Distance to gate", (l) => l.dist ? `${l.dist} km` : "—"],
    ["Amenities", (l) => l.amenities.slice(0, 5).join(", ") || "—"],
    ["Vacant units", (l) => l.vacant],
    ["Landlord", (l) => l.landlordName],
  ];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 160, background: "rgba(33,29,24,.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.paper, borderRadius: 20, width: "100%", maxWidth: 760, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid " + T.line, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontFamily: T.serif, fontSize: 26, color: T.ink, fontWeight: 500 }}>Compare homes</h2>
          <span onClick={onClose} style={{ cursor: "pointer", color: T.ink2 }}>{I.x({ width: 22, height: 22 })}</span>
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
        <div style={{ display: "grid", gridTemplateColumns: `160px repeat(${items.length}, minmax(180px, 1fr))`, borderCollapse: "collapse", minWidth: 400 } as React.CSSProperties}>
          {/* Header */}
          <div style={{ padding: "14px 16px", background: T.paper }} />
          {items.map((l) => (
            <div key={l.id} style={{ padding: "14px 16px", borderLeft: "1px solid " + T.line2 }}>
              <div style={{ fontFamily: T.serif, fontSize: 16, color: T.ink, fontWeight: 500, lineHeight: 1.2 }}>{l.title}</div>
              <div style={{ fontFamily: T.sans, fontSize: 12, color: T.ink2, marginTop: 4 }}>{l.area}</div>
              <Button size="sm" variant="soft" style={{ marginTop: 10 }} onClick={() => { onClose(); onNavigate(l.id); }}>View →</Button>
            </div>
          ))}
          {/* Rows */}
          {FIELDS.map(([label, fn]) => (
            <>
              <div key={label + "-label"} style={{ padding: "12px 16px", fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.ink2, background: T.paper, borderTop: "1px solid " + T.line2 }}>{label}</div>
              {items.map((l) => (
                <div key={label + l.id} style={{ padding: "12px 16px", fontFamily: T.sans, fontSize: 13, color: T.ink, borderLeft: "1px solid " + T.line2, borderTop: "1px solid " + T.line2 }}>{fn(l)}</div>
              ))}
            </>
          ))}
        </div>
        </div>{/* end overflow wrapper */}
      </div>
    </div>
  );
}

function SearchInner() {
  const { go, campus } = useApp();
  const { mobile } = useViewport();
  const { isSaved, toggle: toggleSaved } = useSaved();
  const { items: compareItems, toggle: toggleCompare, hasId: inCompare, clear: clearCompare, full: compareFull } = useCompare();
  const sp = useSearchParams();
  const [f, setF] = useState<Filters>({ ...EMPTY, area: sp.get("area") });
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showCompare, setShowCompare] = useState(false);
  const [all, setAll] = useState<UiListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiGet<ApiListResponse>(`/api/properties?pageSize=100&campus=${encodeURIComponent(campus.id)}`)
      .then((r) => { if (active) setAll(r.items.map(mapProperty)); })
      .catch((e) => { if (active) setError(e instanceof Error ? e.message : "Failed to load"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [campus.id]);

  const results = useMemo(() => {
    let r = all.filter((l) =>
      (!f.area || l.area === f.area) &&
      l.price <= f.maxPrice &&
      (!f.gender || f.gender === "Any" || l.gender === f.gender || l.gender === "Any") &&
      (f.amenities.length === 0 || f.amenities.every((a) => l.amenities.includes(a)))
    );
    if (sort === "price-low") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "price-high") r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === "distance") r = [...r].sort((a, b) => a.dist - b.dist);
    else r = [...r].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return r;
  }, [all, f, sort]);

  const activeCount = (f.area ? 1 : 0) + (f.gender ? 1 : 0) + f.amenities.length + (f.maxPrice < 450000 ? 1 : 0);

  return (
    <div style={{ background: T.paper, minHeight: "100vh", paddingBottom: compareItems.length > 0 ? 80 : 0 }}>
      <PublicNav />

      <div style={{ background: T.paper2, borderBottom: "1px solid " + T.line2 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: mobile ? "18px 20px" : "24px 40px" }}>
          <h1 style={{ margin: 0, fontFamily: T.serif, fontWeight: 400, fontSize: mobile ? 28 : 38, letterSpacing: "-.02em", color: T.ink }}>
            Homes near {campus.short}{f.area ? <span> · <span style={{ color: T.clay }}>{f.area}</span></span> : ""}
          </h1>
          <div style={{ display: "flex", gap: 8, marginTop: 16, overflowX: "auto", paddingBottom: 4 }}>
            <FilterChip active={!f.area} onClick={() => setF((p) => ({ ...p, area: null }))}>All areas</FilterChip>
            {AREAS.map((a) => <FilterChip key={a} active={f.area === a} onClick={() => setF((p) => ({ ...p, area: a }))}>{a}</FilterChip>)}
          </div>
        </div>
      </div>

      <div className="rh-m-block" style={{ maxWidth: 1280, margin: "0 auto", padding: mobile ? "20px" : "28px 40px 56px", display: mobile ? "block" : "grid", gridTemplateColumns: "264px 1fr", gap: 36, alignItems: "start" }}>
        {!mobile ? (
          <div className="rh-m-hide" style={{ position: "sticky", top: 92 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontFamily: T.serif, fontSize: 22, color: T.ink }}>Filters</span>
              {activeCount > 0 && <span onClick={() => setF(EMPTY)} style={{ fontFamily: T.sans, fontSize: 12.5, color: T.clay, cursor: "pointer", fontWeight: 600 }}>Clear all</span>}
            </div>
            <FilterPanel f={f} setF={setF} mobile={mobile} />
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <Button variant="outline" icon={I.filter} onClick={() => setShowFilters(true)} style={{ flex: 1 }}>Filters{activeCount > 0 ? ` · ${activeCount}` : ""}</Button>
            <Select value={sort} onChange={(e) => setSort(e.target.value)} style={{ flex: 1 }}>
              <option value="featured">Featured</option><option value="price-low">Price ↑</option><option value="price-high">Price ↓</option><option value="distance">Closest</option>
            </Select>
          </div>
        )}

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: T.sans, fontSize: 14.5, color: T.ink2 }}><strong style={{ color: T.ink }}>{results.length}</strong> {results.length === 1 ? "home" : "homes"} found</span>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              {/* Map/List toggle */}
              <div style={{ display: "flex", border: "1px solid " + T.line, borderRadius: 11, overflow: "hidden" }}>
                <button onClick={() => setViewMode("list")} style={{ padding: "8px 13px", background: viewMode === "list" ? T.ink : "#fff", color: viewMode === "list" ? "#fff" : T.ink2, border: "none", cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {I.grid({ width: 14, height: 14 })} List
                </button>
                <button onClick={() => setViewMode("map")} style={{ padding: "8px 13px", background: viewMode === "map" ? T.ink : "#fff", color: viewMode === "map" ? "#fff" : T.ink2, border: "none", borderLeft: "1px solid " + T.line, cursor: "pointer", fontFamily: T.sans, fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {I.pin({ width: 14, height: 14 })} Map
                </button>
              </div>
              {!mobile && (
                <>
                  <span style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2 }}>Sort by</span>
                  <Select value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: "auto", padding: "9px 36px 9px 13px", fontSize: 13.5 }}>
                    <option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="distance">Closest to campus</option>
                  </Select>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <Card pad={48} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: T.sans, fontSize: 14.5, color: T.ink2 }}>Loading homes…</div>
            </Card>
          ) : error ? (
            <Card pad={48} style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: T.redSoft, color: T.red, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{I.shieldAlert({ width: 26, height: 26 })}</div>
              <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink }}>Couldn&apos;t load homes</div>
              <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink2, marginTop: 8 }}>{error}</p>
            </Card>
          ) : results.length === 0 ? (
            <Card pad={48} style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: T.paper, color: T.ink3, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{I.search({ width: 26, height: 26 })}</div>
              <div style={{ fontFamily: T.serif, fontSize: 24, color: T.ink }}>No homes match those filters</div>
              <p style={{ fontFamily: T.sans, fontSize: 14.5, color: T.ink2, marginTop: 8 }}>Try widening your price range or clearing a filter.</p>
              <div style={{ marginTop: 18, display: "inline-block" }}><Button variant="soft" onClick={() => setF(EMPTY)}>Clear all filters</Button></div>
            </Card>
          ) : viewMode === "map" ? (
            <MapView listings={results} onSelect={(id) => go("property", id)} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fill, minmax(248px, 1fr))", gap: mobile ? 16 : 20 }}>
              {results.map((l) => (
                <PropertyCard
                  key={l.id}
                  l={l}
                  mobile={mobile}
                  onClick={() => go("property", l.id)}
                  saved={isSaved(l.id)}
                  onSave={() => toggleSaved(l)}
                  comparing={inCompare(l.id)}
                  onCompare={() => toggleCompare(l)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobile && showFilters && (
        <div style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(33,29,24,.5)", display: "flex", alignItems: "flex-end" }} onClick={() => setShowFilters(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: T.paper, width: "100%", borderRadius: "22px 22px 0 0", padding: 22, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontFamily: T.serif, fontSize: 26, color: T.ink }}>Filters</span>
              <span onClick={() => setShowFilters(false)} style={{ cursor: "pointer", color: T.ink2 }}>{I.x({ width: 24, height: 24 })}</span>
            </div>
            <FilterPanel f={f} setF={setF} mobile={mobile} />
            <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
              <Button variant="outline" onClick={() => setF(EMPTY)} style={{ flex: 1 }}>Clear</Button>
              <Button onClick={() => setShowFilters(false)} style={{ flex: 2 }}>Show {results.length} homes</Button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison bar */}
      {compareItems.length > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: T.ink, color: T.paper, padding: "14px 24px", paddingBottom: "calc(14px + env(safe-area-inset-bottom, 0px))", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", minWidth: 0 }}>
            <span style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, color: "rgba(244,238,228,.7)", whiteSpace: "nowrap" }}>Comparing {compareItems.length}/2:</span>
            {compareItems.map((l) => (
              <div key={l.id} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(244,238,228,.12)", borderRadius: 999, padding: "6px 12px" }}>
                <span style={{ fontFamily: T.sans, fontSize: 13, color: "#fff", maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</span>
                <span onClick={() => toggleCompare(l)} style={{ cursor: "pointer", color: "rgba(244,238,228,.5)", lineHeight: 0 }}>{I.x({ width: 14, height: 14 })}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button size="sm" variant="outline" style={{ borderColor: "rgba(244,238,228,.3)", color: T.paper }} onClick={clearCompare}>Clear</Button>
            {compareItems.length === 2 && <Button size="sm" onClick={() => setShowCompare(true)}>Compare now</Button>}
          </div>
        </div>
      )}

      {showCompare && compareItems.length === 2 && (
        <CompareModal items={compareItems} onClose={() => setShowCompare(false)} onNavigate={(id) => go("property", id)} />
      )}

      <Footer />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div style={{ background: T.paper, minHeight: "100vh" }} />}>
      <SearchInner />
    </Suspense>
  );
}
