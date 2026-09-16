"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Check, X as XIcon } from "lucide-react";
import api, { getCompanyId } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

export default function SiteVisitsPage() {
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [visits, setVisits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const grid = useMemo(
    () => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );

  function loadVisits() {
    const companyId = getCompanyId();
    setLoading(true);
    api
      .get("/sitevisits/list", { params: { companyId, date: selectedDate } })
      .then((res) => setVisits(res.data || []))
      .catch(() => setVisits([]))
      .finally(() => setLoading(false));
  }

  useEffect(loadVisits, [selectedDate]);

  useEffect(() => {
    const companyId = getCompanyId();
    api
      .get("/sitevisits/stats", { params: { companyId } })
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  // Not in the section 4 API list, but Complete/Cancel needs a status update
  // path — assumed: PATCH /api/sitevisits/:id { status }
  async function updateStatus(visit, status) {
    setBusyId(visit._id);
    try {
      await api.patch(`/sitevisits/${visit._id}`, { status });
      loadVisits();
    } catch {
      // non-fatal, table just won't refresh
    } finally {
      setBusyId(null);
    }
  }

  async function sendReminder(visit) {
    setBusyId(visit._id);
    try {
      await api.post("/whatsapp/send", {
        type: "sitevisit-reminder",
        phone: visit.phone,
        propertyId: visit.propertyId,
        language: "mr",
      });
    } catch {
      // non-fatal
    } finally {
      setBusyId(null);
    }
  }

  const monthLabel = cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink">Site visits</h1>
          <p className="mt-1 text-sm text-ink-faint">
            Booked slots by day, with reminders and outcome tracking.
          </p>
        </div>
        {stats && (
          <div className="flex gap-5 text-sm text-ink-faint">
            <span>
              <strong className="text-ink">{stats.total ?? "—"}</strong> total
            </span>
            <span>
              <strong className="text-ink">{stats.scheduled ?? "—"}</strong> scheduled
            </span>
            <span>
              <strong className="text-ink">{stats.completed ?? "—"}</strong> completed
            </span>
            <span>
              <strong className="text-forest">{stats.conversionPercent ?? stats["conversion%"] ?? "—"}%</strong> conversion
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-lg border border-sand-line bg-sand-raised p-4">
          <div className="mb-3 flex items-center justify-between">
            <button
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
              className="rounded p-1 text-ink-faint hover:bg-sand hover:text-ink"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-ink">{monthLabel}</span>
            <button
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
              className="rounded p-1 text-ink-faint hover:bg-sand hover:text-ink"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-ink-faint">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={`${d}${i}`} className="py-1">
                {d}
              </div>
            ))}
            {grid.map((date, i) => {
              if (!date) return <div key={i} />;
              const iso = toISODate(date);
              const active = iso === selectedDate;
              const isToday = iso === toISODate(new Date());
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(iso)}
                  className={`aspect-square rounded-md text-xs transition-colors ${
                    active
                      ? "bg-blueprint text-sand"
                      : isToday
                      ? "bg-brass-light text-brass"
                      : "text-ink-soft hover:bg-sand"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-sand-line bg-sand-raised">
          <div className="flex items-center justify-between border-b border-sand-line px-4 py-3 text-sm font-medium text-ink">
            {new Date(selectedDate).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "2-digit",
              month: "short",
            })}
          </div>
          {loading && <p className="p-5 text-sm text-ink-faint">Loading…</p>}
          {!loading && visits.length === 0 && (
            <p className="p-5 text-sm text-ink-faint">No site visits booked for this day.</p>
          )}
          {!loading && visits.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Slot</th>
                  <th>Agent</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visits.map((v) => (
                  <tr key={v._id}>
                    <td>
                      <div className="font-medium text-ink">{v.customerName}</div>
                      <div className="text-xs text-ink-faint">{v.phone}</div>
                    </td>
                    <td className="font-mono text-xs">{v.slot}</td>
                    <td>{v.agentName || "—"}</td>
                    <td>
                      <StatusBadge status={v.status} />
                    </td>
                    <td>
                      <div className="flex items-center gap-3 text-xs">
                        <button
                          onClick={() => updateStatus(v, "completed")}
                          disabled={busyId === v._id}
                          className="flex items-center gap-1 text-forest hover:text-forest/80 disabled:text-ink-faint"
                        >
                          <Check size={13} /> Complete
                        </button>
                        <button
                          onClick={() => updateStatus(v, "cancelled")}
                          disabled={busyId === v._id}
                          className="flex items-center gap-1 text-rose hover:text-rose/80 disabled:text-ink-faint"
                        >
                          <XIcon size={13} /> Cancel
                        </button>
                        <button
                          onClick={() => sendReminder(v)}
                          disabled={busyId === v._id}
                          className="flex items-center gap-1 text-blueprint hover:text-blueprint-dark disabled:text-ink-faint"
                        >
                          <MessageCircle size={13} /> Remind
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
