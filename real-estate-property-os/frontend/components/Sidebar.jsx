"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  CalendarCheck,
  Users,
  MapPin,
  Camera,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/sitevisits", label: "Site visits", icon: CalendarCheck },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/photo-proof", label: "Photo proof", icon: Camera },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("companyId");
    localStorage.removeItem("companyName");
    localStorage.removeItem("subdomain");
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col justify-between bg-blueprint text-sand">
      <div>
        <div className="px-6 pt-7 pb-6">
          <span className="font-serif text-xl tracking-tight">Property OS</span>
          <p className="mt-1 text-xs text-sand/55">Listings, visits & leads</p>
        </div>
        <nav className="mt-2 flex flex-col gap-0.5 px-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-sand text-blueprint font-medium"
                    : "text-sand/80 hover:bg-white/10 hover:text-sand"
                }`}
              >
                <Icon size={16} strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-white/10 px-3 py-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sand/70 transition-colors hover:bg-white/10 hover:text-sand"
        >
          <LogOut size={16} strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
