import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getAllFeatures } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import { Link } from 'wasp/client/router';
import { Plus } from 'lucide-react';
import { BoardHeader } from './components/BoardHeader';
import { BoardFilters } from './components/BoardFilters';
import { BoardColumns } from './components/BoardColumns';

export const FeatureBoardPage = () => {
  const { data: features, isLoading, error } = useQuery(getAllFeatures);
  const { data: user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('upvotes');

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 text-red-500 dark:text-red-400">Error: {error.message}</div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="shrink-0">
            <BoardHeader />
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shrink-0">
            <div className="lg:w-[600px]">
              <BoardFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
            
            {user ? (
              <div className="flex justify-end">
                <Link
                  to="/features/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Feature
                </Link>
              </div>
            ) : (
              <div className="flex justify-end">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Login to Submit Feature
                </Link>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <BoardColumns 
              features={features}
              user={user}
              filters={{
                searchTerm,
                sortBy
              }}
              showAllColumns={user?.isAdmin}
              isAdmin={user?.isAdmin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 