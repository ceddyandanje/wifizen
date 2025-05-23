
import type { Device, NetworkMetric, Subscription } from '@/types';
import { Laptop, Smartphone, Tablet, Tv2, Router as RouterIcon, ToyBrick, HelpCircle, Wifi, WifiOff, CloudLightning, ServerCrash } from 'lucide-react';

export const DEVICE_ICONS: Record<Device['deviceType'], React.ElementType> = {
  laptop: Laptop,
  smartphone: Smartphone,
  tablet: Tablet,
  'smart-tv': Tv2,
  router: RouterIcon,
  'iot-device': ToyBrick,
  unknown: HelpCircle,
};

export let MOCK_DEVICES: Device[] = [
  {
    id: '1',
    name: 'Living Room TV',
    ipAddress: '192.168.1.101',
    macAddress: '00:1A:2B:3C:4D:5E',
    status: 'Online',
    deviceType: 'smart-tv',
    manufacturer: 'Samsung',
    model: 'QLED Q80T',
    connectionTime: 125, // minutes
    bandwidthUsage: { download: 5.2, upload: 0.5 },
    userProvidedName: 'Living Room TV',
    icon: DEVICE_ICONS['smart-tv'],
  },
  {
    id: '2',
    name: 'John\'s MacBook Pro',
    ipAddress: '192.168.1.102',
    macAddress: '01:2B:3C:4D:5E:6F',
    status: 'Online',
    deviceType: 'laptop',
    manufacturer: 'Apple',
    model: 'MacBook Pro 16"',
    connectionTime: 340,
    bandwidthUsage: { download: 15.7, upload: 2.1 },
    icon: DEVICE_ICONS.laptop,
  },
  {
    id: '3',
    name: 'Jane\'s iPhone 15',
    ipAddress: '192.168.1.103',
    macAddress: '02:3C:4D:5E:6F:7G',
    status: 'Online',
    deviceType: 'smartphone',
    manufacturer: 'Apple',
    model: 'iPhone 15 Pro',
    connectionTime: 60,
    bandwidthUsage: { download: 2.3, upload: 0.8 },
    userProvidedName: 'Jane\'s iPhone',
    icon: DEVICE_ICONS.smartphone,
  },
  {
    id: '4',
    name: 'Kitchen Tablet',
    ipAddress: '192.168.1.104',
    macAddress: '03:4D:5E:6F:7G:8H',
    status: 'Offline',
    deviceType: 'tablet',
    manufacturer: 'Amazon',
    model: 'Fire HD 10',
    connectionTime: 0,
    bandwidthUsage: { download: 0, upload: 0 },
    icon: DEVICE_ICONS.tablet,
  },
  {
    id: '5',
    name: 'Smart Thermostat',
    ipAddress: '192.168.1.105',
    macAddress: '04:5E:6F:7G:8H:9I',
    status: 'Online',
    deviceType: 'iot-device',
    manufacturer: 'Google',
    model: 'Nest Thermostat',
    connectionTime: 1440, // 24 hours
    bandwidthUsage: { download: 0.1, upload: 0.1 },
    icon: DEVICE_ICONS['iot-device'],
  },
   {
    id: '6',
    name: 'Main Router',
    ipAddress: '192.168.1.1',
    macAddress: 'A1:B2:C3:D4:E5:F6',
    status: 'Online',
    deviceType: 'router',
    manufacturer: 'Huawei',
    model: 'XPON H123',
    connectionTime: 10080, // 7 days
    bandwidthUsage: { download: 0, upload: 0 }, // Router itself doesn't consume in this context
    userProvidedName: 'WifiZen Router',
    icon: DEVICE_ICONS.router,
  },
];

export let MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub1', name: 'Wifi Payment', paymentDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5) }, // Wifi payment, due soon
  { id: 'sub2', name: 'Netflix Premium', paymentDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15) },
  { id: 'sub3', name: 'Spotify Family', paymentDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) },
];


export const MOCK_INTERNET_STATUS = {
  speed: {
    download: 980.5, // Mbps
    upload: 450.2,   // Mbps
  },
  health: 'Stable' as 'Stable' | 'Intermittent' | 'Offline',
  icon: Wifi,
};

export const MOCK_NETWORK_METRICS: NetworkMetric[] = [
  {
    id: 'latency',
    name: 'Network Latency',
    unit: 'ms',
    data: [
      { time: '00:00', value: Math.floor(Math.random() * 10) + 5 },
      { time: '01:00', value: Math.floor(Math.random() * 10) + 5 },
      { time: '02:00', value: Math.floor(Math.random() * 10) + 5 },
      { time: '03:00', value: Math.floor(Math.random() * 10) + 5 },
      { time: '04:00', value: Math.floor(Math.random() * 10) + 5 },
      { time: '05:00', value: Math.floor(Math.random() * 10) + 5 },
      { time: '06:00', value: Math.floor(Math.random() * 10) + 5 },
    ],
  },
  {
    id: 'packetLoss',
    name: 'Packet Loss',
    unit: '%',
    data: [
      { time: '00:00', value: Math.random() * 0.5 },
      { time: '01:00', value: Math.random() * 0.5 },
      { time: '02:00', value: Math.random() * 0.5 },
      { time: '03:00', value: Math.random() * 0.5 },
      { time: '04:00', value: Math.random() * 0.5 },
      { time: '05:00', value: Math.random() * 0.5 },
      { time: '06:00', value: Math.random() * 0.5 },
    ],
  },
  {
    id: 'totalDownload',
    name: 'Total Download Usage',
    unit: 'GB',
    data: [
      { time: 'Mon', value: Math.floor(Math.random() * 20) + 10 },
      { time: 'Tue', value: Math.floor(Math.random() * 20) + 15 },
      { time: 'Wed', value: Math.floor(Math.random() * 20) + 12 },
      { time: 'Thu', value: Math.floor(Math.random() * 20) + 18 },
      { time: 'Fri', value: Math.floor(Math.random() * 20) + 25 },
      { time: 'Sat', value: Math.floor(Math.random() * 20) + 30 },
      { time: 'Sun', value: Math.floor(Math.random() * 20) + 22 },
    ]
  }
];


export const getMockDeviceById = (id: string): Device | undefined => MOCK_DEVICES.find(d => d.id === id);

export const updateMockDeviceName = (id: string, newName: string): boolean => {
  const deviceIndex = MOCK_DEVICES.findIndex(d => d.id === id);
  if (deviceIndex > -1) {
    MOCK_DEVICES[deviceIndex].name = newName;
    MOCK_DEVICES[deviceIndex].userProvidedName = newName;
    // To reflect changes if user is navigating between pages and MOCK_DEVICES is re-imported
    // This is a simple way to persist for the session in a mock environment
    // For a real app, this would be an API call.
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wifiZenDevices', JSON.stringify(MOCK_DEVICES));
    }
    return true;
  }
  return false;
};

export const forgetMockDevice = (id: string): boolean => {
  const initialLength = MOCK_DEVICES.length;
  MOCK_DEVICES = MOCK_DEVICES.filter(d => d.id !== id);
   if (typeof localStorage !== 'undefined' && MOCK_DEVICES.length !== initialLength) {
        localStorage.setItem('wifiZenDevices', JSON.stringify(MOCK_DEVICES));
    }
  return MOCK_DEVICES.length !== initialLength;
};

export const addMockSubscription = (subscription: Omit<Subscription, 'id'>): Subscription => {
  const newSub: Subscription = { ...subscription, id: `sub${Date.now()}`};
  MOCK_SUBSCRIPTIONS.push(newSub);
   if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wifiZenSubscriptions', JSON.stringify(MOCK_SUBSCRIPTIONS));
    }
  return newSub;
}

export const removeMockSubscription = (id: string): boolean => {
  const initialLength = MOCK_SUBSCRIPTIONS.length;
  MOCK_SUBSCRIPTIONS = MOCK_SUBSCRIPTIONS.filter(s => s.id !== id);
  if (typeof localStorage !== 'undefined' && MOCK_SUBSCRIPTIONS.length !== initialLength) {
        localStorage.setItem('wifiZenSubscriptions', JSON.stringify(MOCK_SUBSCRIPTIONS));
  }
  return MOCK_SUBSCRIPTIONS.length !== initialLength;
}

// Function to initialize mock data from localStorage or defaults
// This can be called in a global context or at the start of relevant pages
export const initializeMockData = () => {
  if (typeof localStorage !== 'undefined') {
    const storedDevices = localStorage.getItem('wifiZenDevices');
    if (storedDevices) {
      try {
        MOCK_DEVICES = JSON.parse(storedDevices).map((d: any) => ({
            ...d,
            // Ensure icon is rehydrated correctly if it's stored as string name
            icon: d.deviceType ? DEVICE_ICONS[d.deviceType as keyof typeof DEVICE_ICONS] || HelpCircle : HelpCircle,
        }));
      } catch (e) { console.error("Failed to parse devices from localStorage", e); }
    }

    const storedSubs = localStorage.getItem('wifiZenSubscriptions');
    if (storedSubs) {
       try {
        MOCK_SUBSCRIPTIONS = JSON.parse(storedSubs).map((s: any) => ({...s, paymentDate: new Date(s.paymentDate)}));
      } catch (e) { console.error("Failed to parse subscriptions from localStorage", e); }
    }
  }
};

// Call initialization when this module is loaded.
// This is a simple way to ensure data is loaded from localStorage if available.
// initializeMockData(); // Removed direct call to avoid issues in server components if not guarded

