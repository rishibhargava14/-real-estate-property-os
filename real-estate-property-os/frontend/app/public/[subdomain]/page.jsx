"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { X, Building2, MessageCircle } from "lucide-react";
import api from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";

const CATEGORIES = ["1BHK", "2BHK", "Plot", "Shop"];
const BUDGETS = ["10L", "20L", "50L", "1Cr"];
const SLOTS = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"];

export default function PublicStorefrontPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subdomain = params.subdomain;

  const [company, setCompany] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(searchParams.get("type") || "");
  const [budget, setBudget] = useState(searchParams.get("budget") || "");
  const [category, setCategory] = useState("");

  const [visitProperty, setVisitProperty] = useState(null);
  const [inquiryProperty, setInquiryProperty] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = { subdomain };
    if (budget) params.budget = budget;
    if (type) params.type = type;
    api
      .get("/properties/public", { params })
      .then((res) => {
       setCompany(res.data?.data?.company || null);
       setProperties(res.data?.data?.properties || []);
      })
      .catch(() => {
        setCompany(null);
        setProperties([]);
      })
      .finally(() => setLoading(false));
  }, [subdomain, budget, type]);

  const filtered = category
    ? properties.filter((p) => p.category === category)
    : properties;

  return (
    <div className="min-h-screen bg-sand">
      <header className="bg-blueprint px-6 py-10 text-sand sm:px-12">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="rounded-md bg-sand/10 p-2">
            <Building2 size={20} strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="font-serif text-2xl">{company?.name || "Loading…"}</h1>
            <p className="text-sm text-sand/70">Verified listings, direct from the developer</p>
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-10 border-b border-sand-line bg-sand-raised/95 px-6 py-4 backdrop-blur sm:px-12">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3">
          <select className="field w-auto" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>
          <select className="field w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select className="field w-auto" value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="">Any budget</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>Up to {b}</option>
            ))}
          </select>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-12">
        {loading && <p className="text-sm text-ink-faint">Loading listings…</p>}
        {!loading && filtered.length === 0 && (
          <p className="rounded-lg border border-sand-line bg-sand-raised p-8 text-center text-sm text-ink-faint">
            No properties match these filters right now.
          </p>
        )}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PropertyCard
                key={p._id}
                property={p}
                showStatus={false}
                actions={
                  <>
                    <button onClick={() => setVisitProperty(p)} className="btn-primary flex-1 text-xs">
                      Schedule visit
                    </button>
                    <button
                      onClick={() => setInquiryProperty(p)}
                      className="btn-secondary flex-1 text-xs"
                    >
                      <MessageCircle size={13} />
                      Inquire
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </main>

      {visitProperty && (
        <ScheduleVisitModal property={visitProperty} onClose={() => setVisitProperty(null)} />
      )}
      {inquiryProperty && (
        <InquiryModal property={inquiryProperty} onClose={() => setInquiryProperty(null)} />
      )}
    </div>
  );
}

function ScheduleVisitModal({ property, onClose }) {
  const [form, setForm] = useState({ customerName: "", phone: "", visitDate: "", slot: SLOTS[0] });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/sitevisits/create", { ...form, propertyId: property._id });
      setDone(true);
    } catch (err) {
      setError(
        err?.response?.data?.message || "That slot may already be booked — try a different time."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm rounded-lg border border-sand-line bg-sand-raised p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg text-ink">Schedule a visit</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <p className="mb-4 text-xs text-ink-faint">{property.title}</p>

        {done ? (
          <p className="rounded-md bg-forest-light p-4 text-sm text-forest">
            Visit requested. Our team will confirm by phone or WhatsApp shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
              Your name
              <input required className="field" value={form.customerName} onChange={update("customerName")} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
              Phone
              <input required type="tel" className="field" value={form.phone} onChange={update("phone")} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
              Date
              <input required type="date" className="field" value={form.visitDate} onChange={update("visitDate")} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
              Slot
              <select className="field" value={form.slot} onChange={update("slot")}>
                {SLOTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            {error && <p className="text-sm text-rose">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Booking…" : "Confirm visit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function InquiryModal({ property, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", budgetRange: "20L", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/leads/create", {
        ...form,
        propertyId: property._id,
        source: "WhatsApp",
      });
      setDone(true);
    } catch {
      setError("Couldn't send your inquiry. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm rounded-lg border border-sand-line bg-sand-raised p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg text-ink">WhatsApp inquiry</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <p className="mb-4 text-xs text-ink-faint">{property.title}</p>

        {done ? (
          <p className="rounded-md bg-forest-light p-4 text-sm text-forest">
            Sent — expect a reply on WhatsApp shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
              Your name
              <input required className="field" value={form.name} onChange={update("name")} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
              WhatsApp number
              <input required type="tel" className="field" value={form.phone} onChange={update("phone")} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
              Budget
              <select className="field" value={form.budgetRange} onChange={update("budgetRange")}>
                {BUDGETS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
              Message
              <textarea
                className="field"
                rows={3}
                value={form.message}
                onChange={update("message")}
                placeholder="Is this still available?"
              />
            </label>
            {error && <p className="text-sm text-rose">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-gold">
              <MessageCircle size={15} />
              {submitting ? "Sending…" : "Send inquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
