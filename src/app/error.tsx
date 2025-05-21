"use client"; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
      <h1 className="text-4xl font-bold text-foreground mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected issue. Please try again, or if the problem persists, contact support.
      </p>
      {error.message && (
        <p className="text-sm bg-muted text-muted-foreground p-3 rounded-md mb-6 max-w-xl overflow-auto">
          <code>Error: {error.message}</code>
        </p>
      )}
      <Button
        onClick={() => reset()}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Try Again
      </Button>
    </div>
  );
}
