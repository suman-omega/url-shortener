import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:bg-slate-900 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-600 fill-indigo-600" />
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              HTR Care Go
            </span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} HTR Care. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
