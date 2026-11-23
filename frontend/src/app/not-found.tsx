import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 max-w-sm w-full text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mx-auto text-3xl">
          🔍
        </div>
        <h2 className="text-lg font-bold text-[#333333]">Page not found</h2>
        <p className="text-sm text-[#757575]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="block w-full bg-[#2E7D32] text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-[#1B5E20] transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
