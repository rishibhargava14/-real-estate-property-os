"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const FEATURES = [
  "A public storefront at yourcompany.propertyos.in with live budget filters",
  "Site-visit slot booking that blocks double-bookings automatically",
  "WhatsApp inquiries and reminders sent in Marathi, Hindi, or English",
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin"); // "signin" | "register"
  const [form, setForm] = useState({
    name: "",
    subdomain: "",
    ownerEmail: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await api.post("/auth/register", form);
      }
      const res = await api.post("/auth/login", {
        ownerEmail: form.ownerEmail,
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      if (res.data.companyId) localStorage.setItem("companyId", res.data.companyId);
      if (res.data.name) localStorage.setItem("companyName", res.data.name);
      if (res.data.subdomain) localStorage.setItem("subdomain", res.data.subdomain);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Couldn't sign you in. Check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[1.1fr_1fr]">
      <div className="hidden flex-col justify-between bg-blueprint px-14 py-12 text-sand md:flex">
        <span className="font-serif text-xl">Property OS</span>
        <div className="max-w-sm">
          <h1 className="font-serif text-4xl leading-[1.15] text-sand">
            Every listing, visit, and lead, on one map.
          </h1>
          <ul className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="border-b border-white/10 pb-4 text-sm leading-relaxed text-sand/80 last:border-none"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-sand/50">Built for property brokers and developers in India</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex gap-6 border-b border-sand-line">
            <button
              onClick={() => setMode("signin")}
              className={`pb-3 text-sm ${
                mode === "signin"
                  ? "border-b-2 border-blueprint font-medium text-blueprint"
                  : "text-ink-faint"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("register")}
              className={`pb-3 text-sm ${
                mode === "register"
                  ? "border-b-2 border-blueprint font-medium text-blueprint"
                  : "text-ink-faint"
              }`}
            >
              Register company
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <>
                <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                  Company name
                  <input
                    required
                    className="field"
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Shree Balaji Properties"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                  Subdomain
                  <div className="flex items-center gap-2">
                    <input
                      required
                      className="field"
                      value={form.subdomain}
                      onChange={update("subdomain")}
                      placeholder="shreebalaji"
                      pattern="[a-z0-9-]+"
                    />
                    <span className="whitespace-nowrap text-xs text-ink-faint">.propertyos.in</span>
                  </div>
                </label>
              </>
            )}
            <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
              Owner email
              <input
                required
                type="email"
                className="field"
                value={form.ownerEmail}
                onChange={update("ownerEmail")}
                placeholder="you@company.com"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
              Password
              <input
                required
                type="password"
                minLength={8}
                className="field"
                value={form.password}
                onChange={update("password")}
                placeholder="••••••••"
              />
            </label>

            {error && (
              <p className="rounded-md border border-rose/40 bg-rose-light px-3 py-2 text-sm text-rose">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading
                ? "Please wait…"
                : mode === "register"
                ? "Register company"
                : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
