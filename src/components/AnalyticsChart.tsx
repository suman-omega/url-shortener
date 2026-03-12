"use client";
import {
  Bar,
  BarChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsData {
  label: string;
  count: number;
}

interface AnalyticsChartProps {
  data: AnalyticsData[];
  height?: number;
}

const COLORS = ["#2563eb", "#10b981", "#6366f1", "#f59e0b", "#9333ea"];

const CustomBar = (props: { index: number }) => {
  const { index } = props;
  const fill = COLORS[index % COLORS.length];
  return <Rectangle {...props} fill={fill} />;
};

export function AnalyticsChart({ data, height = 250 }: AnalyticsChartProps) {
  if (data.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-muted-foreground italic text-sm"
      >
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <XAxis
          dataKey="label"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          cursor={{ fill: "#f3f4f6", radius: 4 }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} shape={CustomBar} />
      </BarChart>
    </ResponsiveContainer>
  );
}
