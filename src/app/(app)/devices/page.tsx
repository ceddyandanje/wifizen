"use client";

import { useState, useMemo } from "react";
import type { Device } from "@/types";
import { MOCK_DEVICES, updateMockDeviceName, forgetMockDevice as apiForgetDevice } from "@/lib/mock-data";
import { DeviceCard } from "@/components/device-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ListFilter, LayoutGrid, LayoutList, ArrowDownUp } from "lucide-react";
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

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Online" | "Offline">("all");
  const [sortOption, setSortOption] = useState<"name-asc" | "name-desc" | "status" | "connectionTime-desc">("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");


  const handleUpdateDeviceName = (deviceId: string, newName: string) => {
    updateMockDeviceName(deviceId, newName); // This updates the mock data in-place
    setDevices(prevDevices => 
      prevDevices.map(d => d.id === deviceId ? { ...d, name: newName, userProvidedName: newName } : d)
    );
  };

  const handleForgetDevice = (deviceId: string) => {
    apiForgetDevice(deviceId); // This updates the mock data in-place
    setDevices(prevDevices => prevDevices.filter(d => d.id !== deviceId));
  };
  
  const filteredAndSortedDevices = useMemo(() => {
    let processedDevices = devices.filter(device => {
      const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            device.ipAddress.includes(searchTerm) ||
                            device.macAddress.toLowerCase().includes(searchTerm.toLowerCase());
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
         processedDevices.sort((a,b) => b.connectionTime - a.connectionTime);
         break;
    }
    return processedDevices;
  }, [devices, searchTerm, filterStatus, sortOption]);

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
                    <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
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
