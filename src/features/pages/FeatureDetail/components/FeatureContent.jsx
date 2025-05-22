import React from 'react';
import { useAction } from 'wasp/client/operations';
import { upvoteFeature } from 'wasp/client/operations';
import { ThumbsUp } from 'lucide-react';
import { Link } from 'wasp/client/router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export const FeatureContent = ({ feature, user }) => {
  const upvoteFeatureFn = useAction(upvoteFeature);

  const handleUpvote = async () => {
    if (!user) return;
    try {
      await upvoteFeatureFn({ featureId: parseInt(feature.id) });
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
      <div className="prose prose-sm sm:prose dark:prose-invert max-w-none mb-4 sm:mb-6">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
          className="text-gray-600 dark:text-gray-300"
          components={{
            h1: ({node, ...props}) => <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2" {...props} />,
            a: ({node, ...props}) => <a className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-4 sm:pl-6 space-y-1 mb-3 sm:mb-4" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-4 sm:pl-6 space-y-1 mb-3 sm:mb-4" {...props} />,
            li: ({node, ordered, ...props}) => <li className="text-sm sm:text-base text-gray-900 dark:text-white" {...props} />,
            code: ({node, inline, ...props}) => 
              inline ? (
                <code className="bg-gray-100 dark:bg-gray-700 rounded px-1 py-0.5 text-xs sm:text-sm font-mono" {...props} />
              ) : (
                <code className="block bg-gray-100 dark:bg-gray-700 rounded p-2 sm:p-3 text-xs sm:text-sm font-mono overflow-x-auto mb-3 sm:mb-4" {...props} />
              ),
            blockquote: ({node, ...props}) => (
              <blockquote className="border-l-4 border-gray-200 dark:border-gray-600 pl-3 sm:pl-4 italic mb-3 sm:mb-4 text-sm sm:text-base" {...props} />
            ),
            table: ({node, ...props}) => (
              <div className="overflow-x-auto mb-3 sm:mb-4">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm sm:text-base" {...props} />
              </div>
            ),
            th: ({node, ...props}) => (
              <th className="px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs sm:text-sm font-medium text-gray-900 dark:text-white" {...props} />
            ),
            td: ({node, ...props}) => (
              <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300" {...props} />
            ),
          }}
        >
          {feature.description}
        </ReactMarkdown>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-4">
          {user ? (
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors ${
                feature.isUpvotedByUser
                  ? 'bg-primary-100 dark:bg-primary-600 text-primary-500 dark:text-primary-100'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <ThumbsUp className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="text-sm sm:text-base">{feature.upvotes?.length || 0} Upvotes</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ThumbsUp className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="text-sm sm:text-base">{feature.upvotes?.length || 0} Upvotes</span>
            </Link>
          )}
        </div>

        {user?.isAdmin && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <span>Posted by {feature.user.username}</span>
            <span className="hidden sm:inline">•</span>
            <span>{new Date(feature.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}; 