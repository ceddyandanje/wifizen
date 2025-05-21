
import { NextResponse, type NextRequest } from 'next/server';
import { MOCK_DEVICES } from '@/lib/mock-data';
import type { Device } from '@/types';

async function fetchDevicesFromRouter(): Promise<Device[]> {
  // 1. Try API
  try {
    const routerConfig = {
      host: process.env.ROUTER_HOST || '192.168.1.1',
      username: process.env.ROUTER_USERNAME,
      password: process.env.ROUTER_PASSWORD,
      apiEndpoint: process.env.ROUTER_API_ENDPOINT || '/api/devices'
    };

    const response = await fetch(`http://${routerConfig.host}${routerConfig.apiEndpoint}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${routerConfig.username}:${routerConfig.password}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (response.ok) {
      const routerData = await response.json();
      if (routerData.devices && Array.isArray(routerData.devices)) {
        return routerData.devices.map((device: any) => ({
          id: device.mac || `device-${Math.random().toString(36).substr(2, 9)}`,
          name: device.hostname || 'Unknown Device',
          type: determineDeviceType(device),
          status: device.connected ? 'Online' : 'Offline',
          ipAddress: device.ip || '',
          macAddress: device.mac || '',
          manufacturer: device.manufacturer || 'Unknown',
          connectedSince: device.connectedTime || new Date().toISOString(),
          bandwidthUsage: {
            download: device.downloadSpeed || 0,
            upload: device.uploadSpeed || 0
          },
          signalStrength: device.signalStrength || 0
        }));
      }
    }
  } catch (error) {
    // Continue to next method
  }

  // 2. Try UPnP (local network only)
  try {
    const { Client } = await import('node-ssdp');
    const devices: Device[] = [];
    const client = new Client();

    await new Promise<void>((resolve, reject) => {
      let found = false;
      client.on('response', (headers, statusCode, rinfo) => {
        found = true;
        devices.push({
          id: rinfo.address,
          name: headers.SERVER || 'UPnP Device',
          type: 'Unknown',
          status: 'Online',
          ipAddress: rinfo.address,
          macAddress: '', // Not available via UPnP SSDP
          manufacturer: headers.SERVER || 'Unknown',
          connectedSince: new Date().toISOString(),
          bandwidthUsage: { download: 0, upload: 0 },
          signalStrength: 0
        });
      });

      client.search('urn:schemas-upnp-org:device:InternetGatewayDevice:1');

      setTimeout(() => {
        client.stop();
        if (found) resolve();
        else reject(new Error('No UPnP devices found'));
      }, 2000);
    });

    if (devices.length > 0) return devices;
  } catch (error) {
    // Continue to next method
  }

  // 3. Try SNMP
  try {
    const snmp = await import('net-snmp');
    const session = snmp.createSession(process.env.ROUTER_HOST || '192.168.1.1', process.env.SNMP_COMMUNITY || 'public');
    const oid = '1.3.6.1.2.1.4.22.1.2'; // ARP table

    const snmpDevices: Device[] = await new Promise((resolve, reject) => {
      const devices: Device[] = [];
      session.subtree(oid, (varbind) => {
        if (snmp.isVarbindError(varbind)) return;
        devices.push({
          id: varbind.value.toString('hex'),
          name: 'SNMP Device',
          type: 'Unknown',
          status: 'Online',
          ipAddress: '', // Could extract from OID if needed
          macAddress: Array.isArray(varbind.value) ? varbind.value.join(':') : varbind.value.toString('hex'),
          manufacturer: 'Unknown',
          connectedSince: new Date().toISOString(),
          bandwidthUsage: { download: 0, upload: 0 },
          signalStrength: 0
        });
      }, (error) => {
        session.close();
        if (error) reject(error);
        else resolve(devices);
      });
    });

    if (snmpDevices.length > 0) return snmpDevices;
  } catch (error) {
    // Continue to fallback
  }

  // 4. Fallback to mock data
  return MOCK_DEVICES;
}

function determineDeviceType(device: any): string {
  // Logic to determine device type based on manufacturer, MAC, or other properties
  if (device.mac?.startsWith('00:11:22')) return 'Mobile';
  if (device.userAgent?.includes('TV')) return 'TV';
  // Add more device type detection logic
  return 'Unknown';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const sortBy = searchParams.get('sort'); // e.g., 'activity'

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  // Establish connection to the router and fetch device data
  let devices = await fetchDevicesFromRouter();
  
  // Simple sort: online first, then by download usage
  devices.sort((a, b) => {
    if (a.status === 'Online' && b.status !== 'Online') return -1;
    if (a.status !== 'Online' && b.status === 'Online') return 1;
    return (b.bandwidthUsage.download + b.bandwidthUsage.upload) - (a.bandwidthUsage.download + a.bandwidthUsage.upload);
  });
  
  // Add other sort options as needed based on router capabilities

  if (limit) {
    devices = devices.slice(0, parseInt(limit, 10));
  }
  
  return NextResponse.json({ devices });
}
