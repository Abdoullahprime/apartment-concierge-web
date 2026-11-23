import { CardSkeleton, StatTileSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="h-8 w-36 animate-pulse bg-[#E0E0E0] rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <StatTileSkeleton key={i} />)}
      </div>
      <CardSkeleton />
    </div>
  );
}
