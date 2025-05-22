import React from 'react';
import { FeatureHeader } from './components/FeatureHeader';
import { FeatureForm } from './components/FeatureForm';

export const NewFeaturePage = () => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex flex-col min-h-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <FeatureHeader />
        <div className="flex-1 min-h-0 overflow-hidden">
          <FeatureForm />
        </div>
      </div>
    </div>
  );
}; 