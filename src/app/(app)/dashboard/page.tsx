
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_DEVICES, MOCK_INTERNET_STATUS, MOCK_NETWORK_METRICS, DEVICE_ICONS } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wifi, Users, BarChartHorizontalBig, Signal, AlertTriangle, Download, Upload, WifiOff, Thermometer, Zap, HelpCircle } from "lucide-react";
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
};


export default function DashboardPage() {
  const onlineDevices = MOCK_DEVICES.filter(d => d.status === 'Online').length;
  const totalDevices = MOCK_DEVICES.length;

  const totalUsageData = MOCK_NETWORK_METRICS.find(m => m.id === 'totalDownload')?.data.slice(0, 3) || []; // Show last 3 days for brevity
  const deviceTypeCounts = MOCK_DEVICES.reduce((acc, device) => {
    const type = device.deviceType in chartConfigDeviceTypes ? device.deviceType : 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceTypeData = Object.entries(deviceTypeCounts).map(([name, value]) => ({
    name: chartConfigDeviceTypes[name as keyof typeof chartConfigDeviceTypes]?.label || name,
    value,
    fill: chartConfigDeviceTypes[name as keyof typeof chartConfigDeviceTypes]?.color || chartConfigDeviceTypes.other.color,
  }));


  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internet Status</CardTitle>
            {MOCK_INTERNET_STATUS.health === 'Stable' ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-destructive" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_INTERNET_STATUS.health}
            </div>
            <div className="flex space-x-4 text-xs text-muted-foreground mt-1">
                <div className="flex items-center">
                    <Download className="h-3 w-3 mr-1 text-blue-500"/> {MOCK_INTERNET_STATUS.speed.download.toFixed(1)} Mbps
                </div>
                <div className="flex items-center">
                    <Upload className="h-3 w-3 mr-1 text-green-500"/> {MOCK_INTERNET_STATUS.speed.upload.toFixed(1)} Mbps
                </div>
            </div>
             <Progress value={(MOCK_INTERNET_STATUS.speed.download / 1000) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Devices</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineDevices} <span className="text-base font-normal text-muted-foreground">/ {totalDevices} total</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalDevices > 0 ? ((onlineDevices / totalDevices) * 100).toFixed(0) : 0}% of devices online
            </p>
            <Progress value={totalDevices > 0 ? (onlineDevices / totalDevices) * 100 : 0} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Data Usage (3 Days)</CardTitle>
            <BarChartHorizontalBig className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">
              {totalUsageData.reduce((sum, item) => sum + item.value, 0).toFixed(1)} GB
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Overview of recent network consumption.
            </p>
             <div className="h-[60px] mt-2">
              <ChartContainer config={chartConfigTotalUsage} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={totalUsageData} layout="vertical" margin={{ left: -20, right:0, top:5, bottom:0 }}>
                    <CartesianGrid horizontal={false} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="time" type="category" tickLine={false} axisLine={false} hide/>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="value" fill="var(--color-usage)" radius={4} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
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
            {MOCK_DEVICES.slice(0, 3).map((device) => {
              const IconComponent = device.icon || HelpCircle;
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
            })}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

