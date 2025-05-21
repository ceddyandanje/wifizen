
import { NextResponse, type NextRequest } from 'next/server';
import { MOCK_DEVICES, updateMockDeviceName, forgetMockDevice } from '@/lib/mock-data'; // We won't modify global MOCK_DEVICES here directly to avoid issues, client will call these.

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const { name } = body;

  // In a real API, you'd update your database here.
  // For this mock, we just simulate success if the device ID could be found.
  // The actual data update happens client-side via imported mock functions for now.
  const deviceExists = MOCK_DEVICES.some(d => d.id === id);

  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

  if (deviceExists && name) {
    // updateMockDeviceName(id, name); // Don't call here for API route, client does this
    return NextResponse.json({ message: `Device ${id} name updated to ${name}` });
  }
  return NextResponse.json({ error: 'Device not found or name not provided' }, { status: 404 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  // In a real API, you'd delete from your database here.
  // The actual data update happens client-side via imported mock functions for now.
  const deviceExists = MOCK_DEVICES.some(d => d.id === id);
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

  if (deviceExists) {
    // forgetMockDevice(id); // Don't call here for API route, client does this
    return NextResponse.json({ message: `Device ${id} forgotten` });
  }
  return NextResponse.json({ error: 'Device not found' }, { status: 404 });
}
