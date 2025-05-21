
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/auth-context'; // No longer strictly needed for redirection logic
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  // const { user, loading } = useAuth(); // Commented out or remove if not used otherwise
  const router = useRouter();

  useEffect(() => {
    // Always redirect to dashboard, bypassing login for development
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
