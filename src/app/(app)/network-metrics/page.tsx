"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_NETWORK_METRICS } from "@/lib/mock-data";
import type { NetworkMetric, NetworkMetricDataPoint } from "@/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Activity, BarChart2 } from "lucide-react";

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const getChartConfig = (metric: NetworkMetric) => ({
  [metric.id]: {
    label: metric.name,
    color: chartColors[MOCK_NETWORK_METRICS.findIndex(m => m.id === metric.id) % chartColors.length],
  },
});

export default function NetworkMetricsPage() {
  const [timeRange, setTimeRange] = useState("last-hour"); // example: 'last-hour', 'last-24-hours', 'last-7-days'
  
  // This would typically fetch data based on timeRange. For now, we use all mock data.
  const metricsData = useMemo(() => {
    // In a real app, you'd filter or re-fetch data based on timeRange
    return MOCK_NETWORK_METRICS;
  }, [timeRange]);

  const renderChart = (metric: NetworkMetric) => {
    const chartConfig = getChartConfig(metric);
    // Simple heuristic to decide chart type
    const ChartComponent = metric.id === "totalDownload" ? BarChart : LineChart;
    const DataComponent = metric.id === "totalDownload" ? Bar : Line;

    return (
      <Card key={metric.id} className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {metric.id === "latency" ? <Activity className="h-5 w-5 text-primary" /> : 
             metric.id === "packetLoss" ? <TrendingUp className="h-5 w-5 text-primary" /> :
             <BarChart2 className="h-5 w-5 text-primary" />
            }
            {metric.name}
          </CardTitle>
          <CardDescription>Unit: {metric.unit}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <ChartComponent data={metric.data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} 
                       domain={metric.id === "packetLoss" ? [0, 'auto'] : undefined} // Ensure packet loss starts at 0
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" labelKey="value" nameKey="time" hideLabel />}
                />
                <DataComponent
                  dataKey="value"
                  type="monotone"
                  stroke={chartConfig[metric.id].color}
                  fill={chartConfig[metric.id].color} // For BarChart
                  strokeWidth={2}
                  dot={{ r: 3, fill: chartConfig[metric.id].color }}
                  activeDot={{ r: 5 }}
                />
              </ChartComponent>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Network Metrics</h1>
            <p className="text-muted-foreground">Monitor your network performance over time.</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-hour">Last Hour</SelectItem>
            <SelectItem value="last-24-hours">Last 24 Hours</SelectItem>
            <SelectItem value="last-7-days">Last 7 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {metricsData.map(metric => renderChart(metric))}
      </div>
       {metricsData.length === 0 && (
        <Card className="text-center py-10">
          <CardContent>
            <p className="text-muted-foreground">No metrics data available for the selected range.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
