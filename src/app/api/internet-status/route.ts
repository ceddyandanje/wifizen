
import { NextResponse } from 'next/server';
import { MOCK_INTERNET_STATUS } from '@/lib/mock-data';
import type { InternetStatus } from '@/types';

export async function GET() {
  // In a real app, you'd fetch this from your router/backend
  const data: InternetStatus = {
    speed: MOCK_INTERNET_STATUS.speed,
    health: MOCK_INTERNET_STATUS.health,
  };
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return NextResponse.json(data);
}
