import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface AnalyticsPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string | undefined>;
}

export function AnalyticsPagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: AnalyticsPaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="px-6 py-4 border-t flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
      <div className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild disabled={currentPage <= 1}>
          {currentPage <= 1 ? (
            <span>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </span>
          ) : (
            <Link href={buildUrl(currentPage - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Link>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={currentPage >= totalPages}
        >
          {currentPage >= totalPages ? (
            <span>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </span>
          ) : (
            <Link href={buildUrl(currentPage + 1)}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
}
