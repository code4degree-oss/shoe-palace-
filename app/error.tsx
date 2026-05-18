'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold font-serif mb-3">Something went wrong!</h2>
        <p className="text-gray-500 text-sm mb-8">
          We apologize for the inconvenience. Our team has been notified of this issue.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full py-3.5 px-6 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all text-base"
          >
            Try again
          </button>
          <Link 
            href="/"
            className="w-full py-3.5 px-6 bg-white text-black border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all text-base"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
