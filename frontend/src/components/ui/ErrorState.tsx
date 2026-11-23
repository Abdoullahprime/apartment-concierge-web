interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn\'t load this content. Try refreshing.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-10 flex flex-col items-center text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] flex items-center justify-center mb-4 text-[#C62828]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-[#333333] mb-1">{title}</p>
      <p className="text-sm text-[#999999] max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 px-5 py-2 border border-[#E0E0E0] hover:border-[#CCCCCC] text-sm font-semibold text-[#333333] rounded-xl transition-colors hover:bg-[#F5F5F5]"
        >
          Try again
        </button>
      )}
    </div>
  );
}
