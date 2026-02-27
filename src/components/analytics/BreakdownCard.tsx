import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BreakdownItem {
  label: string;
  count: number;
}

interface BreakdownCardProps {
  title: string;
  items: BreakdownItem[];
  emptyMessage?: string;
}

export function BreakdownCard({
  title,
  items,
  emptyMessage = "No data available",
}: BreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              {emptyMessage}
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center"
              >
                <span className="text-sm font-medium truncate max-w-[150px]">
                  {item.label}
                </span>
                <span className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded dark:bg-slate-800 dark:text-slate-200">
                  {item.count}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
