import React from 'react';
import { Link } from 'wasp/client/router';
import { ArrowLeft } from 'lucide-react';

export const FeatureHeader = () => {
  return (
    <div className="shrink-0">
      <div className="mb-4 sm:mb-6">
        <Link
          to="/features"
          className="inline-flex items-center text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-1" />
          <span className="text-sm sm:text-base">Back to Feature Board</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-sm p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          New Feature Request
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Share your ideas and suggestions to help improve the platform.
        </p>
      </div>
    </div>
  );
}; 