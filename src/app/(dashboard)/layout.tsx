import { Toaster } from "@/components/ui/sonner";
import { UserNav } from "@/components/user-nav";
import { auth } from "@/lib/auth";
import { BarChart3, Link2, ShieldCheck, Zap } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="h-16 border-b bg-white dark:bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-indigo-600"
        >
          <Link2 className="w-6 h-6" />
          <span>HTR Link Manager</span>
        </Link>
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
          <UserNav user={user} />
        </div>
      </header>
      <main className="flex-1 p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-8">{children}</div>
      </main>
      <Toaster />
    </div>
  );
}
