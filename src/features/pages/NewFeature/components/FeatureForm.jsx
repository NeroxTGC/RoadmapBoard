import React, { useState } from 'react';
import { useAction } from 'wasp/client/operations';
import { createFeature } from 'wasp/client/operations';
import { useNavigate } from 'react-router-dom';
import { Link } from 'wasp/client/router';
import { Loader2 } from 'lucide-react';
import { MarkdownEditor } from '../../../components/MarkdownEditor';

export const FeatureForm = () => {
  const navigate = useNavigate();
  const createFeatureFn = useAction(createFeature);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Title and description are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const feature = await createFeatureFn({
        title,
        description
      });
      navigate(`/features/${feature.id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-0 bg-white dark:bg-gray-800 rounded-b-lg shadow-sm">
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col h-full gap-6">
          <div className="shrink-0">
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter a clear, concise title"
            />
          </div>

          <div className="flex-1 min-h-0">
            <label 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description
            </label>
            <div className="h-full min-h-0">
              <MarkdownEditor
                value={description}
                onChange={setDescription}
                placeholder="Describe your feature request in detail. You can use Markdown for formatting.

## Problem/Need
Describe the problem this feature would solve...

## Proposed Solution
Explain your proposed solution...

## Benefits
List the benefits of implementing this feature..."
                minHeight="400px"
              />
            </div>
          </div>

          <div className="shrink-0 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/features"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Feature'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 