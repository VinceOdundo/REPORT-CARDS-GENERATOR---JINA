import React, { createContext, useContext, useState, useEffect } from "react";
import { schoolService } from "./schoolService";
import { useAuth } from "../auth/useAuth";
import { School } from "../../types";

const SchoolContext = createContext<{
  school: School | null;
  loading: boolean;
  error: Error | null;
  updateSchool: (data: Partial<School>) => Promise<void>;
}>({
  school: null,
  loading: true,
  error: null,
  updateSchool: async () => {},
});

export const SchoolProvider: React.FC = ({ children }) => {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    const loadSchool = async () => {
      try {
        const schoolData = await schoolService.getSchool(user.uid);
        if (mounted) {
          setSchool(schoolData);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSchool();

    return () => {
      mounted = false;
    };
  }, [user]);

  const updateSchool = async (data: Partial<School>) => {
    if (!school) return;
    try {
      await schoolService.updateSchool(school.id, data);
      setSchool({ ...school, ...data });
    } catch (err) {
      setError(err as Error);
    }
  };

  return (
    <SchoolContext.Provider value={{ school, loading, error, updateSchool }}>
      {children}
    </SchoolContext.Provider>
  );
};
