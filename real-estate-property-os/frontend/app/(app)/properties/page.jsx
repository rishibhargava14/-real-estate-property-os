"use client";

import { useEffect, useState } from "react";
import { Plus, X, UploadCloud } from "lucide-react";
import api, { getCompanyId } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";

const CATEGORIES = ["1BHK", "2BHK", "Plot", "Shop"];
const BUDGETS = ["10L", "20L", "50L", "1Cr"];
const AMENITIES = [
  "Parking",
  "Lift",
  "Power Backup",
  "24x7 Security",
  "Garden",
  "Gym",
  "Swimming Pool",
  "Clubhouse",
  "Water Supply",
  "CCTV",
];

const EMPTY_FORM = {
  title: "",
  type: "sale",
  category: "1BHK",
  price: "",
  area: "",
  location: "",
  lat: "",
  lng: "",
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: "", category: "", budget: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [amenities, setAmenities] = useState([]);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function loadProperties() {
    const companyId = getCompanyId();
    setLoading(true);
    const params = { companyId };
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.budget) params.budget = filters.budget;
    api
      .get("/properties/list", { params })
      .then((res) => setProperties(res.data?.data || [])) 
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }

  useEffect(loadProperties, [filters]);

  function updateForm(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function toggleAmenity(item) {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  }

  function handleFiles(e) {
    setFiles(Array.from(e.target.files || []).slice(0, 10));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const companyId = getCompanyId();
      const fd = new FormData();
      fd.append("companyId", companyId);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("amenities", JSON.stringify(amenities));
      files.forEach((f) => fd.append("images", f));

      await api.post("/properties/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setModalOpen(false);
      setForm(EMPTY_FORM);
      setAmenities([]);
      setFiles([]);
      loadProperties();
    } catch {
      setError("Couldn't save this listing. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink">Properties</h1>
          <p className="mt-1 text-sm text-ink-faint">
            Every listing across sale and rent, with its storefront status.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={15} strokeWidth={2} />
          Add property
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          className="field w-auto"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="">All types</option>
          <option value="sale">For sale</option>
          <option value="rent">For rent</option>
        </select>
        <select
          className="field w-auto"
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="field w-auto"
          value={filters.budget}
          onChange={(e) => setFilters((f) => ({ ...f, budget: e.target.value }))}
        >
          <option value="">Any budget</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              Up to {b}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-ink-faint">Loading properties…</p>}
      {!loading && properties.length === 0 && (
        <p className="rounded-lg border border-sand-line bg-sand-raised p-6 text-sm text-ink-faint">
          No listings match these filters yet.
        </p>
      )}
      {!loading && properties.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p._id} property={p} />
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-ink/40 px-4 py-8">
          <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-lg border border-sand-line bg-sand-raised p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg text-ink">Add a property</h2>
              <button onClick={() => setModalOpen(false)} className="text-ink-faint hover:text-ink">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                Title
                <input required className="field" value={form.title} onChange={updateForm("title")} placeholder="Spacious 2BHK near Wakad Metro" />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                  Type
                  <select className="field" value={form.type} onChange={updateForm("type")}>
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                  Category
                  <select className="field" value={form.category} onChange={updateForm("category")}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                  Price (₹)
                  <input required type="number" min="0" className="field" value={form.price} onChange={updateForm("price")} placeholder="4500000" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                  Area (sqft)
                  <input required type="number" min="0" className="field" value={form.area} onChange={updateForm("area")} placeholder="950" />
                </label>
              </div>

              <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                Location
                <input required className="field" value={form.location} onChange={updateForm("location")} placeholder="Wakad, Pune" />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                  Latitude
                  <input required type="number" step="any" className="field" value={form.lat} onChange={updateForm("lat")} placeholder="18.5993" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                  Longitude
                  <input required type="number" step="any" className="field" value={form.lng} onChange={updateForm("lng")} placeholder="73.7629" />
                </label>
              </div>

              <div>
                <p className="mb-1.5 text-sm text-ink-soft">Amenities</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {AMENITIES.map((a) => (
                    <label key={a} className="flex items-center gap-2 text-sm text-ink-soft">
                      <input
                        type="checkbox"
                        checked={amenities.includes(a)}
                        onChange={() => toggleAmenity(a)}
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                Images (up to 10)
                <div className="flex items-center gap-2 rounded-md border border-dashed border-sand-line bg-sand px-3 py-3 text-xs text-ink-faint">
                  <UploadCloud size={16} strokeWidth={1.75} />
                  <input type="file" accept="image/*" multiple onChange={handleFiles} className="text-xs" />
                </div>
                {files.length > 0 && (
                  <span className="text-xs text-ink-faint">{files.length} file(s) selected</span>
                )}
              </label>

              {error && <p className="text-sm text-rose">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? "Uploading…" : "Save listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
