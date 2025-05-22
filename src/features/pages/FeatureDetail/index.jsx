import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useAction } from 'wasp/client/operations';
import { getFeatureById, deleteComment, deleteFeature, updateFeatureStatus, updateFeature } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import { FeatureHeader } from './components/FeatureHeader';
import { FeatureContent } from './components/FeatureContent';
import { CommentSection } from './components/CommentSection';
import { Trash2, Save, Edit2, X } from 'lucide-react';
import { FEATURE_STATES } from '../../config/featureStates';
import { MarkdownEditor } from '../../components/MarkdownEditor';

export const FeatureDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: feature, isLoading, error } = useQuery(getFeatureById, { id: parseInt(id) });
  const { data: user } = useAuth();
  const deleteCommentFn = useAction(deleteComment);
  const deleteFeatureFn = useAction(deleteFeature);
  const updateFeatureStatusFn = useAction(updateFeatureStatus);
  const updateFeatureFn = useAction(updateFeature);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteCommentFn({ commentId });
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleDeleteFeature = async () => {
    if (!window.confirm('Are you sure you want to delete this feature? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteFeatureFn({ featureId: feature.id });
      navigate('/feature');
    } catch (error) {
      console.error('Failed to delete feature:', error);
      alert('Failed to delete feature. Please try again.');
    }
  };

  const handleStatusChange = async () => {
    if (!selectedStatus || selectedStatus === feature.status) return;
    
    try {
      await updateFeatureStatusFn({ 
        featureId: feature.id, 
        newStatus: selectedStatus
      });
      setSelectedStatus('');
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const startEditing = () => {
    setEditedTitle(feature.title);
    setEditedDescription(feature.description);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedTitle('');
    setEditedDescription('');
  };

  const handleSaveEdit = async () => {
    if (!editedTitle.trim() || !editedDescription.trim()) {
      alert('Title and description cannot be empty');
      return;
    }

    try {
      await updateFeatureFn({
        featureId: feature.id,
        data: {
          title: editedTitle.trim(),
          description: editedDescription.trim()
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update feature:', error);
      alert('Failed to update feature. Please try again.');
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 text-red-500 dark:text-red-400">Error: {error.message}</div>
  );

  if (!feature) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Feature not found</h1>
        <Link
          to="/feature"
          className="mt-4 inline-block text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Return to Feature Board
        </Link>
      </div>
    </div>
  );

  const canDeleteComment = (comment) => {
    if (!user) return false;
    return user.isAdmin || comment.authorId === user.id;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-6">
          {/* Admin Controls */}
          {user?.isAdmin && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <select
                    value={selectedStatus || feature.status}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex-1 max-w-xs px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {Object.entries(FEATURE_STATES).map(([status, config]) => (
                      <option key={status} value={status}>
                        {config.title}
                      </option>
                    ))}
                  </select>
                  {selectedStatus && selectedStatus !== feature.status && (
                    <button
                      onClick={handleStatusChange}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      Save Status
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      onClick={startEditing}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Feature
                    </button>
                  ) : (
                    <button
                      onClick={cancelEditing}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleDeleteFeature}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Feature
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feature Content */}
          {isEditing && user?.isAdmin ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <MarkdownEditor
                    value={editedDescription}
                    onChange={setEditedDescription}
                    minHeight="300px"
                  />
                </div>
                <button
                  onClick={handleSaveEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <FeatureHeader feature={feature} user={user} />
              <FeatureContent feature={feature} user={user} />
            </>
          )}

          <CommentSection 
            feature={feature} 
            user={user} 
            onDeleteComment={handleDeleteComment}
            canDeleteComment={canDeleteComment}
          />
        </div>
      </div>
    </div>
  );
}; 