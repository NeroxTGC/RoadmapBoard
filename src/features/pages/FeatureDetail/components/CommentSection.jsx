import React, { useState } from 'react';
import { useAction } from 'wasp/client/operations';
import { commentOnFeature, reactToComment } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { Trash2, ThumbsUp, Heart, Laugh, MessageSquarePlus, LogIn } from 'lucide-react';
import { MarkdownEditor } from '../../../components/MarkdownEditor';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const REACTIONS = [
  { 
    type: 'LIKE', 
    icon: ThumbsUp, 
    label: 'Like',
    activeClass: 'bg-primary-100 dark:bg-primary-600 text-primary-500 dark:text-primary-400',
    iconClass: 'text-primary-500 dark:text-primary-400'
  },
  { 
    type: 'HEART', 
    icon: Heart, 
    label: 'Love',
    activeClass: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
    iconClass: 'text-red-600 dark:text-red-400'
  },
  { 
    type: 'LAUGH', 
    icon: Laugh, 
    label: 'Laugh',
    activeClass: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',
    iconClass: 'text-yellow-600 dark:text-yellow-400'
  }
];

const UserInitialsIcon = ({ username, size = 'md' }) => {
  const initials = username
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center font-medium text-white shadow-sm`}>
      {initials}
    </div>
  );
};

// Utility functions
const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getGradientByUsername = (username) => {
  if (!username) return 'from-gray-500 to-gray-600';
  
  // Generate a consistent color based on username
  const colors = [
    'from-primary-500 to-primary-600',
    'from-red-500 to-red-600',
    'from-green-500 to-green-600',
    'from-yellow-500 to-yellow-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600'
  ];
  
  const hash = username.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

const groupReactions = (reactions) => {
  if (!reactions) return {};
  return reactions.reduce((acc, reaction) => {
    if (!acc[reaction.type]) {
      acc[reaction.type] = [];
    }
    acc[reaction.type].push(reaction);
    return acc;
  }, {});
};

export const CommentSection = ({ feature, user, onDeleteComment, canDeleteComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentOnFeatureFn = useAction(commentOnFeature);
  const reactToCommentFn = useAction(reactToComment);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await commentOnFeatureFn({
        featureId: feature.id,
        content: newComment.trim()
      });
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (commentId, type) => {
    try {
      await reactToCommentFn({ commentId, type });
    } catch (error) {
      console.error('Failed to react:', error);
    }
  };

  // Sort comments from oldest to newest
  const sortedComments = [...(feature.comments || [])].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Comments ({feature.comments?.length || 0})
      </h2>

      {user ? (
        <div className="mb-6">
          <div className="mb-3">
            <MarkdownEditor
              value={newComment}
              onChange={setNewComment}
              minHeight="100px"
              placeholder="Write your comment here..."
            />
          </div>
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              newComment.trim()
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <MessageSquarePlus className="w-4 sm:w-5 h-4 sm:h-5" />
            Add Comment
          </button>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3">
            Please log in to join the discussion
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm sm:text-base font-medium"
          >
            <LogIn className="w-4 sm:w-5 h-4 sm:h-5" />
            Log In
          </Link>
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        {feature.comments?.map((comment) => (
          <div key={comment.id} className="relative">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-medium text-white ${getGradientByUsername(comment.author?.username || 'anon')}`}>
                  {getInitials(comment.author?.username || 'User')}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1 sm:mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                      {comment.author?.username || `User #${String(comment.authorId).slice(-4)}`}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {canDeleteComment(comment) && (
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="p-1 sm:p-1.5 rounded-full text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                    </button>
                  )}
                </div>
                <div className="prose prose-sm sm:prose dark:prose-invert">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw]}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    {comment.content}
                  </ReactMarkdown>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-3">
                  {user && comment.authorId !== user.id && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleReaction(comment.id, 'LIKE')}
                        className={`p-1 sm:p-1.5 rounded-full transition-colors ${
                          comment.reactions?.some(r => r.type === 'LIKE' && r.userId === user.id)
                            ? 'bg-primary-100 dark:bg-primary-600 text-primary-500 dark:text-primary-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <ThumbsUp className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleReaction(comment.id, 'HEART')}
                        className={`p-1 sm:p-1.5 rounded-full transition-colors ${
                          comment.reactions?.some(r => r.type === 'HEART' && r.userId === user.id)
                            ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <Heart className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleReaction(comment.id, 'LAUGH')}
                        className={`p-1 sm:p-1.5 rounded-full transition-colors ${
                          comment.reactions?.some(r => r.type === 'LAUGH' && r.userId === user.id)
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <Laugh className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>
                    </div>
                  )}
                </div>
                {comment.reactions?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(groupReactions(comment.reactions)).map(([type, reactions]) => (
                      <div
                        key={type}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm ${
                          type === 'LIKE'
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400'
                            : type === 'HEART'
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        }`}
                      >
                        {type === 'LIKE' ? (
                          <ThumbsUp className="w-3 sm:w-4 h-3 sm:h-4" />
                        ) : type === 'HEART' ? (
                          <Heart className="w-3 sm:w-4 h-3 sm:h-4" />
                        ) : (
                          <Laugh className="w-3 sm:w-4 h-3 sm:h-4" />
                        )}
                        <span>{reactions.length}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {feature.comments?.length === 0 && (
          <div className="text-center py-6 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}; 