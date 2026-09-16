import { MapPin, Ruler, Eye } from "lucide-react";
import { resolveUpload } from "@/lib/api";
import { formatINR } from "@/lib/format";
import StatusBadge from "./StatusBadge";

export default function PropertyCard({ property, actions, showStatus = true }) {
  const image = property.images?.[0];
  return (
    <div className="property-card flex flex-col">
      <div className="relative h-40 w-full bg-slate-light">
        {image ? (
          // Uploaded images live on the backend's own /uploads path, not
          // a domain Next/Image is configured to optimize by default.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveUpload(image)}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-ink-faint">
            No image
          </div>
        )}
        {showStatus && (
          <div className="absolute left-2.5 top-2.5">
            <StatusBadge status={property.status} />
          </div>
        )}
        <div className="absolute right-2.5 top-2.5 rounded-full bg-blueprint/80 px-2 py-0.5 text-[11px] font-medium text-sand">
          {property.type === "rent" ? "For rent" : "For sale"}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-ink">{property.title}</h3>
          <span className="shrink-0 rounded-full bg-sand px-2 py-0.5 text-[11px] text-ink-faint">
            {property.category}
          </span>
        </div>
        <p className="font-serif text-xl text-brass">{formatINR(property.price)}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint">
          <span className="flex items-center gap-1">
            <MapPin size={12} strokeWidth={1.75} />
            {property.location}
          </span>
          {property.area && (
            <span className="flex items-center gap-1">
              <Ruler size={12} strokeWidth={1.75} />
              {property.area} sqft
            </span>
          )}
          {property.views !== undefined && (
            <span className="flex items-center gap-1">
              <Eye size={12} strokeWidth={1.75} />
              {property.views}
            </span>
          )}
        </div>
        {actions && <div className="mt-2 flex gap-2 border-t border-sand-line pt-3">{actions}</div>}
      </div>
    </div>
  );
}
