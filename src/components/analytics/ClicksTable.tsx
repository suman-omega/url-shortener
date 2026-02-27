import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Click {
  id: string;
  slug: string | null;
  timestamp: Date;
  country: string | null;
  device: string | null;
  ip: string | null;
}

interface ClicksTableProps {
  clicks: Click[];
}

export function ClicksTable({ clicks }: ClicksTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Slug</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Device</TableHead>
          <TableHead>IP Address</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clicks.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="h-32 text-center text-muted-foreground italic"
            >
              No clicks recorded yet.
            </TableCell>
          </TableRow>
        ) : (
          clicks.map((click) => (
            <TableRow key={click.id}>
              <TableCell className="font-medium">/{click.slug}</TableCell>
              <TableCell className="text-slate-500">
                {click.timestamp.toLocaleString()}
              </TableCell>
              <TableCell>{click.country}</TableCell>
              <TableCell className="capitalize">{click.device}</TableCell>
              <TableCell className="text-slate-400 font-mono text-xs">
                {click.ip}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
