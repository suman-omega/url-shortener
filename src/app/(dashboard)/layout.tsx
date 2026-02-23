import { Toaster } from "@/components/ui/sonner";
import { BarChart3, Link2, Settings, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="h-16 border-b bg-white dark:bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Link2 className="w-6 h-6" />
          <span>HTR Link Manager</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Overview
          </Link>
          <Link
            href="/links"
            className="text-sm font-medium hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <Link2 className="w-4 h-4" />
            Manage Links
          </Link>
          <Link
            href="/analytics"
            className="text-sm font-medium hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
          <Link
            href="/utm-builder"
            className="text-sm font-medium hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            UTM Builder
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-8">{children}</div>
      </main>
      <Toaster />
    </div>
  );
}
