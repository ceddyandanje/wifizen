"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Device } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Wand2 } from "lucide-react";
import { suggestDeviceName } from "@/ai/flows/suggest-device-name"; // Import the AI function
import { useToast } from "@/hooks/use-toast";

interface RenameDeviceDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  device: Device;
  onUpdateDeviceName: (deviceId: string, newName: string) => void;
}

const renameFormSchema = z.object({
  name: z.string().min(1, "Device name cannot be empty.").max(50, "Device name too long."),
});

type RenameFormValues = z.infer<typeof renameFormSchema>;

export function RenameDeviceDialog({ isOpen, setIsOpen, device, onUpdateDeviceName }: RenameDeviceDialogProps) {
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<RenameFormValues>({
    resolver: zodResolver(renameFormSchema),
    defaultValues: {
      name: device.userProvidedName || device.name,
    },
  });

  useEffect(() => {
    if (device) {
      form.reset({ name: device.userProvidedName || device.name });
    }
  }, [device, form, isOpen]);

  const handleSuggestName = async () => {
    setIsAISuggesting(true);
    try {
      const suggestion = await suggestDeviceName({
        deviceType: device.deviceType,
        manufacturer: device.manufacturer,
        model: device.model,
        userProvidedName: device.userProvidedName || device.name,
      });
      if (suggestion.suggestedName) {
        form.setValue("name", suggestion.suggestedName);
        toast({ title: "AI Suggestion", description: `Suggested name: ${suggestion.suggestedName}`});
      } else {
        toast({ variant: "default", title: "AI Suggestion", description: "AI could not suggest a new name, or current name is good."});
      }
    } catch (error) {
      console.error("Error suggesting device name:", error);
      toast({ variant: "destructive", title: "AI Error", description: "Could not get AI suggestion."});
    } finally {
      setIsAISuggesting(false);
    }
  };

  function onSubmit(values: RenameFormValues) {
    onUpdateDeviceName(device.id, values.name);
    toast({ title: "Device Renamed", description: `Device successfully renamed to "${values.name}".`});
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Device</DialogTitle>
          <DialogDescription>
            Update the name for &quot;{device.name}&quot;. You can also ask AI for a suggestion.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="E.g., Living Room TV" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleSuggestName}
                      disabled={isAISuggesting}
                      aria-label="Suggest Name with AI"
                    >
                      {isAISuggesting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Name</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
