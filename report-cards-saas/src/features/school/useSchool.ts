import { useContext } from 'react';
import { SchoolContext } from './SchoolProvider';

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within SchoolProvider');
  }
  return context;
};