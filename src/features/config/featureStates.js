import { 
  Rocket, 
  Hammer, 
  CheckCircle2, 
  Calendar
} from 'lucide-react';

export const FEATURE_STATES = {
  PROPOSED: {
    key: 'PROPOSED',
    title: 'Proposed',
    label: 'Proposed',
    color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    iconComponent: Rocket,
  },
  PLANNED: {
    key: 'PLANNED',
    title: 'Planned',
    label: 'Planned',
    color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    iconComponent: Calendar,
  },
  IN_PROGRESS: {
    key: 'IN_PROGRESS',
    title: 'In Progress',
    label: 'In Progress',
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    iconComponent: Hammer,
  },
  COMPLETED: {
    key: 'COMPLETED',
    title: 'Completed',
    label: 'Completed',
    color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    iconComponent: CheckCircle2,
  },
};

// Helper functions
export const getValidFeatureStates = () => Object.keys(FEATURE_STATES);

export const isValidFeatureState = (state) => {
  return getValidFeatureStates().includes(state);
};

export const getFeatureStateConfig = (state) => {
  return FEATURE_STATES[state] || null;
};

export const getFeatureStateColor = (state) => {
  return getFeatureStateConfig(state)?.color || '';
};

export const getFeatureStateLabel = (state) => {
  return getFeatureStateConfig(state)?.label || state;
};

export default FEATURE_STATES; 