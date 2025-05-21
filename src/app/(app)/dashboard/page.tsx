
"use client";

import { useState, useEffect } from "react";
import type { Device, InternetStatus, NetworkMetricDataPoint, DeviceTypeDistribution } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DEVICE_ICONS } from "@/lib/mock-data"; // Keep for icons
import Link from "next/link";
import { ArrowRight, Wifi, Users, BarChartHorizontalBig, Signal, AlertTriangle, Download, Upload, WifiOff, HelpCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const chartConfigTotalUsage = {
  usage: { label: "Data Usage", color: "hsl(var(--primary))" },
};

const chartConfigDeviceTypes = {
  count: { label: "Device Count" },
  laptop: { label: "Laptops", color: "hsl(var(--chart-1))" },
  smartphone: { label: "Smartphones", color: "hsl(var(--chart-2))" },
  tablet: { label: "Tablets", color: "hsl(var(--chart-3))" },
  "smart-tv": { label: "Smart TVs", color: "hsl(var(--chart-4))" },
  other: { label: "Other", color: "hsl(var(--chart-5))" },
  router: { label: "Router", color: "hsl(var(--chart-1))" }, // Added router
  "iot-device": { label: "IoT Device", color: "hsl(var(--chart-2))" }, // Added iot-device
  unknown: { label: "Unknown", color: "hsl(var(--chart-3))" }, // Added unknown
};

interface TotalUsageSummary {
  total: number;
  data: NetworkMetricDataPoint[];
}
interface RecentDeviceActivity {
    devices: Device[];
}


export default function DashboardPage() {
  const [internetStatus, setInternetStatus] = useState<InternetStatus | null>(null);
  const [connectedDevicesSummary, setConnectedDevicesSummary] = useState<{ online: number; total: number } | null>(null);
  const [totalUsage, setTotalUsage] = useState<TotalUsageSummary | null>(null);
  const [recentDevices, setRecentDevices] = useState<Device[]>([]);
  const [deviceTypeDistribution, setDeviceTypeDistribution] = useState<DeviceTypeDistribution[]>([]);

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingDevicesSummary, setLoadingDevicesSummary] = useState(true);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingDistribution, setLoadingDistribution] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingStatus(true);
        const resStatus = await fetch('/api/internet-status');
        if (!resStatus.ok) throw new Error('Failed to fetch internet status');
        const statusData = await resStatus.json();
        setInternetStatus(statusData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingStatus(false);
      }

      try {
        setLoadingDevicesSummary(true);
        const resDevicesSummary = await fetch('/api/devices/summary');
        if (!resDevicesSummary.ok) throw new Error('Failed to fetch devices summary');
        const devicesSummaryData = await resDevicesSummary.json();
        setConnectedDevicesSummary(devicesSummaryData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDevicesSummary(false);
      }
      
      try {
        setLoadingUsage(true);
        const resUsage = await fetch('/api/network-metrics/total-usage-summary');
        if(!resUsage.ok) throw new Error('Failed to fetch total usage summary');
        const usageData = await resUsage.json();
        setTotalUsage(usageData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingUsage(false);
      }

      try {
        setLoadingRecent(true);
        const resRecent = await fetch('/api/devices?limit=3&sort=activity');
        if (!resRecent.ok) throw new Error('Failed to fetch recent devices');
        const recentData: RecentDeviceActivity = await resRecent.json();
        setRecentDevices(recentData.devices || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRecent(false);
      }

      try {
        setLoadingDistribution(true);
        const resDistribution = await fetch('/api/devices/distribution');
        if (!resDistribution.ok) throw new Error('Failed to fetch device distribution');
        const distributionData = await resDistribution.json();
        setDeviceTypeDistribution(distributionData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDistribution(false);
      }
    }
    fetchData();
  }, []);

  const onlineDevices = connectedDevicesSummary?.online || 0;
  const totalDevices = connectedDevicesSummary?.total || 0;

  const deviceTypeData = deviceTypeDistribution.map(d => ({
    name: chartConfigDeviceTypes[d.type as keyof typeof chartConfigDeviceTypes]?.label || d.type,
    value: d.count,
    fill: chartConfigDeviceTypes[d.type as keyof typeof chartConfigDeviceTypes]?.color || chartConfigDeviceTypes.other.color,
  }));


  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internet Status</CardTitle>
            {loadingStatus ? <Loader2 className="h-5 w-5 animate-spin" /> :
              internetStatus?.health === 'Stable' ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-destructive" />}
          </CardHeader>
          <CardContent>
            {loadingStatus ? <Loader2 className="h-8 w-8 animate-spin my-2" /> : internetStatus ? (
              <>
                <div className="text-2xl font-bold">
                  {internetStatus.health}
                </div>
                <div className="flex space-x-4 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center">
                        <Download className="h-3 w-3 mr-1 text-blue-500"/> {internetStatus.speed.download.toFixed(1)} Mbps
                    </div>
                    <div className="flex items-center">
                        <Upload className="h-3 w-3 mr-1 text-green-500"/> {internetStatus.speed.upload.toFixed(1)} Mbps
                    </div>
                </div>
                <Progress value={(internetStatus.speed.download / 1000) * 100} className="mt-2 h-2" />
              </>
            ) : <p className="text-muted-foreground">Could not load status.</p>}
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Devices</CardTitle>
            {loadingDevicesSummary ? <Loader2 className="h-5 w-5 animate-spin" /> : <Users className="h-5 w-5 text-primary" />}
          </CardHeader>
          <CardContent>
             {loadingDevicesSummary ? <Loader2 className="h-8 w-8 animate-spin my-2" /> : connectedDevicesSummary ? (
              <>
                <div className="text-2xl font-bold">{onlineDevices} <span className="text-base font-normal text-muted-foreground">/ {totalDevices} total</span></div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalDevices > 0 ? ((onlineDevices / totalDevices) * 100).toFixed(0) : 0}% of devices online
                </p>
                <Progress value={totalDevices > 0 ? (onlineDevices / totalDevices) * 100 : 0} className="mt-2 h-2" />
              </>
             ) : <p className="text-muted-foreground">Could not load summary.</p>}
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Data Usage (3 Days)</CardTitle>
            {loadingUsage ? <Loader2 className="h-5 w-5 animate-spin" /> : <BarChartHorizontalBig className="h-5 w-5 text-accent" />}
          </CardHeader>
          <CardContent>
            {loadingUsage ? <Loader2 className="h-8 w-8 animate-spin my-2" /> : totalUsage ? (
                <>
                <div className="text-2xl font-bold">
                    {totalUsage.total.toFixed(1)} GB
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Overview of recent network consumption.
                </p>
                <div className="h-[60px] mt-2">
                    <ChartContainer config={chartConfigTotalUsage} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={totalUsage.data} layout="vertical" margin={{ left: -20, right:0, top:5, bottom:0 }}>
                        <CartesianGrid horizontal={false} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="time" type="category" tickLine={false} axisLine={false} hide/>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="value" fill="var(--color-usage)" radius={4} barSize={10} />
                        </BarChart>
                    </ResponsiveContainer>
                    </ChartContainer>
                </div>
                </>
            ) : <p className="text-muted-foreground">Could not load usage.</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle>Recent Devices Activity</CardTitle>
            <CardDescription>Top 3 most active devices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingRecent ? <div className="flex justify-center py-4"><Loader2 className="h-8 w-8 animate-spin" /></div> : 
            recentDevices.length > 0 ? recentDevices.map((device) => {
              const IconComponent = DEVICE_ICONS[device.deviceType as keyof typeof DEVICE_ICONS] || HelpCircle;
              return (
                <div key={device.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.manufacturer} {device.model}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <Badge variant={device.status === 'Online' ? 'default' : 'destructive'} className={device.status === 'Online' ? "bg-green-500 hover:bg-green-600 text-primary-foreground" : ""}>
                        {device.status}
                     </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{device.bandwidthUsage.download.toFixed(1)} Mbps Down</p>
                  </div>
                </div>
              );
            }) : <p className="text-muted-foreground text-center">No recent device activity or could not load data.</p>}
             <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/devices">View All Devices <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle>Device Type Distribution</CardTitle>
            <CardDescription>Breakdown of devices connected to your network.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[250px]">
             {loadingDistribution ? <Loader2 className="h-10 w-10 animate-spin" /> : deviceTypeData.length > 0 ? (
                <ChartContainer config={chartConfigDeviceTypes} className="w-full h-full aspect-square">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                        data={deviceTypeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5 + 15;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                            <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
                            {`${deviceTypeData[index].name} (${(percent * 100).toFixed(0)}%)`}
                            </text>
                        );
                        }}
                    >
                        {deviceTypeData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    </PieChart>
                </ResponsiveContainer>
                </ChartContainer>
             ): <p className="text-muted-foreground">No distribution data available.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

