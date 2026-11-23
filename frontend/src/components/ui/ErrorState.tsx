interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Failed to load',
  message = 'There was a problem fetching this data. Check your connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-12 text-center space-y-3">
      <div className="text-4xl">⚠️</div>
      <p className="font-semibold text-[#333333]">{title}</p>
      <p className="text-sm text-[#757575] max-w-xs mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 border border-[#E0E0E0] text-[#333333] text-sm font-semibold rounded-xl px-5 py-2 hover:bg-[#F5F5F5] transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
