"use client";

import { useEffect, useState } from "react";
import api, { getCompanyId } from "@/lib/api";
import { formatINR, formatDate } from "@/lib/format";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import ScoreBadge from "@/components/ScoreBadge";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const [properties, setProperties] = useState([]);
  const [hotLeads, setHotLeads] = useState([]);
  const [todayVisits, setTodayVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const companyId = getCompanyId();
    setLoading(true);
    setError("");

    Promise.all([
      api.get("/properties/list", { params: { companyId } }),
      api.get("/leads/list", { params: { companyId, score: "hot" } }),
      api.get("/sitevisits/list", { params: { companyId, date: today() } }),
    ])
      .then(([propsRes, leadsRes, visitsRes]) => {
       setProperties(propsRes.data?.data || []);
        setHotLeads(leadsRes.data?.data || []);
        setTodayVisits(visitsRes.data?.data || []);
      })
      .catch(() => setError("Couldn't load your dashboard. Try refreshing."))
      .finally(() => setLoading(false));
  }, []);

  const available = properties.filter((p) => p.status === "available").length;
  const sold = properties.filter((p) => p.status === "sold").length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Listings, today's site visits, and leads worth calling first.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total properties" value={loading ? "—" : properties.length} />
        <StatCard label="Available" value={loading ? "—" : available} tone="forest" />
        <StatCard label="Sold" value={loading ? "—" : sold} />
        <StatCard
          label="Site visits today"
          value={loading ? "—" : todayVisits.length}
        />
        <StatCard label="Hot leads" value={loading ? "—" : hotLeads.length} tone="flame" />
      </div>

      {error && <p className="text-sm text-rose">{error}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink-soft">Hot leads</h2>
          <div className="rounded-lg border border-sand-line bg-sand-raised">
            {!loading && hotLeads.length === 0 && (
              <p className="p-5 text-sm text-ink-faint">No hot leads right now.</p>
            )}
            {hotLeads.length > 0 && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Budget</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hotLeads.slice(0, 6).map((lead) => (
                    <tr key={lead._id}>
                      <td>
                        <div className="font-medium text-ink">{lead.name}</div>
                        <div className="text-xs text-ink-faint">{lead.phone}</div>
                      </td>
                      <td className="font-mono text-xs">{lead.budgetRange}</td>
                      <td>
                        <StatusBadge status={lead.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink-soft">Today's site visits</h2>
          <div className="rounded-lg border border-sand-line bg-sand-raised">
            {!loading && todayVisits.length === 0 && (
              <p className="p-5 text-sm text-ink-faint">Nothing scheduled for today.</p>
            )}
            {todayVisits.length > 0 && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Slot</th>
                    <th>Agent</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayVisits.map((visit) => (
                    <tr key={visit._id}>
                      <td>
                        <div className="font-medium text-ink">{visit.customerName}</div>
                        <div className="text-xs text-ink-faint">{visit.phone}</div>
                      </td>
                      <td className="font-mono text-xs">{visit.slot}</td>
                      <td>{visit.agentName || "—"}</td>
                      <td>
                        <StatusBadge status={visit.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
