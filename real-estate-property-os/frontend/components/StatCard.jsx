export default function StatCard({ label, value, tone = "default" }) {
  const toneCls =
    tone === "gold"
      ? "text-brass"
      : tone === "flame"
      ? "text-flame"
      : tone === "forest"
      ? "text-forest"
      : "text-blueprint";
  return (
    <div className="rounded-lg border border-sand-line bg-sand-raised px-5 py-4">
      <p className="text-xs text-ink-faint">{label}</p>
      <p className={`mt-2 font-serif text-3xl ${toneCls}`}>{value}</p>
    </div>
  );
}
