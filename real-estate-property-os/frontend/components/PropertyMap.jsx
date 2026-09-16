"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { resolveUpload } from "@/lib/api";
import { formatINR } from "@/lib/format";

function pinIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22],
  });
}

const ICONS = {
  available: pinIcon("#3F7D58"),
  sold: pinIcon("#B24C4C"),
  rented: pinIcon("#C08A28"),
  default: pinIcon("#16324F"),
};

function FitBounds({ points }) {
  const map = useMap();
  if (points.length > 0) {
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }
  return null;
}

export default function PropertyMap({ properties }) {
  const [selected, setSelected] = useState(null);
  const points = properties.filter((p) => p.lat && p.lng);
  const center = points[0] ? [points[0].lat, points[0].lng] : [20.5937, 78.9629];

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={points.length ? 12 : 5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.length > 0 && <FitBounds points={points} />}
        {points.map((p) => (
          <Marker
            key={p._id}
            position={[p.lat, p.lng]}
            icon={ICONS[p.status] || ICONS.default}
            eventHandlers={{ click: () => setSelected(p) }}
          >
            <Popup>
              <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, minWidth: 160 }}>
                <strong>{p.title}</strong>
                <div style={{ color: "#C08A28", marginTop: 2 }}>{formatINR(p.price)}</div>
                <div style={{ color: "#78808C", fontSize: 12 }}>{p.location}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selected && (
        <div className="absolute bottom-4 left-4 w-64 rounded-lg border border-sand-line bg-sand-raised p-3 shadow-lg">
          {selected.images?.[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveUpload(selected.images[0])}
              alt={selected.title}
              className="mb-2 h-28 w-full rounded-md object-cover"
            />
          )}
          <p className="text-sm font-semibold text-ink">{selected.title}</p>
          <p className="font-serif text-lg text-brass">{formatINR(selected.price)}</p>
          <p className="text-xs text-ink-faint">{selected.location}</p>
        </div>
      )}
    </div>
  );
}
