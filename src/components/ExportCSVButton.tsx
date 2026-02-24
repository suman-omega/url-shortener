"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ExportCSVButton({
  data,
  filename,
}: {
  data: Record<string, unknown>[];
  filename: string;
}) {
  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data
      .map((obj) =>
        Object.values(obj)
          .map((val) => `"${String(val)}"`)
          .join(","),
      )
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportToCSV}
      disabled={data.length === 0}
    >
      <Download className="w-4 h-4 mr-2" />
      Export CSV
    </Button>
  );
}
