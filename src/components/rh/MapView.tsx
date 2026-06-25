"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { naira } from "@/lib/rh/theme";
import type { UiListing } from "@/lib/rh/api";

// Fix Leaflet's default icon paths broken by bundlers
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  listings: UiListing[];
  onSelect?: (id: string) => void;
}

// Bouesti campus coords as default center
const DEFAULT_CENTER: [number, number] = [7.3775, 5.2065];

export default function MapView({ listings, onSelect }: Props) {
  const mapped = listings.filter((l) => l.lat != null && l.lng != null);

  return (
    <div style={{ width: "100%", height: 520, borderRadius: 18, overflow: "hidden", border: "1px solid #e5ddd0" }}>
      <MapContainer
        center={mapped.length > 0 ? [mapped[0].lat!, mapped[0].lng!] : DEFAULT_CENTER}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapped.map((l) => (
          <Marker key={l.id} position={[l.lat!, l.lng!]} icon={icon}>
            <Popup>
              <div style={{ fontFamily: "system-ui, sans-serif", minWidth: 160 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{l.title}</div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{l.area}</div>
                <div style={{ fontWeight: 700, color: "#C7562A", fontSize: 15 }}>{naira(l.price)}/yr</div>
                <button
                  onClick={() => onSelect?.(l.id)}
                  style={{ marginTop: 8, padding: "6px 12px", background: "#C7562A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, width: "100%" }}
                >
                  View property
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {mapped.length === 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(244,238,228,.85)", fontFamily: "system-ui, sans-serif", fontSize: 14, color: "#6B6153" }}>
          No listings have map coordinates yet.
        </div>
      )}
    </div>
  );
}
