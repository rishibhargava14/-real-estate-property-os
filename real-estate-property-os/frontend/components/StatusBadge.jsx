const STYLES = {
  available: "bg-forest-light text-forest",
  scheduled: "bg-forest-light text-forest",
  new: "bg-slate-light text-slate",
  sold: "bg-rose-light text-rose",
  cancelled: "bg-rose-light text-rose",
  rented: "bg-brass-light text-brass",
  completed: "bg-blueprint/10 text-blueprint",
  contacted: "bg-brass-light text-brass",
  "site-visit": "bg-flame-light text-flame",
  closed: "bg-blueprint/10 text-blueprint",
};

export default function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase();
  const cls = STYLES[key] || "bg-slate-light text-slate";
  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" />
      {status || "unknown"}
    </span>
  );
}
