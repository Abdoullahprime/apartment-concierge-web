import { CardSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-11 w-full rounded-xl" />
      {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
    </div>
  );
}
