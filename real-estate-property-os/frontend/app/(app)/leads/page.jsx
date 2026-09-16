"use client";

import { useEffect, useState } from "react";
import api, { getCompanyId } from "@/lib/api";
import { formatDate } from "@/lib/format";
import ScoreBadge from "@/components/ScoreBadge";
import StatusBadge from "@/components/StatusBadge";

const SCORES = ["hot", "warm", "cold"];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const companyId = getCompanyId();
    setLoading(true);
    const params = { companyId };
    if (score) params.score = score;
    api
      .get("/leads/list", { params })
      .then((res) => setLeads(res.data || []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, [score]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink">Leads</h1>
          <p className="mt-1 text-sm text-ink-faint">
            Enquiries from your storefront and WhatsApp, scored by budget fit.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setScore("")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              score === "" ? "bg-blueprint text-sand" : "bg-sand-raised text-ink-faint border border-sand-line"
            }`}
          >
            All
          </button>
          {SCORES.map((s) => (
            <button
              key={s}
              onClick={() => setScore(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                score === s ? "bg-blueprint text-sand" : "bg-sand-raised text-ink-faint border border-sand-line"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-sand-line bg-sand-raised">
        {loading && <p className="p-5 text-sm text-ink-faint">Loading leads…</p>}
        {!loading && leads.length === 0 && (
          <p className="p-5 text-sm text-ink-faint">No leads match this filter yet.</p>
        )}
        {!loading && leads.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Budget</th>
                <th>Message</th>
                <th>Source</th>
                <th>Score</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <div className="font-medium text-ink">{lead.name}</div>
                    <div className="text-xs text-ink-faint">{lead.phone}</div>
                  </td>
                  <td className="font-mono text-xs">{lead.budgetRange}</td>
                  <td className="max-w-xs truncate text-ink-faint">{lead.message || "—"}</td>
                  <td className="text-ink-faint">{lead.source}</td>
                  <td>
                    <ScoreBadge score={lead.score} />
                  </td>
                  <td>
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="font-mono text-xs text-ink-faint">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
