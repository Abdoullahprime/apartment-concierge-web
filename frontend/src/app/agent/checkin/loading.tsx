import { CardSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Skeleton className="h-7 w-48" />
      {[1, 2].map((i) => <CardSkeleton key={i} />)}
    </div>
  );
}
