"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Moon, Sun, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of WifiZen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-base font-medium">Theme</Label>
            <p className="text-sm text-muted-foreground">Select your preferred color scheme.</p>
          </div>
          <RadioGroup
            id="theme"
            value={theme}
            onValueChange={setTheme}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <Label
              htmlFor="light"
              className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <Sun className="mb-3 h-6 w-6" />
              Light
            </Label>
            <Label
              htmlFor="dark"
              className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <RadioGroupItem value="dark" id="dark" className="sr-only" />
              <Moon className="mb-3 h-6 w-6" />
              Dark
            </Label>
            <Label
              htmlFor="system"
              className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <RadioGroupItem value="system" id="system" className="sr-only" />
              <Monitor className="mb-3 h-6 w-6" />
              System
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>
      
      {/* Placeholder for future settings, like card view toggle if desired */}
      {/*
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>View Preferences</CardTitle>
          <CardDescription>Adjust how information is displayed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="card-view" className="text-base font-medium">Use Card Layout</Label>
              <p className="text-sm text-muted-foreground">Toggle between card and list views for device lists.</p>
            </div>
            <Switch id="card-view" checked={true} disabled />
          </div>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
