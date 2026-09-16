"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [company, setCompany] = useState("");
  const [subdomain, setSubdomain] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setCompany(localStorage.getItem("companyName") || "");
    setSubdomain(localStorage.getItem("subdomain") || "");
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="min-h-screen bg-sand" />;
  }

  return (
    <div className="flex min-h-screen bg-sand">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-sand-line bg-sand-raised px-8 py-4">
          <span className="text-sm font-medium text-ink">{company}</span>
          {subdomain && (
            <a
              href={`/public/${subdomain}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blueprint underline decoration-blueprint/30 underline-offset-2 hover:decoration-blueprint"
            >
              View public storefront →
            </a>
          )}
        </header>
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
