
import { NextResponse, type NextRequest } from 'next/server';
import { MOCK_DEVICES } from '@/lib/mock-data';
import type { Device } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const sortBy = searchParams.get('sort'); // e.g., 'activity'

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // TODO: Replace with actual router data fetching logic for connected devices.
  // This section will involve:
  // 1. Establishing a connection to your router (e.g., via its API, SNMP, SSH, or web scraping).
  // 2. Querying the router for the list of connected devices, their status, IP, MAC, manufacturer, model, etc.
  // 3. Parsing the router's response.
  // 4. Transforming the data into the Device[] format.
  // 5. Implementing filtering and sorting based on query parameters (limit, sortBy) if not handled by the router itself.
  // For now, we are returning mock data from MOCK_DEVICES with basic sorting/limiting.

  let devices: Device[] = [...MOCK_DEVICES]; // Create a copy to sort/filter

  if (sortBy === 'activity') {
    // Simple sort: online first, then by download usage
    devices.sort((a, b) => {
      if (a.status === 'Online' && b.status !== 'Online') return -1;
      if (a.status !== 'Online' && b.status === 'Online') return 1;
      return (b.bandwidthUsage.download + b.bandwidthUsage.upload) - (a.bandwidthUsage.download + a.bandwidthUsage.upload);
    });
  }
  // Add other sort options as needed based on router capabilities

  if (limit) {
    devices = devices.slice(0, parseInt(limit, 10));
  }
  
  return NextResponse.json({ devices });
}
