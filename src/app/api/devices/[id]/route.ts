
import { NextResponse, type NextRequest } from 'next/server';
import { MOCK_DEVICES, updateMockDeviceName, forgetMockDevice } from '@/lib/mock-data';
import type { Device } from '@/types';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const { name } = body;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // TODO: Replace with actual router data processing logic for updating a device name.
  // This section would typically involve:
  // 1. Receiving the device ID and new name.
  // 2. Communicating with the router (if it supports renaming devices directly) or updating a persistent data store.
  // 3. Verifying the operation was successful.
  // 4. Returning an appropriate success or error response.
  // For this mock API, we're simulating the update based on MOCK_DEVICES.
  // The actual update to MOCK_DEVICES is done client-side for this prototype
  // in a real scenario, this API would be the source of truth.

  const deviceIndex = MOCK_DEVICES.findIndex(d => d.id === id);

  if (deviceIndex > -1 && name) {
    // Simulating successful update acknowledgement.
    // In a real backend, you'd update your data store here.
    // updateMockDeviceName(id, name); // This function is called client-side in the current mock setup.
    return NextResponse.json({ message: `Device ${id} name updated to ${name} (simulated)` });
  }
  return NextResponse.json({ error: 'Device not found or name not provided' }, { status: 404 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // TODO: Replace with actual router data processing logic for forgetting/deleting a device.
  // This section would typically involve:
  // 1. Receiving the device ID.
  // 2. Communicating with the router to block/remove the device (if supported) or updating a persistent data store.
  // 3. Verifying the operation was successful.
  // 4. Returning an appropriate success or error response.
  // For this mock API, we're simulating the deletion based on MOCK_DEVICES.
  // The actual update to MOCK_DEVICES is done client-side for this prototype.

  const deviceExists = MOCK_DEVICES.some(d => d.id === id);

  if (deviceExists) {
    // Simulating successful deletion acknowledgement.
    // In a real backend, you'd update your data store here.
    // forgetMockDevice(id); // This function is called client-side in the current mock setup.
    return NextResponse.json({ message: `Device ${id} forgotten (simulated)` });
  }
  return NextResponse.json({ error: 'Device not found' }, { status: 404 });
}
