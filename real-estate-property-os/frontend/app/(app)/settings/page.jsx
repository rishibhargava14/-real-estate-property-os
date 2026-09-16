"use client";

import { useEffect, useState } from "react";
import { Save, FileDown } from "lucide-react";
import api, { getCompanyId } from "@/lib/api";

const LANGUAGES = [
  { value: "mr", label: "Marathi" },
  { value: "hi", label: "Hindi" },
  { value: "en", label: "English" },
];

export default function SettingsPage() {
  const [form, setForm] = useState({
    language: "mr",
    whatsappToken: "",
    upiToken: 5000,
    googleMapApiKey: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const companyId = getCompanyId();
    // Not itemized in the section 4 API list, but the settings page needs a
    // place to read/write these — assumed: GET/PATCH /api/settings?companyId=
    api
      .get("/settings", { params: { companyId } })
      .then((res) => res.data && setForm((f) => ({ ...f, ...res.data })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const companyId = getCompanyId();
      await api.patch("/settings", { companyId, ...form });
      setMessage("Settings saved.");
    } catch {
      setMessage("Couldn't save settings. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function exportAudit() {
    const companyId = getCompanyId();
    setExporting(true);
    try {
      const res = await api.get("/audit/export", {
        params: { companyId, year },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `audit-${year}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage("Couldn't generate the audit export.");
    } finally {
      setExporting(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-faint">Loading settings…</p>;

  return (
    <div className="flex max-w-lg flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Storefront language, messaging, and integration tokens.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4 rounded-lg border border-sand-line bg-sand-raised p-6">
        <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
          Storefront & WhatsApp language
          <select className="field" value={form.language} onChange={update("language")}>
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
          WhatsApp API token
          <input
            className="field font-mono text-xs"
            type="password"
            value={form.whatsappToken}
            onChange={update("whatsappToken")}
            placeholder="EAAG…"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
          UPI site-visit token amount (₹)
          <input
            className="field"
            type="number"
            min="0"
            value={form.upiToken}
            onChange={update("upiToken")}
          />
          <span className="text-xs text-ink-faint">
            Charged as a confirmation token when a customer books a site visit.
          </span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
          Google Maps API key
          <input
            className="field font-mono text-xs"
            type="password"
            value={form.googleMapApiKey}
            onChange={update("googleMapApiKey")}
            placeholder="AIza…"
          />
        </label>

        {message && <p className="text-sm text-forest">{message}</p>}

        <button type="submit" disabled={saving} className="btn-primary self-start">
          <Save size={15} strokeWidth={2} />
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>

      <div className="rounded-lg border border-sand-line bg-sand-raised p-6">
        <h2 className="text-sm font-semibold text-ink">Audit export</h2>
        <p className="mt-1 text-sm text-ink-faint">
          Download every listing, its status, leads, and site visits for a year as Excel.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <input
            type="number"
            className="field w-28"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <button onClick={exportAudit} disabled={exporting} className="btn-secondary">
            <FileDown size={15} strokeWidth={2} />
            {exporting ? "Exporting…" : "Export Excel"}
          </button>
        </div>
      </div>
    </div>
  );
}
