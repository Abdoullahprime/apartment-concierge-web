'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 max-w-sm w-full text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto text-2xl">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-[#333333]">Something went wrong</h2>
        <p className="text-sm text-[#757575]">
          An unexpected error occurred. Try refreshing the page.
        </p>
        {error.digest && (
          <p className="text-xs text-[#757575] font-mono bg-[#F5F5F5] rounded-lg px-3 py-1">
            {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="w-full bg-[#2E7D32] text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-[#1B5E20] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
