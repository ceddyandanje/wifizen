
"use client";

import type { ReactNode } from 'react';
// import { useEffect } from 'react'; // Auth check removed
// import { useRouter } from 'next/navigation'; // Auth check removed
// import { useAuth } from '@/contexts/auth-context'; // AppHeader still uses this implicitly
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
// import { Loader2 } from 'lucide-react'; // Auth check removed
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  // const { user, loading } = useAuth(); // Auth check removed
  // const router = useRouter(); // Auth check removed

  // useEffect(() => { // Auth check removed
  //   if (!loading && !user) {
  //     router.replace('/login');
  //   }
  // }, [user, loading, router]);

  // if (loading || !user) { // Auth check removed
  //   return (
  //     <div className="flex h-screen w-screen items-center justify-center bg-background">
  //       <Loader2 className="h-12 w-12 animate-spin text-primary" />
  //     </div>
  //   );
  // }

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
