import { useState } from 'react';
import { reportService } from './reportService';
import { useAuth } from '../auth/useAuth';
import { Student, School } from '../../types/school';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const generateReport = async (students: Student[], schoolInfo: School) => {
    setLoading(true);
    try {
      const result = await reportService.generate(students, schoolInfo, user!.id);
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return {
    generateReport,
    loading
  };
};