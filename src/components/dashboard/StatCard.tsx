import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  bg?: string;
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "text-slate-600",
  bg = "bg-slate-50",
  description,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "border shadow-sm transition-all hover:shadow-md overflow-hidden",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", bg)}>
          <Icon className={cn("w-4 h-4", color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
