"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AnalyticsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState(searchParams.get("device") || "");
  const [country, setCountry] = useState(searchParams.get("country") || "");
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || "",
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (device) params.set("device", device);
    else params.delete("device");

    if (country) params.set("country", country);
    else params.delete("country");

    if (startDate) params.set("startDate", startDate);
    else params.delete("startDate");

    if (endDate) params.set("endDate", endDate);
    else params.delete("endDate");

    params.set("page", "1"); // Reset to page 1 on filter

    router.push(`/analytics?${params.toString()}`);
    setOpen(false);
  };

  const handleClear = () => {
    setDevice("");
    setCountry("");
    setStartDate("");
    setEndDate("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("device");
    params.delete("country");
    params.delete("startDate");
    params.delete("endDate");
    params.set("page", "1");

    router.push(`/analytics?${params.toString()}`);
    setOpen(false);
  };

  const activeFiltersCount = [
    searchParams.get("device"),
    searchParams.get("country"),
    searchParams.get("startDate"),
    searchParams.get("endDate"),
  ].filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Clicks</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="device">Device Type</Label>
            <select
              id="device"
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input  px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-[#0F172A]"
            >
              <option value="">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="country">Country (Code)</Label>
            <Input
              id="country"
              placeholder="e.g. US, GB, NP"
              value={country}
              onChange={(e) => setCountry(e.target.value.toUpperCase())}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
          <Button type="submit" onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
