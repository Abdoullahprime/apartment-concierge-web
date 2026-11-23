import { cn } from '@/lib/utils';

interface SkeletonProps { className?: string }

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-[#EBEBEB]',
        className,
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3.5 w-48" />
      <Skeleton className="h-3.5 w-24" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-[#F5F5F5]">
      {[140, 120, 100, 80, 60].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className={`h-3.5 w-${w}`} style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

export function StatTileSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <Skeleton className="h-3.5 w-20" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}
