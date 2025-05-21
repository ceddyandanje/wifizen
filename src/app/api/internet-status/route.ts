import { NextResponse } from 'next/server';
import { MOCK_INTERNET_STATUS } from '@/lib/mock-data';
import type { InternetStatus } from '@/types';

async function fetchInternetStatus(): Promise<InternetStatus> {
  // 1. Try router API
  try {
    const routerConfig = {
      host: process.env.ROUTER_HOST || '192.168.1.1',
      username: process.env.ROUTER_USERNAME,
      password: process.env.ROUTER_PASSWORD,
      apiEndpoint: process.env.ROUTER_STATUS_API_ENDPOINT || '/api/status'
    };

    const response = await fetch(`http://${routerConfig.host}${routerConfig.apiEndpoint}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${routerConfig.username}:${routerConfig.password}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (response.ok) {
      const statusData = await response.json();
      // Adapt this mapping to your router's API response structure
      return {
        speed: {
          download: statusData.downloadSpeed || 0,
          upload: statusData.uploadSpeed || 0
        },
        health: statusData.health || 'Unknown'
      };
    }
  } catch (error) {
    // Continue to next method
  }

  // 2. Try SNMP
  try {
    const snmp = await import('net-snmp');
    const session = snmp.createSession(process.env.ROUTER_HOST || '192.168.1.1', process.env.SNMP_COMMUNITY || 'public');
    // OIDs for download/upload speeds may vary by router; these are examples
    const downloadOid = '1.3.6.1.2.1.2.2.1.10.2'; // ifInOctets for interface 2
    const uploadOid = '1.3.6.1.2.1.2.2.1.16.2';   // ifOutOctets for interface 2

    const [download, upload] = await new Promise<[number, number]>((resolve, reject) => {
      session.get([downloadOid, uploadOid], (error, varbinds) => {
        session.close();
        if (error) return reject(error);
        resolve([
          Number(varbinds[0]?.value) || 0,
          Number(varbinds[1]?.value) || 0
        ]);
      });
    });

    return {
      speed: {
        download,
        upload
      },
      health: 'Unknown' // SNMP may not provide health directly
    };
  } catch (error) {
    // Continue to next method
  }

  // 3. Try SSH
  try {
    const { Client } = await import('ssh2');
    const conn = new Client();
    const host = process.env.ROUTER_HOST || '192.168.1.1';
    const username = process.env.ROUTER_USERNAME;
    const password = process.env.ROUTER_PASSWORD;

    const result: InternetStatus = await new Promise((resolve, reject) => {
      conn.on('ready', () => {
        // Example command; replace with your router's CLI command for status
        conn.exec('show internet status', (err, stream) => {
          if (err) return reject(err);
          let data = '';
          stream.on('data', chunk => data += chunk.toString());
          stream.on('close', () => {
            // Parse output as needed
            // Example: extract download/upload from CLI output
            const download = /Download:\s*(\d+)/.exec(data)?.[1] || '0';
            const upload = /Upload:\s*(\d+)/.exec(data)?.[1] || '0';
            resolve({
              speed: {
                download: Number(download),
                upload: Number(upload)
              },
              health: 'Unknown'
            });
            conn.end();
          });
        });
      }).on('error', reject)
        .connect({ host, username, password });
    });

    return result;
  } catch (error) {
    // Continue to fallback
  }

  // 4. Fallback to mock data
  return {
    speed: MOCK_INTERNET_STATUS.speed,
    health: MOCK_INTERNET_STATUS.health,
  };
}

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const data = await fetchInternetStatus();
  return NextResponse.json(data);
}
