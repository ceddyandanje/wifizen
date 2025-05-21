
import { NextResponse } from 'next/server';
import { MOCK_DEVICES } from '@/lib/mock-data';

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // TODO: Replace with actual router data fetching logic for device summary.
  // This section will involve:
  // 1. Establishing a connection to your router (e.g., via its API, SNMP, SSH, or web scraping).
  // 2. Querying the router for the count of online devices and total connected/known devices.
  // 3. Parsing the router's response.
  // 4. Returning the 'online' and 'total' counts.
  // For now, we are returning mock data derived from MOCK_DEVICES.

  const online = MOCK_DEVICES.filter(d => d.status === 'Online').length;
  const total = MOCK_DEVICES.length;
  
  return NextResponse.json({ online, total });
}
