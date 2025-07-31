// paraiso360_frontend/src/components/LotMap.tsx
"use client";

import { MapContainer, TileLayer, GeoJSON, useMapEvents } from "react-leaflet";
import { useState } from "react";
import type {
  LotFeatureCollection,
  BlockFeatureCollection,
} from "@/types/geojson";
import "leaflet/dist/leaflet.css";

interface LotMapProps {
  lots: LotFeatureCollection;
  blocks: BlockFeatureCollection;
}

function ZoomDisplay() {
  const [zoomLevel, setZoomLevel] = useState<number | null>(null);

  useMapEvents({
    zoomend: (event) => {
      const map = event.target;
      setZoomLevel(map.getZoom());
    },
  });

  if (zoomLevel === null) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        boxShadow: "0 0 4px rgba(0,0,0,0.3)",
        zIndex: 1000,
        fontSize: "14px",
      }}
    >
      Zoom: {zoomLevel}
    </div>
  );
}

export default function LotMap({ lots, blocks }: LotMapProps) {
  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={[14.8607094, 121.0735132]}
        zoom={18}
        maxZoom={26}
        zoomSnap={0}
        zoomDelta={0.5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          attribution="&copy; Stadia Maps, OpenMapTiles & OpenStreetMap contributors"
          maxZoom={26}
          maxNativeZoom={19}
        />
        <GeoJSON data={blocks} style={{ color: "blue", fillOpacity: 0.1 }} />
        <GeoJSON data={lots} style={{ color: "green", weight: 2 }} />
        <ZoomDisplay />
      </MapContainer>
    </div>
  );
}
