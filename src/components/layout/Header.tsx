import { User } from "better-auth";
import { BarChart3, Link2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { UserNav } from "../user-nav";

const NAVITEMS = [
  {
    id: "overview",
    label: "Overview",
    href: "/",
    icon: ShieldCheck,
  },
  {
    id: "links",
    label: "Manage Links",
    href: "/links",
    icon: Link2,
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    id: "utm-builder",
    label: "UTM Builder",
    href: "/utm-builder",
    icon: Zap,
  },
];

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-white dark:bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-10">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-xl text-indigo-600"
      >
        <Link2 className="w-6 h-6" />
        <span>HTR Link Manager</span>
      </Link>
      <nav className="flex items-center gap-6">
        {NAVITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="text-sm font-medium hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <UserNav user={user} />
      </div>
    </header>
  );
}
