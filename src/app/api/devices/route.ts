
import { NextResponse, type NextRequest } from 'next/server';
import { MOCK_DEVICES } from '@/lib/mock-data';
import type { Device } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const sortBy = searchParams.get('sort'); // e.g., 'activity'

  let devices: Device[] = [...MOCK_DEVICES]; // Create a copy to sort/filter

  if (sortBy === 'activity') {
    // Simple sort: online first, then by download usage
    devices.sort((a, b) => {
      if (a.status === 'Online' && b.status !== 'Online') return -1;
      if (a.status !== 'Online' && b.status === 'Online') return 1;
      return (b.bandwidthUsage.download + b.bandwidthUsage.upload) - (a.bandwidthUsage.download + a.bandwidthUsage.upload);
    });
  }
  // Add other sort options as needed

  if (limit) {
    devices = devices.slice(0, parseInt(limit, 10));
  }
  
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  return NextResponse.json({ devices });
}
