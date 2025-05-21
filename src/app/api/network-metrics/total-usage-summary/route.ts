
import { NextResponse } from 'next/server';
import { MOCK_NETWORK_METRICS } from '@/lib/mock-data';
import type { NetworkMetricDataPoint } from '@/types';

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));

  // TODO: Replace with actual router data fetching logic for total usage summary.
  // This section will involve:
  // 1. Establishing a connection to your router (e.g., via its API, SNMP, SSH, or web scraping).
  // 2. Querying the router for total data usage (e.g., download) over a recent period (e.g., last 3 days).
  // 3. Parsing the router's response.
  // 4. Calculating the total and preparing a few data points for the summary chart.
  // 5. Transforming the data into the { total: number, data: NetworkMetricDataPoint[] } format.
  // For now, we are returning mock data derived from MOCK_NETWORK_METRICS.

  const totalDownloadMetric = MOCK_NETWORK_METRICS.find(m => m.id === 'totalDownload');
  
  let data: NetworkMetricDataPoint[] = [];
  let total = 0;

  if (totalDownloadMetric) {
    // For dashboard, let's take last 3 days (or data points), similar to original dashboard logic
    // In a real scenario, the router would provide data for specific timeframes or aggregated values.
    data = totalDownloadMetric.data.slice(-3).map(d => ({ time: d.time, value: d.value }));
    total = data.reduce((sum, item) => sum + item.value, 0);
  }
  
  return NextResponse.json({ total, data });
}
