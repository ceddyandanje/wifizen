
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
  icon?: LucideIcon; // This will be difficult to serialize/deserialize if fetched from an API, consider string icon name
}

export interface Subscription {
  id: string;
  name: string;
  paymentDate: Date; // Will be string if fetched from API, needs conversion
}

export interface NetworkMetricDataPoint {
  time: string; // e.g., "10:00" or "Mon"
  value: number;
}

export interface NetworkMetric {
  id: string;
  name: string;
  data: NetworkMetricDataPoint[];
  unit: string;
}

export interface InternetStatus {
  speed: {
    download: number; // Mbps
    upload: number;   // Mbps
  };
  health: 'Stable' | 'Intermittent' | 'Offline';
  // Icon can be determined on client-side based on health
}

export interface DeviceTypeDistribution {
  type: Device['deviceType'];
  count: number;
}
