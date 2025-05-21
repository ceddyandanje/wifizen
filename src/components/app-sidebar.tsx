"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, SettingsIcon, Smartphone, Wifi, CreditCard, BarChart3, SidebarClose } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"; // Using the provided advanced sidebar
import { Button } from "./ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/devices", label: "Devices", icon: Smartphone },
  { href: "/subscription", label: "Subscription", icon: CreditCard },
  { href: "/network-metrics", label: "Network Metrics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();


  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpenMobile(false)}>
          <Wifi className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            WifiZen
          </span>
        </Link>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpenMobile(false)}>
            <SidebarClose />
            <span className="sr-only">Close sidebar</span>
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
                  onClick={() => setOpenMobile(false)}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} WifiZen</p>
      </SidebarFooter>
    </Sidebar>
  );
}
