"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api, { getCompanyId } from "@/lib/api";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-ink-faint">
      Loading map…
    </div>
  ),
});

export default function MapPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const companyId = getCompanyId();
    api
      .get("/properties/list", { params: { companyId } })
      .then((res) => setProperties(res.data || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-ink">Map</h1>
          <p className="mt-1 text-sm text-ink-faint">
            Every listing plotted by location. Click a pin for details.
          </p>
        </div>
        <div className="flex gap-4 text-xs text-ink-faint">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-forest" /> Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brass" /> Rented
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose" /> Sold
          </span>
        </div>
      </div>
      <div className="h-[560px] overflow-hidden rounded-lg border border-sand-line">
        {!loading && <PropertyMap properties={properties} />}
      </div>
    </div>
  );
}
