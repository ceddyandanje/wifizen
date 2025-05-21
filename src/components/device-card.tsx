"use client";

import type { Device } from "@/types";
import { DEVICE_ICONS } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertCircle, Edit3, MoreVertical, Trash2, Wifi, WifiOff, Download, Upload, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RenameDeviceDialog } from "./rename-device-dialog";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface DeviceCardProps {
  device: Device;
  onForgetDevice: (deviceId: string) => void;
  onUpdateDeviceName: (deviceId: string, newName: string) => void;
}

export function DeviceCard({ device, onForgetDevice, onUpdateDeviceName }: DeviceCardProps) {
  const DeviceIcon = DEVICE_ICONS[device.deviceType] || AlertCircle;
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleForget = () => {
    onForgetDevice(device.id);
    toast({
        title: "Device Forgotten",
        description: `${device.name} has been removed from the list.`,
    });
  };
  
  const formatConnectionTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      <Card className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div className="flex items-center gap-3">
                <DeviceIcon className="h-10 w-10 text-primary" />
                <div>
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    <CardDescription className="text-xs">{device.manufacturer} {device.model}</CardDescription>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Forget Device
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={device.status === 'Online' ? 'default' : 'destructive'} 
                   className={device.status === 'Online' ? 'bg-green-500 hover:bg-green-600 text-primary-foreground' : ''}>
              {device.status === 'Online' ? <Wifi className="mr-1 h-3 w-3" /> : <WifiOff className="mr-1 h-3 w-3" />}
              {device.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">IP Address</span>
            <span>{device.ipAddress}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">MAC Address</span>
            <span>{device.macAddress}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center"><Download className="mr-1 h-3 w-3 text-blue-500"/> Usage Down</span>
            <span>{device.bandwidthUsage.download.toFixed(1)} Mbps</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center"><Upload className="mr-1 h-3 w-3 text-green-500"/> Usage Up</span>
            <span>{device.bandwidthUsage.upload.toFixed(1)} Mbps</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center"><Clock className="mr-1 h-3 w-3 text-gray-500"/> Conn. Time</span>
            <span>{formatConnectionTime(device.connectionTime)}</span>
          </div>
        </CardContent>
        <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setIsRenameDialogOpen(true)}>
                <Edit3 className="mr-2 h-4 w-4" /> Manage Device
            </Button>
        </CardFooter>
      </Card>

      <RenameDeviceDialog
        isOpen={isRenameDialogOpen}
        setIsOpen={setIsRenameDialogOpen}
        device={device}
        onUpdateDeviceName={onUpdateDeviceName}
      />
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to forget this device?</AlertDialogTitle>
          <AlertDialogDescription>
            Forgetting &quot;{device.name}&quot; will remove it from your list. You might need to re-authorize it on your router if you want to reconnect it later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleForget} className={buttonVariants({ variant: "destructive" })}>
            Forget Device
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  );
}

// Helper function to match buttonVariants for AlertDialogAction
const buttonVariants = Button.doNotUseThisPropToDetermineVariantsPlease;
