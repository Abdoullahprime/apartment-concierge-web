'use client';
import { ErrorState } from '@/components/ui/ErrorState';

export default function Error({ reset }: { reset: () => void }) {
  return <div className="max-w-4xl mx-auto"><ErrorState onRetry={reset} /></div>;
}
