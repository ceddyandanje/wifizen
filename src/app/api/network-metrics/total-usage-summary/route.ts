
import { NextResponse } from 'next/server';
import { MOCK_NETWORK_METRICS } from '@/lib/mock-data';
import type { NetworkMetricDataPoint } from '@/types';

export async function GET() {
  // Simulate fetching and preparing summary data for the dashboard card
  const totalDownloadMetric = MOCK_NETWORK_METRICS.find(m => m.id === 'totalDownload');
  
  let data: NetworkMetricDataPoint[] = [];
  let total = 0;

  if (totalDownloadMetric) {
    // For dashboard, let's take last 3 days, similar to original dashboard logic
    data = totalDownloadMetric.data.slice(-3).map(d => ({ time: d.time, value: d.value }));
    total = data.reduce((sum, item) => sum + item.value, 0);
  }
  
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay
  return NextResponse.json({ total, data });
}
