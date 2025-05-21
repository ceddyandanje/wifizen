import type { LucideIcon } from 'lucide-react';

export interface Device {
  id: string;
  name: string;
  ipAddress: string;
  macAddress: string;
  status: 'Online' | 'Offline';
  deviceType: 'laptop' | 'smartphone' | 'tablet' | 'smart-tv' | 'router' | 'iot-device' | 'unknown';
  manufacturer: string;
  model: string;
  connectionTime: number; // minutes
  bandwidthUsage: {
    download: number; // Mbps
    upload: number; // Mbps
  };
  userProvidedName?: string;
  icon?: LucideIcon;
}

export interface Subscription {
  id: string;
  name: string;
  paymentDate: Date;
}

export interface NetworkMetricDataPoint {
  time: string; // e.g., "10:00"
  value: number;
}

export interface NetworkMetric {
  id: string;
  name: string; // e.g., "Latency (ms)", "Packet Loss (%)", "Upload Speed (Mbps)", "Download Speed (Mbps)"
  data: NetworkMetricDataPoint[];
  unit: string;
}
