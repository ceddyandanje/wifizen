import { NextResponse } from 'next/server';
import { MOCK_INTERNET_STATUS } from '@/lib/mock-data';
import type { InternetStatus } from '@/types';

const API_TIMEOUT = Number(process.env.ROUTER_API_TIMEOUT) || 5000; // ms
const SSH_TIMEOUT = Number(process.env.ROUTER_SSH_TIMEOUT) || 10000; // ms

let cachedStatus: InternetStatus | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30000; // 30 seconds in ms

function determineHealthStatus(download: number, upload: number): 'Stable' | 'Intermittent' | 'Offline' {
  if (download === 0 && upload === 0) return 'Offline';
  if (download < 10 || upload < 5) return 'Intermittent'; // Thresholds in Mbps
  return 'Stable';
}

async function fetchInternetStatus(): Promise<InternetStatus> {
  // 1. Try router API
  try {
    console.log("Attempting to fetch internet status via Router API");
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
      cache: 'no-store',
      signal: AbortSignal.timeout(API_TIMEOUT) // 5 second timeout
    });

    if (response.ok) {
      const statusData = await response.json();
      const download = statusData.downloadSpeed || 0;
      const upload = statusData.uploadSpeed || 0;
      return {
        speed: {
          download,
          upload
        },
        health: statusData.health || determineHealthStatus(download, upload)
      };
    }
  } catch (error) {
    console.error("Router API fetch failed:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { 
        error: "Failed to retrieve internet status", 
        details: error instanceof Error ? error.message : String(error),
        source: "router_api"
      },
      { status: 500 }
    );
  }

  // 2. Try SNMP
  try {
    console.log("Attempting to fetch internet status via SNMP");
    const snmp = await import('net-snmp');
    const session = snmp.createSession(process.env.ROUTER_HOST || '192.168.1.1', process.env.SNMP_COMMUNITY || 'public');
    // OIDs for download/upload speeds may vary by router; these are examples
    const downloadOid = '1.3.6.1.2.1.2.2.1.10.2'; // ifInOctets for interface 2
    const uploadOid = '1.3.6.1.2.1.2.2.1.16.2';   // ifOutOctets for interface 2

    const [download, upload] = await new Promise<[number, number]>((resolve, reject) => {
      session.get([downloadOid, uploadOid], (error, varbinds) => {
        session.close();
        if (error) return reject(error);

        // Convert from bytes to Mbps (assuming values are bytes/sec)
        const bytesToMbps = (bytes: number) => (bytes * 8) / 1000000;

        resolve([
          bytesToMbps(Number(varbinds[0]?.value) || 0),
          bytesToMbps(Number(varbinds[1]?.value) || 0)
        ]);
      });
    });

    return {
      speed: {
        download,
        upload
      },
      health: determineHealthStatus(download, upload)
    };
  } catch (error) {
    console.error("SNMP fetch failed:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { 
        error: "Failed to retrieve internet status", 
        details: error instanceof Error ? error.message : String(error),
        source: "snmp"
      },
      { status: 500 }
    );
  }

  // 3. Try SSH
  try {
    console.log("Attempting to fetch internet status via SSH");
    const { Client } = await import('ssh2');
    const conn = new Client();
    const host = process.env.ROUTER_HOST || '192.168.1.1';
    const username = process.env.ROUTER_USERNAME;
    const password = process.env.ROUTER_PASSWORD;

    const result: InternetStatus = await new Promise((resolve, reject) => {
      const sshTimeout = setTimeout(() => {
        conn.end();
        reject(new Error("SSH connection timed out"));
      }, SSH_TIMEOUT); // 10 second timeout

      conn.on('ready', () => {
        clearTimeout(sshTimeout);
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
              health: determineHealthStatus(Number(download), Number(upload))
            });
            conn.end();
          });
        });
      }).on('error', reject)
        .connect({ host, username, password });
    });

    return result;
  } catch (error) {
    console.log("Falling back to mock internet status data");
    console.error("SSH fetch failed:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { 
        error: "Failed to retrieve internet status", 
        details: error instanceof Error ? error.message : String(error),
        source: "ssh"
      },
      { status: 500 }
    );
  }
  
  // Fallback to mock data if all methods fail
  console.log("All connection methods failed, using mock data");
  return {
    speed: MOCK_INTERNET_STATUS.speed,
    health: MOCK_INTERNET_STATUS.health,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  
  // Check if we have a valid cached result and aren't forcing a refresh
  const now = Date.now();
  if (!forceRefresh && cachedStatus && (now - cacheTimestamp) < CACHE_TTL) {
    return NextResponse.json(cachedStatus);
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Fetch fresh data
  const data = await fetchInternetStatus();
  
  // Update cache
  cachedStatus = data;
  cacheTimestamp = now;
  
  return NextResponse.json(data);
}