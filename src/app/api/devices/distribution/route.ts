
import { NextResponse } from 'next/server';
import { MOCK_DEVICES } from '@/lib/mock-data';
import type { Device, DeviceTypeDistribution } from '@/types';

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 750));

  // TODO: Replace with actual router data fetching logic for device type distribution.
  // This section will involve:
  // 1. Establishing a connection to your router (e.g., via its API, SNMP, SSH, or web scraping).
  // 2. Querying the router for the list of all connected devices and their types.
  // 3. Parsing the router's response.
  // 4. Aggregating the counts for each device type.
  // 5. Transforming the data into the DeviceTypeDistribution[] format.
  // For now, we are returning mock data derived from MOCK_DEVICES.

  const counts: Record<Device['deviceType'], number> = {
    'laptop': 0,
    'smartphone': 0,
    'tablet': 0,
    'smart-tv': 0,
    'router': 0,
    'iot-device': 0,
    'unknown': 0,
  };

  MOCK_DEVICES.forEach(device => {
    if (counts[device.deviceType] !== undefined) {
      counts[device.deviceType]++;
    } else {
      counts.unknown++; // Fallback for any new types not in the initial counts
    }
  });

  const distribution: DeviceTypeDistribution[] = Object.entries(counts)
    .map(([type, count]) => ({ type: type as Device['deviceType'], count }))
    .filter(item => item.count > 0); // Only return types that exist

  return NextResponse.json(distribution);
}
