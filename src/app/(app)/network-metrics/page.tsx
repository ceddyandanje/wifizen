
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { NetworkMetric } from "@/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Activity, BarChart2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const getChartConfig = (metric: NetworkMetric, allMetrics: NetworkMetric[]) => ({
  [metric.id]: {
    label: metric.name,
    color: chartColors[allMetrics.findIndex(m => m.id === metric.id) % chartColors.length],
  },
});

export default function NetworkMetricsPage() {
  const [timeRange, setTimeRange] = useState("last-hour");
  const [metricsData, setMetricsData] = useState<NetworkMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const response = await fetch(`/api/network-metrics?timeRange=${timeRange}`);
        if (!response.ok) throw new Error('Failed to fetch network metrics');
        const data = await response.json();
        setMetricsData(data.metrics || []); // Assuming API returns { metrics: NetworkMetric[] }
      } catch (error) {
        console.error("Failed to fetch network metrics:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load network metrics." });
        setMetricsData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [timeRange, toast]);

  const renderChart = (metric: NetworkMetric) => {
    const chartConfig = getChartConfig(metric, metricsData);
    const ChartComponent = metric.id === "totalDownload" || metric.id === "totalUpload" ? BarChart : LineChart;
    const DataComponent = metric.id === "totalDownload" || metric.id === "totalUpload" ? Bar : Line;

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
                       domain={metric.id === "packetLoss" ? [0, 'auto'] : undefined}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" labelKey="value" nameKey="time" hideLabel />}
                />
                <DataComponent
                  dataKey="value"
                  type="monotone"
                  stroke={chartConfig[metric.id].color}
                  fill={chartConfig[metric.id].color}
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
       {metricsData.length === 0 && !loading && (
        <Card className="text-center py-10 col-span-full">
          <CardContent>
            <p className="text-muted-foreground">No metrics data available for the selected range, or failed to load.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
