
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Device } from "@/types";
import { updateMockDeviceName, forgetMockDevice as apiForgetDeviceFromMock } from "@/lib/mock-data"; // Keep for underlying data manipulation
import { DeviceCard } from "@/components/device-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ListFilter, LayoutGrid, LayoutList, ArrowDownUp, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Online" | "Offline">("all");
  const [sortOption, setSortOption] = useState<"name-asc" | "name-desc" | "status" | "connectionTime-desc">("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDevices() {
      try {
        setLoading(true);
        const response = await fetch('/api/devices');
        if (!response.ok) throw new Error('Failed to fetch devices');
        const data = await response.json();
        setDevices(data.devices || []); // Assuming API returns { devices: Device[] }
      } catch (error) {
        console.error("Failed to fetch devices:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load devices." });
        setDevices([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    }
    fetchDevices();
  }, [toast]);


  const handleUpdateDeviceName = async (deviceId: string, newName: string) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) throw new Error('Failed to update device name via API');
      
      // Update mock data and local state (simulating backend persistence)
      updateMockDeviceName(deviceId, newName); 
      setDevices(prevDevices => 
        prevDevices.map(d => d.id === deviceId ? { ...d, name: newName, userProvidedName: newName } : d)
      );
      // Toast is handled in RenameDeviceDialog
    } catch (error) {
      console.error("API Error updating device name:", error);
      toast({ variant: "destructive", title: "API Error", description: "Could not update device name on server." });
    }
  };

  const handleForgetDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to forget device via API');

      // Update mock data and local state (simulating backend persistence)
      apiForgetDeviceFromMock(deviceId); 
      setDevices(prevDevices => prevDevices.filter(d => d.id !== deviceId));
      // Toast is handled in DeviceCard
    } catch (error) {
        console.error("API Error forgetting device:", error);
        toast({ variant: "destructive", title: "API Error", description: "Could not forget device on server." });
    }
  };
  
  const filteredAndSortedDevices = useMemo(() => {
    let processedDevices = [...devices].filter(device => {
      const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (device.ipAddress && device.ipAddress.includes(searchTerm)) ||
                            (device.macAddress && device.macAddress.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === "all" || device.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    switch (sortOption) {
      case "name-asc":
        processedDevices.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        processedDevices.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "status":
        processedDevices.sort((a, b) => (a.status === "Online" ? -1 : 1) - (b.status === "Online" ? -1 : 1) || a.name.localeCompare(b.name));
        break;
      case "connectionTime-desc":
         processedDevices.sort((a,b) => (b.connectionTime || 0) - (a.connectionTime || 0));
         break;
    }
    return processedDevices;
  }, [devices, searchTerm, filterStatus, sortOption]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Connected Devices</h1>
            <p className="text-muted-foreground">Manage all devices on your network.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <LayoutList className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            <span className="sr-only">Toggle View Mode</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg shadow-sm bg-card">
        <Input
          placeholder="Search devices (name, IP, MAC...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <div className="flex gap-2 items-center">
            <Select value={filterStatus} onValueChange={(value: "all" | "Online" | "Offline") => setFilterStatus(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
            </Select>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="shrink-0">
                        <ArrowDownUp className="mr-2 h-4 w-4" /> Sort By
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as any)}>
                        <DropdownMenuRadioItem value="name-asc">Name (A-Z)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="name-desc">Name (Z-A)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="status">Status (Online First)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="connectionTime-desc">Connection Time (Longest)</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {filteredAndSortedDevices.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No devices match your criteria.</p>
        </div>
      ) : (
        <div className={cn(
            "gap-6",
            viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"
        )}>
          {filteredAndSortedDevices.map(device => (
            <DeviceCard 
                key={device.id} 
                device={device} 
                onUpdateDeviceName={handleUpdateDeviceName}
                onForgetDevice={handleForgetDevice} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
