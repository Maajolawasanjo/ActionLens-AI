"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons issue in Next.js
const setupLeafletMarkerIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

interface MapProps {
  center: [number, number];
  zoom: number;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    severity: "critical" | "high" | "moderate" | "low";
    type: string;
  }>;
  bufferCircle?: {
    center: [number, number];
    radiusKm: number;
    severity: "critical" | "high" | "moderate" | "low";
  };
}

export default function MapComponent({ center, zoom, markers = [], bufferCircle }: MapProps) {
  useEffect(() => {
    setupLeafletMarkerIcon();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#8C2F2F"; // Deep Crimson
      case "high":
        return "#C1622E"; // Burnt Orange
      case "moderate":
        return "#D9A441"; // Amber
      default:
        return "#2E7D5B"; // Muted Emerald
    }
  };

  return (
    <div className="w-full h-full relative" style={{ minHeight: "350px" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ background: "#0B111E" }}
      >
        {/* CartoDB Dark Matter tile layer matches the Obsidian Navy/Midnight Sapphire palette */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />

        {markers.map((marker) => {
          const color = getSeverityColor(marker.severity);
          // Custom SVG icon for matching the premium aesthetic
          const customIcon = L.divIcon({
            html: `<div style="background-color: ${color}; width: 14px; height: 14px; border: 2px solid #E2E8F0; border-radius: 50%; box-shadow: 0 0 10px ${color};"></div>`,
            className: "custom-leaflet-marker",
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });

          return (
            <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={customIcon}>
              <Popup className="custom-leaflet-popup">
                <div className="bg-[#151D2A] text-[#E2E8F0] p-2 border border-[#2E3A4E] rounded-xs font-sans text-xs">
                  <p className="font-editorial text-sm font-semibold border-b border-[#2E3A4E] pb-1 mb-1">
                    {marker.title}
                  </p>
                  <p className="capitalize">
                    Type: <span className="font-mono text-[#94A3B8]">{marker.type}</span>
                  </p>
                  <p className="capitalize">
                    Risk Level: <span style={{ color }}>{marker.severity}</span>
                  </p>
                  <p className="text-[10px] text-[#94A3B8] font-mono mt-1">
                    GPS: {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {bufferCircle && (
          <Circle
            center={bufferCircle.center}
            radius={bufferCircle.radiusKm * 1000}
            pathOptions={{
              color: getSeverityColor(bufferCircle.severity),
              fillColor: getSeverityColor(bufferCircle.severity),
              fillOpacity: 0.15,
              weight: 1.5,
              dashArray: "4, 4",
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
