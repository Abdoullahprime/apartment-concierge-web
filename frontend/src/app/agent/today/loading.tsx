import { CardSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-7 w-44 animate-pulse bg-[#E0E0E0] rounded-xl" />
        <div className="h-6 w-24 animate-pulse bg-[#E0E0E0] rounded-full" />
      </div>
      {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
    </div>
  );
}
