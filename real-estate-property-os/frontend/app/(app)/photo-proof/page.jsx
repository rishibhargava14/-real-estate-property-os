"use client";

import { useEffect, useState } from "react";
import { UploadCloud, MapPin, LocateFixed } from "lucide-react";
import api, { getCompanyId, resolveUpload } from "@/lib/api";
import { formatDate } from "@/lib/format";

const TYPES = ["site_visit", "before", "after"];

export default function PhotoProofPage() {
  const [properties, setProperties] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("site_visit");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const companyId = getCompanyId();
    api
      .get("/properties/list", { params: { companyId } })
      .then((res) => {
        const list = res.data || [];
        setProperties(list);
        if (list[0]) setPropertyId(list[0]._id);
      })
      .catch(() => setProperties([]));
  }, []);

  function loadPhotos(id) {
    if (!id) return;
    setLoading(true);
    api
      .get("/photo/list", { params: { propertyId: id } })
      .then((res) => setPhotos(res.data || []))
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPhotos(propertyId);
  }, [propertyId]);

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude.toFixed(6));
      setLng(pos.coords.longitude.toFixed(6));
    });
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file || !propertyId) return;
    setUploading(true);
    setError("");
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("photo", file);
      fd.append("propertyId", propertyId);
      fd.append("lat", lat);
      fd.append("lng", lng);
      fd.append("type", type);
      await api.post("/photo/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Photo uploaded and geo-tagged.");
      setFile(null);
      loadPhotos(propertyId);
    } catch {
      setError("Couldn't upload this photo. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl text-ink">Photo proof</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Geo-tagged photos from site visits, before/after work, and inspections.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <form
          onSubmit={handleUpload}
          className="flex flex-col gap-4 rounded-lg border border-sand-line bg-sand-raised p-5"
        >
          <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
            Property
            <select
              className="field"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            >
              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
            Type
            <select className="field" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
              Latitude
              <input className="field" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="18.5993" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
              Longitude
              <input className="field" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="73.7629" />
            </label>
          </div>
          <button
            type="button"
            onClick={useCurrentLocation}
            className="flex items-center gap-1.5 self-start text-xs text-blueprint hover:text-blueprint-dark"
          >
            <LocateFixed size={13} />
            Use my current location
          </button>

          <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
            Photo
            <div className="flex items-center gap-2 rounded-md border border-dashed border-sand-line bg-sand px-3 py-3 text-xs text-ink-faint">
              <UploadCloud size={16} strokeWidth={1.75} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-xs"
              />
            </div>
          </label>

          {message && <p className="text-sm text-forest">{message}</p>}
          {error && <p className="text-sm text-rose">{error}</p>}

          <button type="submit" disabled={uploading || !file} className="btn-primary">
            {uploading ? "Uploading…" : "Upload photo"}
          </button>
        </form>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink-soft">Gallery</h2>
          {loading && <p className="text-sm text-ink-faint">Loading photos…</p>}
          {!loading && photos.length === 0 && (
            <p className="rounded-lg border border-sand-line bg-sand-raised p-6 text-sm text-ink-faint">
              No photos for this property yet.
            </p>
          )}
          {!loading && photos.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {photos.map((photo) => (
                <div
                  key={photo._id}
                  className="overflow-hidden rounded-lg border border-sand-line bg-sand-raised"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveUpload(photo.photoUrl)}
                    alt={photo.type}
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-2.5">
                    <p className="text-xs font-medium capitalize text-ink">
                      {photo.type?.replace("_", " ")}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-faint">
                      <MapPin size={10} />
                      {photo.lat?.toFixed?.(4)}, {photo.lng?.toFixed?.(4)}
                    </p>
                    <p className="text-[11px] text-ink-faint">{formatDate(photo.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
