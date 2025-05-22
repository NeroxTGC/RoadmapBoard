import React from 'react';

export const BoardHeader = () => {
  return (
    <div className="flex items-center justify-between px-4 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
        Feature Board
      </h1>
      <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
        Vote and discuss new features
      </p>
    </div>
  );
}; 