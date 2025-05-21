
import { NextResponse } from 'next/server';
import { MOCK_DEVICES } from '@/lib/mock-data';

export async function GET() {
  const online = MOCK_DEVICES.filter(d => d.status === 'Online').length;
  const total = MOCK_DEVICES.length;
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network delay
  return NextResponse.json({ online, total });
}
