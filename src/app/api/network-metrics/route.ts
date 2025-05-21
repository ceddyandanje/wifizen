
import { NextResponse, type NextRequest } from 'next/server';
import { MOCK_NETWORK_METRICS } from '@/lib/mock-data';
import type { NetworkMetric } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange'); // e.g., 'last-hour', 'last-24-hours'

  // In a real app, you'd filter/fetch data based on timeRange
  // For this mock, we'll return all metrics regardless of timeRange for simplicity
  let metrics: NetworkMetric[] = [...MOCK_NETWORK_METRICS];

  // Example: if timeRange was 'last-hour', you might modify the data points
  // For now, just returning the full set.
  
  await new Promise(resolve => setTimeout(resolve, 900)); // Simulate network delay
  return NextResponse.json({ metrics });
}
