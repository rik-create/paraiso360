"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type {
  LotFeatureCollection,
  BlockFeatureCollection,
} from "@/types/geojson";

const Map = dynamic(() => import("@/components/LotMap"), { ssr: false });

export default function MapPage() {
  const [lots, setLots] = useState<LotFeatureCollection | null>(null);
  const [blocks, setBlocks] = useState<BlockFeatureCollection | null>(null);

  useEffect(() => {
    const headers = {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUzODY2ODQ4LCJpYXQiOjE3NTM4NjUwNDgsImp0aSI6IjAyOTkyNmU3MWRjMDQ5MTQ5NWJhOThiOGMwNzRlOTIxIiwidXNlcl9pZCI6IjMifQ.LKpfL3S327ZLySIdN-0718DYoRC-V1np_gTBsCA4Sys",
    };

    fetch("http://localhost:8000/api/v1/lots/geojson/1/", { headers })
      .then((res) => res.json())
      .then((data) => setLots(data))
      .catch((err) => console.error("Error fetching lots:", err));

    fetch("http://localhost:8000/api/v1/blocks/geojson/", { headers })
      .then((res) => res.json())
      .then((data) => setBlocks(data))
      .catch((err) => console.error("Error fetching blocks:", err));
  }, []);

  return (
    <div className="h-screen w-full">
      {lots && blocks ? (
        <Map lots={lots} blocks={blocks} />
      ) : (
        <p>Loading map data...</p>
      )}
    </div>
  );
}
