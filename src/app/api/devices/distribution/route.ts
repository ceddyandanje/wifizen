
import { NextResponse } from 'next/server';
import { MOCK_DEVICES } from '@/lib/mock-data';
import type { Device, DeviceTypeDistribution } from '@/types';

export async function GET() {
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

  await new Promise(resolve => setTimeout(resolve, 750)); // Simulate network delay
  return NextResponse.json(distribution);
}
