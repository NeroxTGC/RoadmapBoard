import React, { useMemo } from 'react';
import { useAction } from 'wasp/client/operations';
import { upvoteFeature } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { FEATURE_STATES } from '../../../config/featureStates';
import { FeatureStateIcon } from '../../../components/FeatureStateIcon';

export const BoardColumns = ({ features, user, filters }) => {
  const upvoteFeatureFn = useAction(upvoteFeature);

  const columns = useMemo(() => {
    if (!features) return {};

    let filteredFeatures = features;
    
    if (filters.searchTerm) {
      filteredFeatures = filteredFeatures.filter(f => 
        f.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        f.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    filteredFeatures = [...filteredFeatures].sort((a, b) => {
      switch (filters.sortBy) {
        case 'upvotes':
          return b.upvoteCount - a.upvoteCount;
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'comments':
          return b.commentCount - a.commentCount;
        default:
          return 0;
      }
    });

    return Object.keys(FEATURE_STATES).reduce((acc, status) => {
      acc[status] = filteredFeatures.filter(f => f.status === status);
      return acc;
    }, {});
  }, [features, filters]);

  const handleUpvote = async (featureId) => {
    if (!user) return;
    try {
      await upvoteFeatureFn({ featureId: parseInt(featureId) });
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 h-full overflow-hidden">
      {Object.entries(FEATURE_STATES).map(([status, config]) => (
        <div key={status} className="flex flex-col min-h-0">
          <div className="shrink-0 flex items-center gap-2 mb-2 sm:mb-3 px-1">
            <FeatureStateIcon state={status} className="w-4 sm:w-5 h-4 sm:h-5" />
            <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
              {config.title}
              <span className="ml-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                ({columns[status]?.length || 0})
              </span>
            </h2>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 sm:p-3 flex-1 min-h-0 overflow-hidden flex flex-col">
            <div className="space-y-2 sm:space-y-3 overflow-y-auto flex-1">
              {columns[status]?.map(feature => (
                <div
                  key={feature.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {feature.description}
                    </p>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        {user ? (
                          <button
                            onClick={() => handleUpvote(feature.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded ${
                              feature.isUpvotedByUser
                                ? 'bg-primary-100 dark:bg-primary-600 text-primary-500 dark:text-primary-100'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <ThumbsUp className="w-3 sm:w-4 h-3 sm:h-4" />
                            <span>{feature.upvoteCount}</span>
                          </button>
                        ) : (
                          <Link
                            to="/login"
                            className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            <ThumbsUp className="w-3 sm:w-4 h-3 sm:h-4" />
                            <span>{feature.upvoteCount}</span>
                          </Link>
                        )}
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <MessageSquare className="w-3 sm:w-4 h-3 sm:h-4" />
                          {feature.commentCount}
                        </span>
                      </div>
                      <Link
                        to={`/features/${feature.id}`}
                        className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {columns[status]?.length === 0 && (
                <div className="text-center py-4 sm:py-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  No features in this column
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 