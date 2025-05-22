import React from 'react';
import { Link } from 'wasp/client/router';
import { ArrowLeft } from 'lucide-react';
import { FEATURE_STATES } from '../../../config/featureStates';

export const FeatureHeader = ({ feature, user }) => {
  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <Link
          to="/features"
          className="inline-flex items-center text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-1" />
          <span className="text-sm sm:text-base">Back to Feature Board</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${FEATURE_STATES[feature.status].color}`}>
            {FEATURE_STATES[feature.status].label}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {feature.title}
        </h1>

        {user?.isAdmin && (
          <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <span>Posted by {feature.user.username}</span>
            <span className="hidden sm:inline">•</span>
            <span>{new Date(feature.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}; 