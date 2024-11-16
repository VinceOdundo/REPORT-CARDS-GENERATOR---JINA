import React, { createContext, useContext } from "react";
import { analyticsService } from "./analyticsService";
import { useAuth } from "../auth/useAuth";

interface AnalyticsContextType {
  trackEvent: (event: string, metadata?: Record<string, any>) => Promise<void>;
  trackReportGeneration: (reportCount: number) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType>(
  {} as AnalyticsContextType
);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  const value = {
    trackEvent: async (event: string, metadata?: Record<string, any>) => {
      if (!user?.id) return;
      await analyticsService.trackEvent(user.id, event, metadata);
    },
    trackReportGeneration: async (reportCount: number) => {
      if (!user?.id) return;
      await analyticsService.trackReportGeneration(user.id, reportCount);
    },
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
