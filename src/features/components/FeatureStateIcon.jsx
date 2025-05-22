import React from 'react';
import { getFeatureStateConfig } from '../config/featureStates';

export const FeatureStateIcon = ({ state, className = "w-5 h-5" }) => {
  const config = getFeatureStateConfig(state);
  if (!config || !config.iconComponent) return null;
  
  const IconComponent = config.iconComponent;
  return <IconComponent className={className} />;
}; 