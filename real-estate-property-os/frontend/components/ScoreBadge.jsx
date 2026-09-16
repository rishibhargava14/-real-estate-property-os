import { Flame, Sun, Snowflake } from "lucide-react";

const CONFIG = {
  hot: { cls: "bg-flame-light text-flame", icon: Flame },
  warm: { cls: "bg-brass-light text-brass", icon: Sun },
  cold: { cls: "bg-slate-light text-slate", icon: Snowflake },
};

export default function ScoreBadge({ score }) {
  const key = String(score || "").toLowerCase();
  const { cls, icon: Icon } = CONFIG[key] || CONFIG.cold;
  return (
    <span className={`badge ${cls}`}>
      <Icon size={11} strokeWidth={2} />
      {score || "cold"}
    </span>
  );
}
